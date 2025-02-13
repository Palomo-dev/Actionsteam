-- Verificar configuración de auth.users
SELECT EXISTS (
    SELECT 1 
    FROM pg_tables 
    WHERE schemaname = 'auth' 
    AND tablename = 'users'
) as auth_users_exists;

-- Verificar triggers en auth.users
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth' 
AND event_object_table = 'users';

-- Verificar que la función handle_new_user tiene los permisos correctos
SELECT 
    p.proname as function_name,
    p.prosecdef as security_definer,
    p.provolatile as volatile,
    p.proleakproof as leakproof
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
AND p.proname = 'handle_new_user';
