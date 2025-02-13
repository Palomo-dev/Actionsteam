-- 1. Verificar tablas y sus relaciones
WITH table_counts AS (
    SELECT 
        'achievements' as table_name, COUNT(*) as count FROM achievements UNION ALL
    SELECT 'admin_notifications', COUNT(*) FROM admin_notifications UNION ALL
    SELECT 'admin_permissions', COUNT(*) FROM admin_permissions UNION ALL
    SELECT 'chat_conversations', COUNT(*) FROM chat_conversations UNION ALL
    SELECT 'chat_messages', COUNT(*) FROM chat_messages UNION ALL
    SELECT 'course_categories', COUNT(*) FROM course_categories UNION ALL
    SELECT 'course_evaluations', COUNT(*) FROM course_evaluations UNION ALL
    SELECT 'course_sessions', COUNT(*) FROM course_sessions UNION ALL
    SELECT 'courses', COUNT(*) FROM courses UNION ALL
    SELECT 'exchange_rates', COUNT(*) FROM exchange_rates UNION ALL
    SELECT 'instructors', COUNT(*) FROM instructors UNION ALL
    SELECT 'notifications', COUNT(*) FROM notifications UNION ALL
    SELECT 'payments', COUNT(*) FROM payments UNION ALL
    SELECT 'profiles', COUNT(*) FROM profiles UNION ALL
    SELECT 'study_sessions', COUNT(*) FROM study_sessions UNION ALL
    SELECT 'subscription_plans', COUNT(*) FROM subscription_plans UNION ALL
    SELECT 'subscriptions', COUNT(*) FROM subscriptions UNION ALL
    SELECT 'user_courses', COUNT(*) FROM user_courses UNION ALL
    SELECT 'video_metrics', COUNT(*) FROM video_metrics
)
SELECT * FROM table_counts ORDER BY table_name;

-- 2. Verificar funciones y triggers
SELECT 
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- 3. Verificar extensiones
SELECT extname, extversion
FROM pg_extension
ORDER BY extname;

-- 4. Verificar permisos y políticas de seguridad
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
ORDER BY tablename, policyname;

-- 5. Verificar índices
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 6. Verificar integridad de datos clave
SELECT 
    'user_courses' as check_name,
    COUNT(*) as total_records,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT course_id) as unique_courses
FROM user_courses
UNION ALL
SELECT 
    'study_sessions',
    COUNT(*),
    COUNT(DISTINCT user_id),
    COUNT(DISTINCT course_id)
FROM study_sessions;

-- 7. Verificar configuración de notificaciones
SELECT EXISTS (
    SELECT 1 
    FROM pg_cron.job 
    WHERE jobname = 'send-daily-notifications'
) as notifications_configured;
