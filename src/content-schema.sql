-- Content Management Schema for Sammy Nathan Page
-- This schema supports essays, blog posts, case studies, and updates

-- Content Table
create table content (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  type text check (type in ('cornerstone', 'blog', 'case-study', 'update')),
  summary text,
  body text not null,
  published boolean default false,
  featured boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table content enable row level security;

-- Public can read published content
create policy "public can read published"
on content
for select
using (published = true);

-- Admin full access (authenticated users)
create policy "admin full access"
on content
for all
using (auth.role() = 'authenticated');
