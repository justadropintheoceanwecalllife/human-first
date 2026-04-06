-- human-first Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/tuvacldzwafkblbkgkdp/editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  anonymous_id text unique not null,
  display_name text not null,
  real_name text,
  department text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_active timestamp with time zone default timezone('utc'::text, now()) not null,
  streak_count integer default 0 not null
);

-- Submissions table
create table if not exists public.submissions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  challenge_id text not null,
  category text not null check (category in ('nature', 'workspace', 'food', 'creative', 'pets', 'selfcare', 'community')),
  image_url text not null,
  caption text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Chat messages table
create table if not exists public.chat_messages (
  id uuid primary key default uuid_generate_v4(),
  challenge_id text not null,
  user_id uuid references public.users(id) on delete set null,
  message text not null,
  is_ai boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index if not exists submissions_user_id_idx on public.submissions(user_id);
create index if not exists submissions_challenge_id_idx on public.submissions(challenge_id);
create index if not exists submissions_category_idx on public.submissions(category);
create index if not exists submissions_created_at_idx on public.submissions(created_at desc);
create index if not exists chat_messages_challenge_id_idx on public.chat_messages(challenge_id);
create index if not exists chat_messages_created_at_idx on public.chat_messages(created_at desc);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.submissions enable row level security;
alter table public.chat_messages enable row level security;

-- RLS Policies

-- Users: Anyone can read, users can update their own profile
create policy "Users are viewable by everyone"
  on public.users for select
  using (true);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid()::text = id::text);

create policy "Users can insert their own profile"
  on public.users for insert
  with check (true);

-- Submissions: Anyone can read, users can insert their own
create policy "Submissions are viewable by everyone"
  on public.submissions for select
  using (true);

create policy "Users can insert their own submissions"
  on public.submissions for insert
  with check (true);

create policy "Users can delete their own submissions"
  on public.submissions for delete
  using (auth.uid()::text = user_id::text);

-- Chat messages: Anyone can read and insert
create policy "Chat messages are viewable by everyone"
  on public.chat_messages for select
  using (true);

create policy "Anyone can insert chat messages"
  on public.chat_messages for insert
  with check (true);

-- Storage bucket for images/videos
insert into storage.buckets (id, name, public)
values ('submissions', 'submissions', true)
on conflict (id) do nothing;

-- Storage policies: Anyone can upload, view, and delete
create policy "Anyone can upload submissions"
  on storage.objects for insert
  with check (bucket_id = 'submissions');

create policy "Submissions are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'submissions');

create policy "Users can delete their own submissions"
  on storage.objects for delete
  using (bucket_id = 'submissions');
