create table if not exists public.pixel_peak_scores (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 12),
  score integer not null check (score >= 0 and score <= 100000),
  created_at timestamptz not null default now()
);

alter table public.pixel_peak_scores enable row level security;

create policy "anyone can read scores"
  on public.pixel_peak_scores for select using (true);

create policy "anyone can submit scores"
  on public.pixel_peak_scores for insert with check (true);
