-- Enable the required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the cron job to run daily at midnight
SELECT cron.schedule(
  'process-auto-notifications',
  '0 0 * * *',
  $$
  SELECT net.http_post(
    url:='https://upcfokdeubxwjiibapnc.supabase.co/functions/v1/auto-notifications',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  ) AS request_id;
  $$
);