import { getSupabaseAdmin } from "./supabase-admin";
import { programs as seedPrograms, type Program } from "./content";
import { tierOf } from "./format";

export type Sponsor = {
  id: string;
  nama_sponsor: string;
  jenis_dukungan: "Dana" | "Barang" | "Jasa" | "Konsumsi";
  nominal_akumulasi: number;
  logo_url: string | null;
  tautan_mitra: string | null;
  tampilkan_nama: boolean;
  tanggal_masuk: string | null;
  tier?: string;
  created_at?: string;
};

export type Produk = {
  id: string;
  slug: string;
  nama: string;
  deskripsi: string | null;
  harga: number;
  stok: number;
  gambar_url: string | null;
  kategori: string | null;
  aktif: boolean;
  created_at?: string;
};

export type PesananItem = {
  produk_id: string;
  nama: string;
  harga: number;
  qty: number;
};

export type Pesanan = {
  id: string;
  kode: string;
  nama: string;
  whatsapp: string;
  alamat: string | null;
  catatan: string | null;
  total: number;
  status: "baru" | "dikonfirmasi" | "dikirim" | "selesai" | "batal";
  items: PesananItem[];
  created_at: string;
};

export type Dokumentasi = {
  id: string;
  tanggal: string;
  judul: string;
  keterangan: string | null;
  fase: "Pra" | "Lapangan" | "Pasca";
  program_slug: string | null;
  gambar_url: string | null;
  tampil: boolean;
};

const safe = async <T,>(fn: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await fn();
  } catch {
    return fallback;
  }
};

export const listSponsors = () =>
  safe<Sponsor[]>(async () => {
    const db = getSupabaseAdmin();
    if (!db) return [];
    const { data, error } = await db
      .from("sponsors")
      .select("id,nama_sponsor,jenis_dukungan,nominal_akumulasi,logo_url,tautan_mitra,tampilkan_nama,tanggal_masuk,created_at")
      .order("nominal_akumulasi", { ascending: false });
    if (error) return [];
    return (data ?? []).map((row) => ({ ...row, tier: tierOf(row.nominal_akumulasi) })) as Sponsor[];
  }, []);

export const listPrograms = () =>
  safe<Program[]>(async () => {
    const db = getSupabaseAdmin();
    if (!db) return seedPrograms;
    const { data, error } = await db
      .from("programs")
      .select("slug,no,title,faction,lead,body,items,output")
      .eq("publikasi", true)
      .order("no", { ascending: true });
    if (error || !data || data.length === 0) return seedPrograms;
    return data as Program[];
  }, seedPrograms);

export const listProduk = (aktifSaja = true) =>
  safe<Produk[]>(async () => {
    const db = getSupabaseAdmin();
    if (!db) return [];
    let q = db.from("produk").select("*").order("created_at", { ascending: false });
    if (aktifSaja) q = q.eq("aktif", true);
    const { data, error } = await q;
    if (error) return [];
    return (data ?? []) as Produk[];
  }, []);

export const getProdukBySlug = (slug: string) =>
  safe<Produk | null>(async () => {
    const db = getSupabaseAdmin();
    if (!db) return null;
    const { data, error } = await db
      .from("produk")
      .select("*")
      .eq("slug", slug)
      .eq("aktif", true)
      .maybeSingle();
    if (error) return null;
    return (data as Produk) ?? null;
  }, null);

export const listPesanan = () =>
  safe<Pesanan[]>(async () => {
    const db = getSupabaseAdmin();
    if (!db) return [];
    const { data, error } = await db
      .from("pesanan")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return [];
    return (data ?? []) as Pesanan[];
  }, []);

export const listDokumentasi = (publikSaja = true) =>
  safe<Dokumentasi[]>(async () => {
    const db = getSupabaseAdmin();
    if (!db) return [];
    let q = db.from("dokumentasi").select("*").order("tanggal", { ascending: true });
    if (publikSaja) q = q.eq("tampil", true);
    const { data, error } = await q;
    if (error) return [];
    return (data ?? []) as Dokumentasi[];
  }, []);

export { tierOf };
