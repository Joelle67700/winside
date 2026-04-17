-- Enable Row Level Security
alter database postgres set "app.jwt_secret" to '${SUPABASE_JWT_SECRET}';

-- Create custom enum for member roles
create type public.user_role as enum ('member', 'admin');

-- Create users table (extends Supabase Auth users with role)
-- Note: Supabase Auth manages the auth.users table, we extend it with public.users
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text,
  role public.user_role not null default 'member',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create evenements table
create table public.evenements (
  id uuid default gen_random_uuid() primary key,
  titre text not null,
  date timestamp with time zone not null,
  lieu text not null,
  desc text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create inscriptions table
create table public.inscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  evenement_id uuid references public.evenements(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, evenement_id)
);

-- Create indexes for performance
create index idx_evenements_date on public.evenements(date);
create index idx_inscriptions_user on public.inscriptions(user_id);
create index idx_inscriptions_evenement on public.inscriptions(evenement_id);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.evenements enable row level security;
alter table public.inscriptions enable row level security;

-- RLS Policies for users
create policy "Users can view their own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- Admins can view all users
create policy "Admins can view all users"
  on public.users for select
  using (exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ));

-- RLS Policies for evenements
create policy "Evenements are viewable by everyone"
  on public.evenements for select
  using (true);

create policy "Only admins can insert evenements"
  on public.evenements for insert
  with check (exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ));

create policy "Only admins can update evenements"
  on public.evenements for update
  using (exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ));

create policy "Only admins can delete evenements"
  on public.evenements for delete
  using (exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ));

-- RLS Policies for inscriptions
create policy "Users can view their own inscriptions"
  on public.inscriptions for select
  using (auth.uid() = user_id or exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  ));

create policy "Authenticated users can register for evenements"
  on public.inscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own inscriptions"
  on public.inscriptions for delete
  using (auth.uid() = user_id);

-- Function to automatically create user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'member')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_evenements_updated_at
  before update on public.evenements
  for each row execute procedure public.handle_updated_at();

-- Helper function to check if user is admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$ language sql stable;
