-- Enable the pg_net extension to make HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Enable the pg_cron extension to schedule background jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create the cron job to call our Next.js API endpoint every day at midnight
-- IMPORTANT: Replace 'https://your-production-url.com' with your actual production deployment URL.
-- IMPORTANT: Replace 'YOUR_CRON_SECRET' with the actual CRON_SECRET from your .env file.
SELECT cron.schedule(
  'fetch-upcoming-contests-daily',
  '0 0 * * *', -- Runs at midnight every day
  $$
    SELECT net.http_get(
      url:='https://www.grindboard.dev/api/cron/events',
      headers:='{"Authorization": "Bearer grindboard-secure-cron-2026"}'::jsonb
    );
  $$
);

-- Note: If you ever need to unschedule this job, you can run:
-- SELECT cron.unschedule('fetch-upcoming-contests-daily');
