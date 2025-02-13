-- Obtener estructura detallada de las tablas
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    CASE 
        WHEN character_maximum_length IS NOT NULL 
        THEN character_maximum_length::text 
        WHEN numeric_precision IS NOT NULL 
        THEN numeric_precision::text || ',' || numeric_scale::text
        ELSE NULL 
    END as length_or_precision
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN (
    'profiles',
    'courses',
    'course_categories',
    'course_tags',
    'course_sessions',
    'user_courses',
    'study_sessions'
)
ORDER BY table_name, ordinal_position;

-- Obtener restricciones
SELECT
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name,
    CASE 
        WHEN tc.constraint_type = 'FOREIGN KEY' THEN
            ccu.table_name || '.' || ccu.column_name
        ELSE NULL
    END as references_table_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.table_schema = 'public'
AND tc.table_name IN (
    'profiles',
    'courses',
    'course_categories',
    'course_tags',
    'course_sessions',
    'user_courses',
    'study_sessions'
)
ORDER BY tc.table_name, tc.constraint_name;
