-- Crear la extensión dblink si no existe
CREATE EXTENSION IF NOT EXISTS dblink;

-- Establecer la conexión con la base de datos original
SELECT dblink_connect(
    'db_link',
    'host=upcfokdeubxwjiibapnc.supabase.co 
     port=5432 
     dbname=postgres 
     user=postgres 
     password=YOUR_DB_PASSWORD'
);
