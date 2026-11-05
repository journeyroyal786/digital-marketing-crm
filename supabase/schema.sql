-- Royal Journey CRM database schema
-- Run this entire file in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 email text unique,
 full_name text,
 role text not null default 'employee' check (role in ('owner','admin','sales','account_manager','operations','creative','finance','support','employee')),
 created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
 insert into public.profiles(id,email,full_name) values(new.id,new.email,coalesce(new.raw_user_meta_data->>'full_name',''))
 on conflict (id) do nothing;
 return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
 for each row execute procedure public.handle_new_user();

create table if not exists public.leads (
 id uuid primary key default gen_random_uuid(), company_name text not null, contact_name text,
 email text, phone text, website text, industry text, city text, source text,
 services_interested text, budget_aed numeric(14,2), score integer default 0 check(score between 0 and 100),
 status text default 'New Lead', priority text, next_follow_up date, notes text,
 owner_id uuid references public.profiles(id), created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists public.deals (
 id uuid primary key default gen_random_uuid(), title text not null, company_name text,
 value_aed numeric(14,2) default 0, monthly_retainer_aed numeric(14,2), setup_fee_aed numeric(14,2),
 stage text default 'New Opportunity', probability integer default 0, expected_close date,
 services text, lost_reason text, notes text, lead_id uuid references public.leads(id) on delete set null,
 owner_id uuid references public.profiles(id), created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists public.clients (
 id uuid primary key default gen_random_uuid(), company_name text not null, primary_contact text, email text,
 phone text, website text, industry text, city text, services text, monthly_retainer_aed numeric(14,2) default 0,
 contract_start date, renewal_date date, health_score integer default 100, status text default 'Active',
 notes text, owner_id uuid references public.profiles(id), created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists public.contracts (
 id uuid primary key default gen_random_uuid(), contract_number text not null unique, client_name text,
 client_id uuid references public.clients(id) on delete set null, start_date date, end_date date,
 value_aed numeric(14,2), document_url text, status text default 'Draft', created_at timestamptz default now()
);
create table if not exists public.projects (
 id uuid primary key default gen_random_uuid(), name text not null, client_name text,
 client_id uuid references public.clients(id) on delete set null, service text, manager text,
 start_date date, due_date date, status text default 'To Do', description text,
 created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists public.tasks (
 id uuid primary key default gen_random_uuid(), title text not null, client_name text, project_id uuid references public.projects(id) on delete set null,
 department text, assignee text, priority text default 'Medium', start_date date, due_date date,
 status text default 'To Do', estimated_hours numeric(8,2), actual_hours numeric(8,2), description text,
 created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists public.campaigns (
 id uuid primary key default gen_random_uuid(), name text not null, client_name text, client_id uuid references public.clients(id) on delete set null,
 platform text, objective text, budget_aed numeric(14,2), agency_fee_aed numeric(14,2),
 start_date date, end_date date, impressions bigint default 0, reach bigint default 0, clicks bigint default 0,
 ctr numeric(8,3), cpc numeric(14,2), cpm numeric(14,2), leads integer default 0, cpl numeric(14,2),
 conversions integer default 0, cpa numeric(14,2), roas numeric(10,2), status text default 'Draft',
 created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists public.creatives (
 id uuid primary key default gen_random_uuid(), title text not null, client_name text, campaign_name text,
 creator text, version text, file_url text, revisions integer default 0, status text default 'Internal Review',
 feedback text, approved_by text, approved_at timestamptz, published_at timestamptz, created_at timestamptz default now()
);
create table if not exists public.tickets (
 id uuid primary key default gen_random_uuid(), subject text not null, client_name text, client_id uuid references public.clients(id) on delete set null,
 category text, priority text default 'Medium', assignee text, status text default 'New', description text,
 first_response_at timestamptz, resolved_at timestamptz, created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists public.invoices (
 id uuid primary key default gen_random_uuid(), invoice_number text not null unique, client_name text,
 client_id uuid references public.clients(id) on delete set null, contract_id uuid references public.contracts(id) on delete set null,
 issue_date date, due_date date, subtotal_aed numeric(14,2) default 0, vat_aed numeric(14,2) default 0,
 total_aed numeric(14,2) default 0, balance_aed numeric(14,2) default 0, status text default 'Draft',
 created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists public.payments (
 id uuid primary key default gen_random_uuid(), invoice_id uuid references public.invoices(id) on delete set null,
 reference text, client_name text, amount_aed numeric(14,2) not null default 0, payment_date date,
 method text, status text default 'Pending', notes text, created_at timestamptz default now()
);
create table if not exists public.employees (
 id uuid primary key default gen_random_uuid(), profile_id uuid references public.profiles(id) on delete set null,
 full_name text not null, email text, phone text, job_title text, department text,
 employment_status text default 'Active', created_at timestamptz default now()
);
create table if not exists public.onboarding (
 id uuid primary key default gen_random_uuid(), client_name text not null, client_id uuid references public.clients(id) on delete set null,
 owner text, agreement_signed text default 'No', payment_confirmed text default 'No', brand_assets_received text default 'No',
 access_complete text default 'No', kickoff_date date, status text default 'Not Started', notes text, created_at timestamptz default now()
);
create table if not exists public.activities (
 id uuid primary key default gen_random_uuid(), subject text not null, client_name text, client_id uuid references public.clients(id) on delete set null,
 activity_type text, due_at timestamptz, owner text, status text default 'Planned', notes text, created_at timestamptz default now()
);
create table if not exists public.reports (
 id uuid primary key default gen_random_uuid(), title text not null, client_name text, client_id uuid references public.clients(id) on delete set null,
 report_type text, period_start date, period_end date, file_url text, status text default 'Draft',
 created_at timestamptz default now()
);

create index if not exists leads_created_at_idx on public.leads(created_at desc);
create index if not exists leads_status_idx on public.leads(status);
create index if not exists deals_stage_idx on public.deals(stage);
create index if not exists clients_status_idx on public.clients(status);
create index if not exists tasks_due_date_idx on public.tasks(due_date);
create index if not exists invoices_due_date_idx on public.invoices(due_date);
create index if not exists campaigns_client_idx on public.campaigns(client_id);

-- Shared single-agency workspace: authenticated users can collaborate.
-- Production multi-tenant deployments should add an agency_id boundary to every table.
do $$
declare t text;
begin
 foreach t in array array['profiles','leads','deals','clients','contracts','projects','tasks','campaigns','creatives','tickets','invoices','payments','employees','onboarding','activities','reports']
 loop
  execute format('alter table public.%I enable row level security',t);
  execute format('drop policy if exists "authenticated select" on public.%I',t);
  execute format('drop policy if exists "authenticated insert" on public.%I',t);
  execute format('drop policy if exists "authenticated update" on public.%I',t);
  execute format('drop policy if exists "authenticated delete" on public.%I',t);
  if t='profiles' then
   execute 'create policy "authenticated select" on public.profiles for select to authenticated using (true)';
   execute 'create policy "self update profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid())';
  else
   execute format('create policy "authenticated select" on public.%I for select to authenticated using (true)',t);
   execute format('create policy "authenticated insert" on public.%I for insert to authenticated with check (true)',t);
   execute format('create policy "authenticated update" on public.%I for update to authenticated using (true) with check (true)',t);
   execute format('create policy "authenticated delete" on public.%I for delete to authenticated using (true)',t);
  end if;
 end loop;
end $$;

-- Automatically maintain updated_at on selected records.
create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
do $$
declare t text;
begin
 foreach t in array array['leads','deals','clients','projects','tasks','campaigns','tickets','invoices']
 loop
  execute format('drop trigger if exists set_updated_at on public.%I',t);
  execute format('create trigger set_updated_at before update on public.%I for each row execute procedure public.set_updated_at()',t);
 end loop;
end $$;
