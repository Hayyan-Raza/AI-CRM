-- NexusCRM Database Schema
-- Run this in your Supabase SQL Editor

-- 1. Create Extensions
create extension if not exists "uuid-ossp";

-- 2. Create Profiles table (link to Auth.users)
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    name text,
    company_name text,
    role text default 'admin',
    avatar_url text,
    api_key text,
    ai_model text default 'gemini-2.5-flash',
    google_access_token text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 3. Create Companies table
create table if not exists public.companies (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    logo_url text,
    plan text default 'starter',
    created_at timestamptz default now()
);

-- 4. Create Leads table
create table if not exists public.leads (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    email text not null,
    phone text,
    company text,
    title text,
    source text,
    status text default 'new',
    assigned_to uuid references public.profiles(id),
    notes text,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    last_contacted_at timestamptz
);

-- 5. Create Deals table
create table if not exists public.deals (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text,
    value numeric default 0,
    currency text default 'USD',
    stage text default 'new_lead',
    probability numeric default 0,
    lead_id uuid references public.leads(id) on delete set null,
    assigned_to uuid references public.profiles(id),
    company_id uuid references public.companies(id),
    expected_close_date timestamptz,
    actual_close_date timestamptz,
    closed_lost_reason text,
    competitor_info text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 6. Create Tasks table
create table if not exists public.tasks (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text,
    type text default 'follow_up',
    priority text default 'medium',
    status text default 'pending',
    assigned_to uuid references public.profiles(id),
    related_type text, -- 'lead' or 'deal'
    related_id uuid,
    due_date timestamptz,
    completed_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 7. Create Activities table
create table if not exists public.activities (
    id uuid default uuid_generate_v4() primary key,
    type text not null,
    title text not null,
    description text,
    performed_by uuid references public.profiles(id),
    performed_by_name text,
    related_type text, -- 'lead' or 'deal'
    related_id uuid,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now()
);

-- 8. Create AI Insights table
create table if not exists public.ai_insights (
    id uuid default uuid_generate_v4() primary key,
    type text not null,
    title text not null,
    description text not null,
    confidence numeric default 0,
    related_type text, -- 'lead' or 'deal'
    related_id uuid,
    recommended_action text,
    created_at timestamptz default now()
);

-- 9. Create Conversations table
create table if not exists public.conversations (
    id uuid default uuid_generate_v4() primary key,
    type text default 'email',
    title text,
    content text,
    summary text,
    participant_name text,
    participant_email text,
    related_type text, -- 'lead' or 'deal'
    related_id uuid,
    created_by uuid references public.profiles(id),
    duration numeric,
    created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.leads enable row level security;
alter table public.deals enable row level security;
alter table public.tasks enable row level security;
alter table public.activities enable row level security;
alter table public.ai_insights enable row level security;
alter table public.conversations enable row level security;

-- Basic Policies (Allows authenticated users access)
create policy "Authenticated access" on public.profiles for all to authenticated using (true);
create policy "Authenticated access" on public.companies for all to authenticated using (true);
create policy "Authenticated access" on public.leads for all to authenticated using (true);
create policy "Authenticated access" on public.deals for all to authenticated using (true);
create policy "Authenticated access" on public.tasks for all to authenticated using (true);
create policy "Authenticated access" on public.activities for all to authenticated using (true);
create policy "Authenticated access" on public.ai_insights for all to authenticated using (true);
create policy "Authenticated access" on public.conversations for all to authenticated using (true);

-- INSERT DUMMY DATA
-- 1. Create a dummy company
insert into public.companies (id, name, plan)
values ('11111111-1111-1111-1111-111111111111', 'Nexus Global Systems', 'professional')
on conflict (id) do nothing;

-- 2. Create dummy leads
insert into public.leads (id, name, email, company, status, source, notes)
values 
('22222222-2222-2222-2222-222222222222', 'Alice Thompson', 'alice@innovate.co', 'Innovate Co', 'qualified', 'website', 'Interested in high-volume API access.'),
('33333333-3333-3333-3333-333333333333', 'Bob Miller', 'bob@skyline.io', 'Skyline IO', 'new', 'referral', 'Referrals from partner program.')
on conflict (id) do nothing;

-- 3. Create dummy deals
insert into public.deals (title, value, stage, lead_id, company_id, probability, description)
values 
('Enterprise Cloud Migration', 45000, 'negotiation', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 80, 'Full migration for 200 servers.'),
('Team Plan Expansion', 12000, 'contacted', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 40, 'Adding 15 more seats to existing team.')
on conflict (id) do nothing;

-- 4. Create dummy insights
insert into public.ai_insights (type, title, description, confidence, recommended_action)
values 
('deal_prediction', 'High propensity to close!', 'Innovate Co deal shows positive sentiment in recent logs.', 92, 'Send the contract draft now.'),
('lead_score', 'Hot Lead Detected', 'Bob Miller has visited the pricing page 3 times today.', 88, 'Call Bob Millers workspace.')
on conflict (id) do nothing;
