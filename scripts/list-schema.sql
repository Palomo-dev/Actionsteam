-- Listar todas las tablas públicas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Listar todas las funciones públicas
SELECT routine_name, data_type as return_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- Listar todas las extensiones instaladas
SELECT extname, extversion
FROM pg_extension
ORDER BY extname;
