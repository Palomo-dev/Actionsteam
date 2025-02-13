-- 1. Verificar los cursos actuales y su estado de publicación
SELECT id, title, is_published 
FROM courses;

-- 2. Asegurarnos que los cursos tengan is_published = true
UPDATE courses 
SET is_published = true 
WHERE is_published IS NULL OR is_published = false;

-- 3. Configurar RLS para courses
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- 4. Crear política para permitir lectura pública de cursos publicados
DROP POLICY IF EXISTS "Allow public read access for published courses" ON courses;
CREATE POLICY "Allow public read access for published courses"
ON courses FOR SELECT
USING (is_published = true);

-- 5. Crear política para permitir lectura de cursos relacionados
DROP POLICY IF EXISTS "Allow enrolled users to view their courses" ON courses;
CREATE POLICY "Allow enrolled users to view their courses"
ON courses FOR SELECT
TO authenticated
USING (
    id IN (
        SELECT course_id 
        FROM user_courses 
        WHERE user_id = auth.uid()
    )
);

-- 6. Verificar las políticas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'courses';

-- 7. Verificar que hay datos en las tablas relacionadas
SELECT 
    c.id,
    c.title,
    COUNT(DISTINCT cr.id) as ratings_count,
    COUNT(DISTINCT uc.id) as enrollments_count,
    COUNT(DISTINCT i.id) as instructors_count
FROM courses c
LEFT JOIN course_ratings cr ON c.id = cr.course_id
LEFT JOIN user_courses uc ON c.id = uc.course_id
LEFT JOIN instructors i ON c.instructor_id = i.id
GROUP BY c.id, c.title;
