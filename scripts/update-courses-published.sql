-- 1. Verificar la estructura de la tabla courses
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'courses';

-- 2. Agregar la columna is_published si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'courses' AND column_name = 'is_published'
    ) THEN
        ALTER TABLE courses ADD COLUMN is_published BOOLEAN DEFAULT true;
    END IF;
END $$;

-- 3. Actualizar todos los cursos existentes a published = true
UPDATE courses
SET is_published = true
WHERE is_published IS NULL OR is_published = false;

-- 4. Verificar los cursos y su estado de publicación
SELECT id, title, is_published, created_at, updated_at
FROM courses
ORDER BY created_at DESC;
