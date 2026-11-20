# ARUTALA 2027

Situs publikasi PMKM ARUTALA 2027 (Jurusan Teknik Lingkungan, Fakultas Teknik, Universitas Tanjungpura) di Desa Batu Lintang, Kecamatan Embaloh Hulu, Kabupaten Kapuas Hulu.

Struktur proyek mengikuti pola SAYBA ARC: Next.js App Router, Supabase untuk data dan autentikasi, panel admin di `/admin`, serta modul penjualan merch seperti contoh Hima-merch.

## Halaman publik

| Rute | Isi |
| --- | --- |
| `/` | Beranda, ringkasan program, transparansi anggaran, paket sponsor |
| `/program` | Empat program kerja, Divisi Konstruksi, peta, rundown 15 hari |
| `/sponsor` | Papan peringkat mitra, simulasi 40 slot rompi, matriks fasilitas, adopsi pos |
| `/dokumentasi` | Logbook 15 hari, arsip foto dan catatan lapangan |
| `/sosial` | Rencana publikasi Instagram dan TikTok |
| `/links` | Halaman tautan bio, pengganti Linktree |
| `/tentang` | Susunan 38 panitia, rekapitulasi anggaran, dokumen proposal |
| `/merch`, `/merch/[slug]` | Katalog dan detail produk |
| `/keranjang` | Keranjang dan formulir pesanan |

## Menjalankan

```bash
npm install
cp .env.local.example .env.local   # lalu isi nilainya
npm run dev
```

Tanpa kredensial Supabase, seluruh halaman publik tetap tampil memakai data proposal. Panel admin dan pesanan merch menampilkan status belum aktif sampai env diisi.

## Supabase

1. Buat project baru di Supabase.
2. Jalankan `supabase/schema.sql` di SQL Editor.
3. Buat akun admin di Authentication > Users (email dan kata sandi).
4. Isi `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
ADMIN_EMAILS=email-admin@contoh.com
```

`ADMIN_EMAILS` membatasi akun yang boleh masuk panel. Bila dikosongkan, semua akun terautentikasi dianggap admin, jadi isi variabel ini saat produksi.

Service role key hanya dipakai di server (API route). Jangan pernah memasukkannya ke variabel `NEXT_PUBLIC_*`.

## Panel admin

`/admin` mengelola:

- Sponsor: nama, jenis dukungan, nominal, logo, tautan, status anonim
- Produk merch: harga, stok, gambar, status aktif
- Pesanan: status baru, dikonfirmasi, dikirim, selesai, batal, plus tautan WhatsApp pembeli
- Program: status publikasi dan teks inti
- Dokumentasi: catatan dan foto lapangan

## Struktur

```
app/
  admin/            panel admin dan login
  api/admin/        CRUD per resource (service role + sesi admin)
  api/orders/       pembuatan pesanan publik
  program|sponsor|dokumentasi|sosial|links|tentang|merch|keranjang/
components/         header, footer, ledger program, papan sponsor, rompi, keranjang
lib/                data proposal, repo Supabase, format, keranjang, auth admin
public/             font, gambar dari proposal, dokumen PDF
supabase/schema.sql
middleware.ts       perlindungan /admin dan refresh sesi
```

## Catatan data

Semua angka di `lib/content.ts` dikutip dari proposal: total anggaran Rp 106.352.644, kebutuhan dukungan Rp 103.312.644, 38 peserta, 40 rompi, koordinat 1°07'16.4"N 112°33'48.7"E. Proposal menulis kecamatan sebagai "Embaloh Hilir" pada beberapa bagian; dokumen peta dan hasil verifikasi OpenStreetMap menunjukkan **Embaloh Hulu**, dan itu yang dipakai di situs.

Gambar yang dipakai berasal dari lampiran proposal (peta denah lokasi, gambar kerja TPS, desain plang, gambar kerja rompi). Tidak ada foto kegiatan yang direkayasa. Bingkai dokumentasi yang kosong ditandai sebagai slot belum terisi.

## Deploy

Vercel: hubungkan repositori, tambahkan variabel env yang sama, deploy. Domain diatur di `NEXT_PUBLIC_SITE_URL` agar sitemap dan metadata memakai URL yang benar.
