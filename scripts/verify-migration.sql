-- Verificar perfil del usuario
SELECT id, email, first_name, role, is_subscribed
FROM profiles
WHERE id = '7525087e-d98c-4d6b-ba63-bb694a2e4b37';

-- Verificar cursos migrados
SELECT id, title, description, level, price_cop
FROM courses
ORDER BY created_at;

-- Verificar sesiones de cursos
SELECT id, course_id, title, duration_seconds
FROM course_sessions
ORDER BY course_id;

-- Verificar inscripciones
SELECT uc.id, uc.user_id, uc.course_id, uc.status,
       p.email as user_email,
       c.title as course_title
FROM user_courses uc
JOIN profiles p ON uc.user_id = p.id
JOIN courses c ON uc.course_id = c.id;

-- Verificar sesiones de estudio
SELECT ss.id, ss.user_id, ss.course_id, ss.duration_minutes,
       p.email as user_email,
       c.title as course_title
FROM study_sessions ss
JOIN profiles p ON ss.user_id = p.id
JOIN courses c ON ss.course_id = c.id;
