-- Verificar tipos de enumeración
SELECT t.typname, e.enumlabel
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname IN ('course_level', 'notification_type', 'user_role')
ORDER BY t.typname, e.enumsortorder;

-- Verificar tablas y sus columnas
SELECT 
    t.table_name,
    c.column_name,
    c.data_type,
    c.column_default,
    c.is_nullable
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE t.table_schema = 'public' 
AND t.table_type = 'BASE TABLE'
AND t.table_name IN (
    'profiles',
    'course_categories',
    'courses',
    'course_sessions',
    'user_courses',
    'study_sessions'
)
ORDER BY t.table_name, c.ordinal_position;

-- Verificar triggers
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- Verificar funciones
SELECT 
    p.proname as function_name,
    pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname IN ('calculate_study_session_duration', 'update_course_progress');

-- Verificar cron jobs
SELECT * FROM cron.job;
