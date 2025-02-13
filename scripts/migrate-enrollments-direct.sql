-- Insertar inscripciones solo para el usuario existente
INSERT INTO public.user_courses (
    id,
    user_id,
    course_id,
    status,
    created_at,
    updated_at
)
VALUES 
(
    'a7fdf4d7-5726-45fc-b8c8-444e8917942f',
    '7525087e-d98c-4d6b-ba63-bb694a2e4b37', -- ID del usuario Juan Camilo
    '19fe5951-5c91-4060-ba11-51428bc3a372', -- ID del curso Start Up
    'completed',
    '2025-01-03T23:58:13.943573+00:00',
    '2025-01-03T23:58:13.943573+00:00'
)
ON CONFLICT (id) DO UPDATE SET
    status = EXCLUDED.status,
    updated_at = EXCLUDED.updated_at;
