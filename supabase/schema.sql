-- =====================================================================
-- Stuttgart Archive — PostgreSQL schema for Supabase
-- Auth, database, storage, and row-level security.
-- Run in the Supabase SQL editor (or via `supabase db push`).
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- Core: organizations + profiles
-- ---------------------------------------------------------------------
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'My Archive',
  type text not null default 'individual'
    check (type in ('individual','collector','dealer','broker','shop')),
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'owner' check (role in ('owner','admin','editor','viewer')),
  selected_mode text,
  created_at timestamptz not null default now()
);

-- Helper: the calling user's organization id (security definer to avoid recursion).
create or replace function current_org_id()
returns uuid
language sql stable security definer set search_path = public
as $$ select organization_id from profiles where id = auth.uid() $$;

create or replace function current_role_is(target text)
returns boolean
language sql stable security definer set search_path = public
as $$ select exists(select 1 from profiles where id = auth.uid() and role = target) $$;

-- ---------------------------------------------------------------------
-- Vehicles
-- ---------------------------------------------------------------------
create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  owner_user_id uuid references auth.users(id) on delete set null,
  year int, make text default 'Porsche', model text, trim text, generation text,
  body_style text, exterior_color text, interior_color text,
  vin_encrypted_or_private text,
  vin_public_mode text not null default 'hidden' check (vin_public_mode in ('hidden','partial','full')),
  mileage int, transmission text, engine text, drivetrain text,
  location text, title_status text, ownership_status text, sale_status text,
  asking_price numeric, reserve_price_notes text,
  privacy_status text not null default 'private' check (privacy_status in ('private','draft_public','public')),
  public_slug text unique,
  archive_notes text, ownership_story text, personal_significance text,
  documented_provenance_highlights text,
  known_flaws text,
  options jsonb default '[]'::jsonb,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_vehicles_org on vehicles(organization_id);

-- ---------------------------------------------------------------------
-- Documents
-- ---------------------------------------------------------------------
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete cascade,
  uploaded_by uuid references auth.users(id) on delete set null,
  file_name text, file_type text, file_path text,
  document_type text,
  status text not null default 'uploaded',
  is_private boolean not null default true,
  approved_for_packet boolean not null default false,
  approved_for_public_page boolean not null default false,
  extracted_text text,
  extracted_metadata_json jsonb default '{}'::jsonb,
  confidence_score numeric,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_documents_vehicle on documents(vehicle_id);

-- ---------------------------------------------------------------------
-- Service + modification events
-- ---------------------------------------------------------------------
create table if not exists service_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete cascade,
  document_id uuid references documents(id) on delete set null,
  event_date date, mileage int, vendor text, category text, summary text, cost numeric,
  verification_status text default 'unverified',
  public_visibility boolean not null default false,
  confidence_score numeric, source_type text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_service_vehicle on service_events(vehicle_id);

create table if not exists modification_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete cascade,
  document_id uuid references documents(id) on delete set null,
  modification_name text, category text, brand text, part_number text,
  install_date date, installer text, cost numeric,
  reversible_status text, oem_parts_retained text,
  public_visibility boolean not null default false,
  confidence_score numeric, source_type text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_mod_vehicle on modification_events(vehicle_id);

-- ---------------------------------------------------------------------
-- Photos
-- ---------------------------------------------------------------------
create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete cascade,
  uploaded_by uuid references auth.users(id) on delete set null,
  file_path text, caption text, photo_category text,
  approved_for_public boolean not null default false,
  approved_for_instagram boolean not null default false,
  contains_license_plate boolean not null default false,
  contains_personal_info boolean not null default false,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_photos_vehicle on photos(vehicle_id);

-- ---------------------------------------------------------------------
-- Seller packets, public pages, auction preps
-- ---------------------------------------------------------------------
create table if not exists seller_packets (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete cascade,
  status text default 'draft', title text,
  sections_json jsonb default '[]'::jsonb,
  pdf_path text, secure_share_token text unique,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public_pages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete cascade,
  slug text unique, status text default 'draft',
  settings_json jsonb default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists auction_preps (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete cascade,
  target_style text, readiness_score int,
  listing_draft_json jsonb default '{}'::jsonb,
  missing_items_json jsonb default '[]'::jsonb,
  photo_checklist_json jsonb default '[]'::jsonb,
  q_and_a_json jsonb default '[]'::jsonb,
  status text default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Buyer tools
-- ---------------------------------------------------------------------
create table if not exists watchlist_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete cascade,
  external_url text, notes text, status text default 'watching',
  created_at timestamptz not null default now()
);

create table if not exists vehicle_comparisons (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  vehicle_a_id uuid references vehicles(id) on delete set null,
  vehicle_b_id uuid references vehicles(id) on delete set null,
  comparison_json jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists buyer_questions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete cascade,
  lead_id uuid,
  question text, ai_draft_reply text, status text default 'open',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Marketing content
-- ---------------------------------------------------------------------
create table if not exists instagram_posts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete cascade,
  content_type text, tone text, caption text, hook text,
  hashtags text, visual_direction text,
  status text default 'draft' check (status in ('draft','approved','posted_manually','rejected')),
  generated_by_agent_run_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists ad_briefs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete cascade,
  campaign_type text, objective text, audience_concept text,
  primary_text text, headline text, description text, cta text,
  creative_direction text, landing_page_recommendation text,
  status text default 'draft' check (status in ('draft','approved','exported','rejected')),
  generated_by_agent_run_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete cascade,
  name text, status text default 'draft',
  start_date date, end_date date,
  plan_json jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Leads + tasks
-- ---------------------------------------------------------------------
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete set null,
  public_page_id uuid references public_pages(id) on delete set null,
  name text, email text, phone text, message text,
  consent boolean default false, source text, status text default 'new',
  created_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete cascade,
  assigned_to uuid references auth.users(id) on delete set null,
  title text, description text,
  status text default 'open', priority text default 'medium',
  due_date date, created_by_ai boolean default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- AI runs + audit
-- ---------------------------------------------------------------------
create table if not exists ai_agent_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete set null,
  document_id uuid references documents(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  agent_type text, input_summary text,
  scoped_context_json jsonb default '{}'::jsonb,
  output_json jsonb default '{}'::jsonb,
  confidence_score numeric,
  risk_flags_json jsonb default '[]'::jsonb,
  approval_required boolean default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_runs_org on ai_agent_runs(organization_id);

create table if not exists audit_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  event_type text, entity_type text, entity_id uuid,
  metadata_json jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_audit_org on audit_events(organization_id);

-- ---------------------------------------------------------------------
-- Settings + integrations
-- ---------------------------------------------------------------------
create table if not exists autopilot_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid unique not null references organizations(id) on delete cascade,
  draft_content_enabled boolean default true,
  queue_for_review_enabled boolean default true,
  external_publish_enabled boolean default false,
  external_messaging_enabled boolean default false,
  internal_tasks_enabled boolean default true,
  instagram_connected boolean default false,
  meta_ads_connected boolean default false,
  default_public_sharing boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists integrations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  provider text, status text default 'disconnected', scopes text,
  connected_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Billing
-- ---------------------------------------------------------------------
create table if not exists billing_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  plan_name text default 'free', status text default 'active',
  vehicle_limit int, storage_limit int, ai_generation_limit int,
  created_at timestamptz not null default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  stripe_customer_id text, stripe_subscription_id text,
  status text, plan text,
  current_period_start timestamptz, current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  vehicle_id uuid references vehicles(id) on delete set null,
  product_type text, stripe_payment_intent_id text,
  amount numeric, currency text default 'usd', status text,
  created_at timestamptz not null default now()
);

create table if not exists entitlements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  vehicle_id uuid references vehicles(id) on delete set null,
  entitlement_type text, source text check (source in ('free','stripe','app_store','admin')),
  starts_at timestamptz default now(), expires_at timestamptz,
  metadata_json jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_entitlements_org on entitlements(organization_id);

create table if not exists emails (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  to_email text, from_email text, subject text, template text, status text,
  provider_message_id text, metadata_json jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists quality_reports (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  report_type text, score int,
  findings_json jsonb default '{}'::jsonb,
  created_by_agent_run_id uuid,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- Row-Level Security
-- =====================================================================
-- Enable RLS on all org-scoped tables and apply a uniform org-isolation policy.

do $$
declare t text;
declare org_tables text[] := array[
  'vehicles','documents','service_events','modification_events','photos',
  'seller_packets','public_pages','auction_preps','watchlist_items',
  'vehicle_comparisons','buyer_questions','instagram_posts','ad_briefs',
  'campaigns','leads','tasks','ai_agent_runs','audit_events',
  'autopilot_settings','integrations','billing_plans','subscriptions',
  'purchases','entitlements','emails','quality_reports'
];
begin
  foreach t in array org_tables loop
    execute format('alter table %I enable row level security;', t);
    execute format('drop policy if exists org_isolation on %I;', t);
    execute format($f$
      create policy org_isolation on %I
        using (organization_id = current_org_id())
        with check (organization_id = current_org_id());
    $f$, t);
  end loop;
end $$;

-- Organizations + profiles policies
alter table organizations enable row level security;
drop policy if exists org_self on organizations;
create policy org_self on organizations
  using (id = current_org_id()) with check (id = current_org_id());

alter table profiles enable row level security;
drop policy if exists profile_self on profiles;
create policy profile_self on profiles
  using (organization_id = current_org_id()) with check (organization_id = current_org_id());

-- =====================================================================
-- New-user trigger: create an organization + profile + free plan on signup.
-- =====================================================================
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare new_org uuid;
begin
  insert into organizations (name) values (coalesce(new.raw_user_meta_data->>'full_name','My Archive') || '''s Archive')
    returning id into new_org;
  insert into profiles (id, organization_id, email, full_name, role, selected_mode)
    values (new.id, new_org, new.email, new.raw_user_meta_data->>'full_name', 'owner',
            new.raw_user_meta_data->>'selected_mode');
  insert into autopilot_settings (organization_id) values (new_org);
  insert into billing_plans (organization_id, plan_name, vehicle_limit, ai_generation_limit)
    values (new_org, 'free', 3, 10);
  insert into entitlements (organization_id, user_id, entitlement_type, source)
    values (new_org, new.id, 'plan:free', 'free');
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- =====================================================================
-- Storage bucket for documents + photos (private by default).
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('vehicle-files', 'vehicle-files', false)
on conflict (id) do nothing;

-- =====================================================================
-- Community ("The Paddock") — opt-in social layer
-- =====================================================================
create table if not exists community_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  organization_id uuid references organizations(id) on delete set null,
  handle text unique not null,
  display_name text,
  location text,
  bio text,
  is_public boolean not null default false,  -- members are private until they opt in
  badges jsonb default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists follows (
  id uuid primary key default gen_random_uuid(),
  follower_user_id uuid not null references auth.users(id) on delete cascade,
  followee_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (follower_user_id, followee_user_id)
);

create table if not exists community_posts (
  id uuid primary key default gen_random_uuid(),
  author_user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete set null,
  type text not null check (type in ('for_sale','modification','archive_update','joined')),
  title text,
  body text,
  is_public boolean not null default true,    -- only published content is shared
  like_count int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_posts_author on community_posts(author_user_id);

create table if not exists post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references community_posts(id) on delete cascade,
  author_user_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists post_likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references community_posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

-- RLS: public can read published/opt-in rows; users write only their own.
alter table community_profiles enable row level security;
drop policy if exists cp_read on community_profiles;
create policy cp_read on community_profiles for select using (is_public = true or user_id = auth.uid());
drop policy if exists cp_write on community_profiles;
create policy cp_write on community_profiles for all using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table community_posts enable row level security;
drop policy if exists post_read on community_posts;
create policy post_read on community_posts for select using (is_public = true or author_user_id = auth.uid());
drop policy if exists post_write on community_posts;
create policy post_write on community_posts for all using (author_user_id = auth.uid()) with check (author_user_id = auth.uid());

alter table follows enable row level security;
drop policy if exists follow_rw on follows;
create policy follow_rw on follows for all using (follower_user_id = auth.uid()) with check (follower_user_id = auth.uid());
drop policy if exists follow_read on follows;
create policy follow_read on follows for select using (true);

alter table post_comments enable row level security;
drop policy if exists comment_read on post_comments;
create policy comment_read on post_comments for select using (true);
drop policy if exists comment_write on post_comments;
create policy comment_write on post_comments for all using (author_user_id = auth.uid()) with check (author_user_id = auth.uid());

alter table post_likes enable row level security;
drop policy if exists like_rw on post_likes;
create policy like_rw on post_likes for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists like_read on post_likes;
create policy like_read on post_likes for select using (true);

-- =====================================================================
-- Marketplace offers (buyer's-fee model)
-- =====================================================================
create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete set null,
  public_page_id uuid references public_pages(id) on delete set null,
  buyer_name text,
  buyer_email text,
  amount numeric,
  message text,
  status text not null default 'new' check (status in ('new','countered','accepted','declined','withdrawn','closed')),
  source text,
  created_at timestamptz not null default now()
);
create index if not exists idx_offers_vehicle on offers(vehicle_id);

alter table offers enable row level security;
drop policy if exists offers_org on offers;
-- Sellers see offers for their org; public submissions are inserted via the
-- service-role API route (which bypasses RLS), so no public insert policy is needed.
create policy offers_org on offers
  using (organization_id = current_org_id())
  with check (organization_id = current_org_id());
