-- 1. Habilitar RLS en la tabla courses
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas existentes
DROP POLICY IF EXISTS "Enable read access for all users" ON courses;
DROP POLICY IF EXISTS "Allow public read access for published courses" ON courses;
DROP POLICY IF EXISTS "Allow authenticated users to view courses" ON courses;

-- 3. Crear política para permitir lectura pública
CREATE POLICY "Enable read access for all users"
ON courses
FOR SELECT
USING (true);

-- 4. Verificar las políticas actuales
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
AND tablename = 'courses';
