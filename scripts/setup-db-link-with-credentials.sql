-- Crear la extensión dblink si no existe
CREATE EXTENSION IF NOT EXISTS dblink;

-- Establecer la conexión con la base de datos original
DO $$
BEGIN
    PERFORM dblink_connect(
        'db_link',
        'host=upcfokdeubxwjiibapnc.supabase.co 
         port=5432 
         dbname=postgres 
         user=postgres 
         password=S1st3m4s.2025'
    );
END $$;
