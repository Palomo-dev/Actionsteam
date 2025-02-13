-- Probar la conexión contando registros de algunas tablas
SELECT 
    dblink_exec('db_link', 'SELECT COUNT(*) FROM profiles') as profiles_count,
    dblink_exec('db_link', 'SELECT COUNT(*) FROM courses') as courses_count;
