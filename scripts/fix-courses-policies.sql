-- 1. Habilitar RLS en la tabla courses si no está habilitado
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "Enable read access for all users" ON courses;
DROP POLICY IF EXISTS "Allow public read access for published courses" ON courses;
DROP POLICY IF EXISTS "Allow authenticated users to view courses" ON courses;

-- 3. Crear política para permitir lectura pública de cursos publicados
CREATE POLICY "Enable read access for all users"
ON courses
FOR SELECT
USING (true);  -- Permitir lectura de todos los cursos públicamente

-- 4. Verificar que RLS está habilitado y las políticas están configuradas
SELECT 
    tablename,
    rls_enabled,
    policies
FROM (
    SELECT 
        tablename,
        rls_enabled,
        array_agg(policyname) as policies
    FROM (
        SELECT 
            t.tablename,
            has_row_level_security(t.schemaname::name, t.tablename::name) as rls_enabled,
            p.policyname
        FROM pg_tables t
        LEFT JOIN pg_policies p 
        ON t.tablename = p.tablename 
        AND t.schemaname = p.schemaname
        WHERE t.schemaname = 'public' 
        AND t.tablename = 'courses'
    ) subq
    GROUP BY tablename, rls_enabled
) final_query;
