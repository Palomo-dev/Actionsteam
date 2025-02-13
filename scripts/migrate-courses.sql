-- Primero, verificar si hay cursos en la tabla
SELECT COUNT(*) as course_count FROM courses;

-- Migrar los cursos si no hay ninguno
INSERT INTO courses (
    id,
    title,
    description,
    slug,
    level,
    price_cop,
    original_price_cop,
    discount_percentage,
    banner_url,
    thumbnail_url,
    induction_video_url,
    stripe_product_id,
    stripe_price_id,
    created_at,
    updated_at
)
VALUES (
    '1f2a0978-4c1a-4fe4-8c0d-1234567890ab',
    'Curso de Introducción a la Programación',
    'Aprende los fundamentos de la programación desde cero',
    'intro-programacion',
    'beginner',
    99900,
    199900,
    50,
    'https://example.com/banner.jpg',
    'https://example.com/thumbnail.jpg',
    'https://example.com/video.mp4',
    'prod_example123',
    'price_example123',
    NOW(),
    NOW()
);

-- Insertar algunas sesiones de ejemplo para el curso
INSERT INTO course_sessions (
    course_id,
    title,
    description,
    video_url,
    documentation_url,
    duration_seconds,
    created_at,
    updated_at
)
VALUES (
    '1f2a0978-4c1a-4fe4-8c0d-1234567890ab',
    'Introducción al Curso',
    'Bienvenida y descripción general del curso',
    'https://example.com/session1.mp4',
    'https://example.com/docs/session1',
    1800,
    NOW(),
    NOW()
);

-- Verificar que los datos se insertaron correctamente
SELECT c.title, COUNT(cs.id) as session_count
FROM courses c
LEFT JOIN course_sessions cs ON c.id = cs.course_id
GROUP BY c.id, c.title;
