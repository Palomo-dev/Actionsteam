-- Enable the required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the cron job to run daily at midnight
SELECT cron.schedule(
  'process-auto-notifications',
  '0 0 * * *',
  $$
  SELECT net.http_post(
    url:='https://upcfokdeubxwjiibapnc.supabase.co/functions/v1/auto-notifications',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  ) AS request_id;
  $$
);
-- Actualizar la función que calcula el progreso
CREATE OR REPLACE FUNCTION public.calculate_study_session_duration()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
    -- Calcula la duración en minutos cuando se actualiza end_time
    IF NEW.end_time IS NOT NULL AND OLD.end_time IS NULL THEN
        NEW.duration_minutes := EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time))/60;
        
        -- Actualiza el tiempo total de estudio en user_courses
        UPDATE user_courses
        SET study_time_minutes = COALESCE(study_time_minutes, 0) + NEW.duration_minutes
        WHERE user_id = NEW.user_id AND course_id = NEW.course_id;
    END IF;
    
    RETURN NEW;
END;
$function$;

-- Actualizar la función que calcula el progreso del curso
CREATE OR REPLACE FUNCTION public.update_course_progress()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
    total_duration INTEGER;
    completed_sessions INTEGER;
    total_sessions INTEGER;
BEGIN
    -- Obtener la duración total del curso en minutos
    SELECT COALESCE(SUM(duration_hours) * 60, 0)
    INTO total_duration
    FROM course_sessions
    WHERE course_id = NEW.course_id;

    -- Obtener el número de sesiones completadas (más del 90% de progreso)
    SELECT COUNT(*)
    INTO completed_sessions
    FROM study_sessions ss
    WHERE ss.course_id = NEW.course_id
    AND ss.user_id = NEW.user_id
    AND ss.end_time IS NOT NULL;

    -- Obtener el número total de sesiones
    SELECT COUNT(*)
    INTO total_sessions
    FROM course_sessions
    WHERE course_id = NEW.course_id;

    -- Actualizar el progreso basado en sesiones completadas y tiempo total
    UPDATE user_courses uc
    SET progress = LEAST(
        ROUND(
            (completed_sessions::float / NULLIF(total_sessions, 0)::float * 100)::numeric,
            2
        ),
        100
    )
    WHERE uc.course_id = NEW.course_id 
    AND uc.user_id = NEW.user_id;
    
    RETURN NEW;
END;
$function$;
