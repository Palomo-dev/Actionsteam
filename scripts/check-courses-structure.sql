-- 1. Verificar la estructura de la tabla courses
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'courses'
ORDER BY ordinal_position;

-- 2. Verificar las foreign keys
SELECT
    tc.table_schema, 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name = 'courses';

-- 3. Verificar los índices
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'courses';

-- 4. Mostrar un ejemplo de curso con todas sus relaciones
SELECT 
    c.*,
    json_agg(DISTINCT cr.*) as ratings,
    json_agg(DISTINCT uc.*) as enrollments,
    json_agg(DISTINCT i.*) as instructor_info
FROM courses c
LEFT JOIN course_ratings cr ON c.id = cr.course_id
LEFT JOIN user_courses uc ON c.id = uc.course_id
LEFT JOIN instructors i ON c.instructor_id = i.id
GROUP BY c.id
LIMIT 1;
