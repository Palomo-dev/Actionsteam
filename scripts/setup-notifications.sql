-- Habilitar las extensiones necesarias
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Crear tabla de notificaciones si no existe
CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id),
    title text NOT NULL,
    message text NOT NULL,
    type text DEFAULT 'info',
    read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Función para enviar notificaciones diarias
CREATE OR REPLACE FUNCTION public.send_daily_notifications()
RETURNS void AS $$
DECLARE
    user_record RECORD;
    last_access timestamp with time zone;
    course_title text;
BEGIN
    -- Buscar usuarios con cursos en progreso
    FOR user_record IN 
        SELECT DISTINCT 
            p.id as user_id,
            p.email,
            p.first_name,
            uc.course_id,
            uc.last_accessed,
            c.title as course_title
        FROM profiles p
        JOIN user_courses uc ON p.id = uc.user_id
        JOIN courses c ON uc.course_id = c.id
        WHERE uc.status = 'in_progress'
    LOOP
        -- Si el usuario no ha accedido al curso en más de 24 horas
        IF user_record.last_accessed < (CURRENT_TIMESTAMP - interval '24 hours') THEN
            -- Crear notificación de recordatorio
            INSERT INTO notifications (
                user_id,
                title,
                message,
                type
            ) VALUES (
                user_record.user_id,
                'Continúa tu aprendizaje',
                format('¡Hola %s! No olvides continuar con tu curso "%s". ¡Te esperamos!', 
                       user_record.first_name, 
                       user_record.course_title),
                'reminder'
            );
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Programar la tarea para ejecutarse diariamente a las 9:00 AM
SELECT cron.schedule(
    'send-daily-notifications',
    '0 9 * * *',
    $$SELECT send_daily_notifications()$$
);
