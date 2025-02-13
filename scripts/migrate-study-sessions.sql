-- Migrar sesiones de estudio para el usuario existente
INSERT INTO public.study_sessions (
    id,
    user_id,
    course_id,
    duration_minutes,
    created_at
)
SELECT 
    gen_random_uuid(), -- Generar nuevo ID
    '7525087e-d98c-4d6b-ba63-bb694a2e4b37', -- ID del usuario Juan Camilo
    course_id,
    COALESCE(duration_minutes, 0),
    created_at
FROM (
    VALUES 
    (
        '19fe5951-5c91-4060-ba11-51428bc3a372', -- ID del curso Start Up
        30, -- duración estimada en minutos
        '2025-01-03T23:58:13.943573+00:00'
    )
) AS data(course_id, duration_minutes, created_at);
