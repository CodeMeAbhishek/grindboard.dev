-- =============================================================================
-- Grindboard: Supabase Cron Jobs Setup
-- Run this in: Supabase Dashboard > SQL Editor
-- App URL : https://www.grindboard.dev
-- Cron Secret: grindboard-secure-cron-2026
-- =============================================================================

-- Step 1: Enable required extensions
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- =============================================================================
-- Step 2: Remove old jobs if they exist (idempotent re-run safety)
-- =============================================================================
select cron.unschedule('grindboard-sync-progress') where exists (
  select 1 from cron.job where jobname = 'grindboard-sync-progress'
);
select cron.unschedule('grindboard-sync-events') where exists (
  select 1 from cron.job where jobname = 'grindboard-sync-events'
);

-- =============================================================================
-- Step 3: Schedule - Progress Sync (Every Hour)
-- Calls /api/cron/sync on your deployed Next.js app
-- Replace YOUR_APP_URL with your actual Vercel deployment URL
-- Replace YOUR_CRON_SECRET with your CRON_SECRET env var value
-- =============================================================================
select cron.schedule(
  'grindboard-sync-progress',
  '0 * * * *',  -- every hour at :00
  $$
  select net.http_post(
    url := 'https://www.grindboard.dev/api/cron/sync',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer grindboard-secure-cron-2026'
    ),
    body := '{}'::jsonb
  );
  $$
);

-- =============================================================================
-- Step 4: Schedule - Events Fetch (Every Day at 1:00 AM UTC)
-- Calls /api/cron/events on your deployed Next.js app
-- =============================================================================
select cron.schedule(
  'grindboard-sync-events',
  '0 1 * * *',  -- daily at 1:00 AM UTC
  $$
  select net.http_post(
    url := 'https://www.grindboard.dev/api/cron/events',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer grindboard-secure-cron-2026'
    ),
    body := '{}'::jsonb
  );
  $$
);

-- =============================================================================
-- Step 5: Verify jobs are scheduled
-- =============================================================================
select jobname, schedule, active from cron.job;
