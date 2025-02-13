-- 1. Eliminar todas las políticas existentes de SELECT
DROP POLICY IF EXISTS "Anyone can view published courses" ON courses;
DROP POLICY IF EXISTS "Allow enrolled users to view their courses" ON courses;
DROP POLICY IF EXISTS "Enable read access for all users" ON courses;

-- 2. Crear una única política para lectura pública de cursos publicados
CREATE POLICY "Public can view published courses"
ON courses
FOR SELECT
TO public
USING (is_published = true);

-- 3. Verificar las políticas actuales
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'courses'
ORDER BY cmd;
