-- Función para calcular la duración de la sesión de estudio
CREATE OR REPLACE FUNCTION public.calculate_study_session_duration()
RETURNS TRIGGER AS $$
BEGIN
    -- Si la duración no está establecida, usar un valor predeterminado de 30 minutos
    IF NEW.duration_minutes IS NULL THEN
        NEW.duration_minutes := 30;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar el progreso del curso
CREATE OR REPLACE FUNCTION public.update_course_progress()
RETURNS TRIGGER AS $$
DECLARE
    total_duration INTEGER;
    studied_duration INTEGER;
    progress_percentage NUMERIC;
BEGIN
    -- Calcular duración total del curso
    SELECT COALESCE(SUM(duration_seconds), 0)
    INTO total_duration
    FROM course_sessions
    WHERE course_id = NEW.course_id;

    -- Calcular tiempo total estudiado
    SELECT COALESCE(SUM(duration_minutes * 60), 0)
    INTO studied_duration
    FROM study_sessions
    WHERE user_id = NEW.user_id AND course_id = NEW.course_id;

    -- Calcular porcentaje de progreso
    IF total_duration > 0 THEN
        progress_percentage := (studied_duration::NUMERIC / total_duration::NUMERIC) * 100;
    ELSE
        progress_percentage := 0;
    END IF;

    -- Actualizar el progreso en user_courses
    UPDATE user_courses
    SET 
        progress = LEAST(progress_percentage, 100),
        study_time_seconds = studied_duration,
        last_accessed = CURRENT_TIMESTAMP,
        status = CASE 
            WHEN progress_percentage >= 100 THEN 'completed'
            WHEN progress_percentage > 0 THEN 'in_progress'
            ELSE status
        END,
        completed_at = CASE 
            WHEN progress_percentage >= 100 AND completed_at IS NULL THEN CURRENT_TIMESTAMP
            ELSE completed_at
        END,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = NEW.user_id AND course_id = NEW.course_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para calcular la duración de la sesión de estudio
DROP TRIGGER IF EXISTS calculate_study_session_duration_trigger ON study_sessions;
CREATE TRIGGER calculate_study_session_duration_trigger
    BEFORE INSERT ON study_sessions
    FOR EACH ROW
    EXECUTE FUNCTION calculate_study_session_duration();

-- Trigger para actualizar el progreso del curso
DROP TRIGGER IF EXISTS update_course_progress_trigger ON study_sessions;
CREATE TRIGGER update_course_progress_trigger
    AFTER INSERT ON study_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_course_progress();
