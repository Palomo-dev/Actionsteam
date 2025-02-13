-- Asegurarse de que pg_cron esté habilitado en el esquema correcto
CREATE SCHEMA IF NOT EXISTS cron;
GRANT USAGE ON SCHEMA cron TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA cron TO postgres;

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA cron;

-- Verificar que la extensión esté instalada
SELECT extname, extversion 
FROM pg_extension 
WHERE extname = 'pg_cron';

-- Crear el trabajo de notificaciones diarias usando cron.schedule
SELECT cron.schedule(
    'send-daily-notifications',  -- nombre del trabajo
    '0 9 * * *',               -- ejecutar a las 9 AM todos los días
    $$ SELECT send_daily_notifications() $$
);

-- Verificar que el trabajo se haya creado
SELECT 
    jobid,
    jobname,
    schedule,
    command,
    active
FROM cron.job 
WHERE jobname = 'send-daily-notifications';
