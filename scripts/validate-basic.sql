-- 1. Verificar tablas principales
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Verificar funciones
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
