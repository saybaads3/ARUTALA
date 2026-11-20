-- Skema database ARUTALA 2027 (Supabase / Postgres)
-- Jalankan di SQL Editor Supabase, sekali saja.
-- Semua operasi tulis dilakukan lewat API route server memakai service role,
-- sehingga RLS cukup mengizinkan baca publik pada baris yang dipublikasikan.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- sponsor
create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  nama_sponsor text not null,
  jenis_dukungan text not null default 'Dana'
    check (jenis_dukungan in ('Dana', 'Barang', 'Jasa', 'Konsumsi')),
  nominal_akumulasi bigint not null default 0 check (nominal_akumulasi >= 0),
  logo_url text,
  tautan_mitra text,
  tampilkan_nama boolean not null default true,
  tanggal_masuk date,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- program
create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  no text not null default '01',
  title text not null,
  faction text not null default '',
  lead text not null default '',
  body text not null default '',
  items jsonb not null default '[]'::jsonb,
  output text not null default '',
  publikasi boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- produk
create table if not exists public.produk (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nama text not null,
  deskripsi text,
  harga integer not null default 0 check (harga >= 0),
  stok integer not null default 0 check (stok >= 0),
  gambar_url text,
  kategori text,
  aktif boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- pesanan
create table if not exists public.pesanan (
  id uuid primary key default gen_random_uuid(),
  kode text not null unique,
  nama text not null,
  whatsapp text not null,
  alamat text,
  catatan text,
  total integer not null default 0,
  status text not null default 'baru'
    check (status in ('baru', 'dikonfirmasi', 'dikirim', 'selesai', 'batal')),
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists pesanan_created_idx on public.pesanan (created_at desc);

-- ---------------------------------------------------------------- dokumentasi
create table if not exists public.dokumentasi (
  id uuid primary key default gen_random_uuid(),
  tanggal date not null,
  judul text not null,
  keterangan text,
  fase text not null default 'Lapangan' check (fase in ('Pra', 'Lapangan', 'Pasca')),
  program_slug text,
  gambar_url text,
  tampil boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- RLS
alter table public.sponsors enable row level security;
alter table public.programs enable row level security;
alter table public.produk enable row level security;
alter table public.pesanan enable row level security;
alter table public.dokumentasi enable row level security;

-- Baca publik hanya untuk konten yang dipublikasikan.
drop policy if exists "sponsors read" on public.sponsors;
create policy "sponsors read" on public.sponsors for select using (true);

drop policy if exists "programs read publik" on public.programs;
create policy "programs read publik" on public.programs for select using (publikasi = true);

drop policy if exists "produk read aktif" on public.produk;
create policy "produk read aktif" on public.produk for select using (aktif = true);

drop policy if exists "dokumentasi read tampil" on public.dokumentasi;
create policy "dokumentasi read tampil" on public.dokumentasi for select using (tampil = true);

-- Pesanan tidak dapat dibaca publik. Dibuat dan dibaca lewat service role.
-- Tidak ada policy select/insert untuk anon pada tabel pesanan.

-- ---------------------------------------------------------------- storage (opsional)
-- Buat bucket publik bernama "arutala" untuk gambar dokumentasi dan produk.
-- insert into storage.buckets (id, name, public) values ('arutala', 'arutala', true)
-- on conflict (id) do nothing;

-- ---------------------------------------------------------------- contoh program
-- Halaman program memakai data proposal sebagai fallback bila tabel kosong.
-- Setelah baris pertama ditambahkan lewat panel admin, tabel menjadi sumber data.
