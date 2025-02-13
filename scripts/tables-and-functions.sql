-- Crear tablas restantes
CREATE TABLE IF NOT EXISTS public.course_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id uuid REFERENCES public.courses(id),
    title text NOT NULL,
    description text,
    video_url text,
    duration_hours numeric(4,2),
    order_index integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_courses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id),
    course_id uuid REFERENCES public.courses(id),
    progress numeric(5,2) DEFAULT 0,
    study_time_minutes integer DEFAULT 0,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, course_id)
);

CREATE TABLE IF NOT EXISTS public.study_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id),
    course_id uuid REFERENCES public.courses(id),
    session_id uuid REFERENCES public.course_sessions(id),
    start_time timestamp with time zone DEFAULT now(),
    end_time timestamp with time zone,
    duration_minutes numeric(10,2),
    created_at timestamp with time zone DEFAULT now()
);

-- Funciones para calcular duración y progreso
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

    -- Obtener el número de sesiones completadas
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

    -- Actualizar el progreso
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

-- Crear triggers
CREATE TRIGGER calculate_duration_trigger
    BEFORE UPDATE ON public.study_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.calculate_study_session_duration();

CREATE TRIGGER update_progress_trigger
    AFTER UPDATE ON public.study_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_course_progress();

-- Configurar cron job para notificaciones
SELECT cron.schedule(
  'process-auto-notifications',
  '0 0 * * *',
  $$
  SELECT net.http_post(
    url:='https://afjjqienulzsdwlfysex.supabase.co/functions/v1/auto-notifications',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmampxaWVudWx6c2R3bGZ5c2V4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTIyOTIyNywiZXhwIjoyMDU0ODA1MjI3fQ.exdi1BxxbIWBVqpFLHMttrlvebx0r1dPbTNCsBiCc0c"}'::jsonb
  ) AS request_id;
  $$
);
