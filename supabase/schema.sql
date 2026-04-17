-- Enable Row Level Security
alter database postgres set "app.jwt_secret" to '${SUPABASE_JWT_SECRET}';

-- Create custom enum for member roles
create type public.member_role as enum ('member', 'admin');

-- Create profiles table (extends Supabase Auth users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  nom text not null,
  prenom text not null,
  role public.member_role not null default 'member',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create events table
create table public.events (
  id uuid default gen_random_uuid() primary key,
  titre text not null,
  date timestamp with time zone not null,
  lieu text not null,
  capacite integer not null check (capacite > 0),
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create registrations table
create table public.registrations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  event_id uuid references public.events(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, event_id)
);

-- Create indexes for performance
create index idx_events_date on public.events(date);
create index idx_registrations_user on public.registrations(user_id);
create index idx_registrations_event on public.registrations(event_id);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.registrations enable row level security;

-- RLS Policies for profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- RLS Policies for events
create policy "Events are viewable by everyone"
  on public.events for select
  using (true);

create policy "Only admins can insert events"
  on public.events for insert
  with check (auth.role() = 'authenticated' and exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

create policy "Only admins can update events"
  on public.events for update
  using (auth.role() = 'authenticated' and exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

create policy "Only admins can delete events"
  on public.events for delete
  using (auth.role() = 'authenticated' and exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

-- RLS Policies for registrations
create policy "Users can view own registrations"
  on public.registrations for select
  using (auth.uid() = user_id or exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

create policy "Authenticated users can register for events"
  on public.registrations for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own registrations"
  on public.registrations for delete
  using (auth.uid() = user_id);

-- Functions for admin checks
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql stable;

create or replace function public.get_current_user_role()
returns public.member_role as $$
  select role from public.profiles where id = auth.uid();
$$ language sql stable;

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_events_updated_at
  before update on public.events
  for each row execute procedure public.handle_updated_at();

-- Function to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nom, prenom, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nom', ''),
    coalesce(new.raw_user_meta_data->>'prenom', ''),
    coalesce((new.raw_user_meta_data->>'role')::public.member_role, 'member')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
