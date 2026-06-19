-- =============================================================================
-- Grindboard: Row Level Security (RLS) Policies
-- Run this in: Supabase Dashboard > SQL Editor
-- =============================================================================
-- IMPORTANT: This app uses Prisma with the postgres (superuser) role which
-- BYPASSES RLS by default. These policies protect against direct Supabase
-- client (anon/authenticated key) access only.
-- =============================================================================

-- ─── HELPER FUNCTION ─────────────────────────────────────────────────────────
-- Gets the internal app user.id from the Supabase auth.uid()
create or replace function get_app_user_id()
returns text as $$
  select id from public.users where supabase_id = auth.uid()::text limit 1;
$$ language sql security definer stable;

-- ─── ENABLE RLS ON ALL TABLES ────────────────────────────────────────────────
alter table public.users           enable row level security;
alter table public.activities      enable row level security;
alter table public.goals           enable row level security;
alter table public.streaks         enable row level security;
alter table public.enrollments     enable row level security;
alter table public.user_topics     enable row level security;
alter table public.user_badges     enable row level security;
alter table public.event_results   enable row level security;
alter table public.events          enable row level security;
alter table public.badges          enable row level security;
alter table public.modules         enable row level security;
alter table public.topics          enable row level security;
alter table public.announcements   enable row level security;

-- ─── DROP OLD POLICIES (idempotent) ──────────────────────────────────────────
do $$ declare
  r record;
begin
  for r in select schemaname, tablename, policyname from pg_policies where schemaname = 'public' loop
    execute format('drop policy if exists %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

-- =============================================================================
-- USERS TABLE
-- Everyone can see profiles (needed for leaderboard)
-- Only you can update your own profile
-- =============================================================================
create policy "users_select_all"
  on public.users for select using (true);

create policy "users_update_own"
  on public.users for update
  using (supabase_id = auth.uid()::text)
  with check (supabase_id = auth.uid()::text);

-- =============================================================================
-- ACTIVITIES TABLE
-- Users can only see and manage their own activities
-- =============================================================================
create policy "activities_select_own"
  on public.activities for select
  using (user_id = get_app_user_id());

create policy "activities_insert_own"
  on public.activities for insert
  with check (user_id = get_app_user_id());

create policy "activities_update_own"
  on public.activities for update
  using (user_id = get_app_user_id());

create policy "activities_delete_own"
  on public.activities for delete
  using (user_id = get_app_user_id());

-- =============================================================================
-- GOALS TABLE
-- Users can only see and manage their own goals
-- =============================================================================
create policy "goals_select_own"
  on public.goals for select
  using (user_id = get_app_user_id());

create policy "goals_insert_own"
  on public.goals for insert
  with check (user_id = get_app_user_id());

create policy "goals_update_own"
  on public.goals for update
  using (user_id = get_app_user_id());

create policy "goals_delete_own"
  on public.goals for delete
  using (user_id = get_app_user_id());

-- =============================================================================
-- STREAKS TABLE
-- Users can only see their own streaks
-- =============================================================================
create policy "streaks_select_own"
  on public.streaks for select
  using (user_id = get_app_user_id());

create policy "streaks_insert_own"
  on public.streaks for insert
  with check (user_id = get_app_user_id());

create policy "streaks_update_own"
  on public.streaks for update
  using (user_id = get_app_user_id());

-- =============================================================================
-- ENROLLMENTS TABLE
-- Users can only see and manage their own enrollments
-- =============================================================================
create policy "enrollments_select_own"
  on public.enrollments for select
  using (user_id = get_app_user_id());

create policy "enrollments_insert_own"
  on public.enrollments for insert
  with check (user_id = get_app_user_id());

create policy "enrollments_delete_own"
  on public.enrollments for delete
  using (user_id = get_app_user_id());

-- =============================================================================
-- USER_TOPICS TABLE
-- Users can only see and manage their own completed topics
-- =============================================================================
create policy "user_topics_select_own"
  on public.user_topics for select
  using (user_id = get_app_user_id());

create policy "user_topics_insert_own"
  on public.user_topics for insert
  with check (user_id = get_app_user_id());

create policy "user_topics_delete_own"
  on public.user_topics for delete
  using (user_id = get_app_user_id());

-- =============================================================================
-- USER_BADGES TABLE
-- Badges are public (visible on profiles/leaderboard)
-- Only the system (via Prisma/postgres role) can award them
-- =============================================================================
create policy "user_badges_select_all"
  on public.user_badges for select using (true);

-- =============================================================================
-- EVENT_RESULTS TABLE
-- Everyone can see results (leaderboard), only own results can be inserted
-- =============================================================================
create policy "event_results_select_all"
  on public.event_results for select using (true);

create policy "event_results_insert_own"
  on public.event_results for insert
  with check (user_id = get_app_user_id());

create policy "event_results_update_own"
  on public.event_results for update
  using (user_id = get_app_user_id());

-- =============================================================================
-- EVENTS TABLE (contests / upcoming events)
-- Fully public read — anyone can see events
-- Only admins can create (via server-side API / Prisma)
-- =============================================================================
create policy "events_select_all"
  on public.events for select using (true);

-- =============================================================================
-- BADGES TABLE (reference data)
-- Fully public read
-- =============================================================================
create policy "badges_select_all"
  on public.badges for select using (true);

-- =============================================================================
-- MODULES TABLE (reference data)
-- Fully public read
-- =============================================================================
create policy "modules_select_all"
  on public.modules for select using (true);

-- =============================================================================
-- TOPICS TABLE (reference data)
-- Fully public read
-- =============================================================================
create policy "topics_select_all"
  on public.topics for select using (true);

-- =============================================================================
-- ANNOUNCEMENTS TABLE
-- Fully public read
-- Only admin users can create (via server-side API / Prisma)
-- =============================================================================
create policy "announcements_select_all"
  on public.announcements for select using (true);

-- =============================================================================
-- VERIFY: List all policies
-- =============================================================================
select tablename, policyname, cmd, qual
from pg_policies
where schemaname = 'public'
order by tablename, cmd;
