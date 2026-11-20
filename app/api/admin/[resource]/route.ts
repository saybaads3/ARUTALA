import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

type Res = "sponsors" | "programs" | "produk" | "pesanan" | "dokumentasi";

const TABLES: Res[] = ["sponsors", "programs", "produk", "pesanan", "dokumentasi"];

const sponsorSchema = z.object({
  nama_sponsor: z.string().trim().min(1).max(160),
  jenis_dukungan: z.enum(["Dana", "Barang", "Jasa", "Konsumsi"]),
  nominal_akumulasi: z.coerce.number().int().min(0),
  logo_url: z.string().trim().max(500).nullable().optional(),
  tautan_mitra: z.string().trim().max(500).nullable().optional(),
  tampilkan_nama: z.coerce.boolean().optional().default(true),
  tanggal_masuk: z.string().trim().max(20).nullable().optional(),
});

const produkSchema = z.object({
  nama: z.string().trim().min(1).max(160),
  slug: z.string().trim().max(160).optional(),
  deskripsi: z.string().trim().max(2000).nullable().optional(),
  harga: z.coerce.number().int().min(0),
  stok: z.coerce.number().int().min(0),
  gambar_url: z.string().trim().max(500).nullable().optional(),
  kategori: z.string().trim().max(80).nullable().optional(),
  aktif: z.coerce.boolean().optional().default(true),
});

const programSchema = z.object({
  slug: z.string().trim().min(1).max(80),
  no: z.string().trim().min(1).max(4),
  title: z.string().trim().min(1).max(160),
  faction: z.string().trim().max(80),
  lead: z.string().trim().max(400),
  body: z.string().trim().max(4000),
  output: z.string().trim().max(400),
  publikasi: z.coerce.boolean().optional().default(true),
});

const dokumentasiSchema = z.object({
  tanggal: z.string().trim().min(8).max(12),
  judul: z.string().trim().min(1).max(200),
  keterangan: z.string().trim().max(3000).nullable().optional(),
  fase: z.enum(["Pra", "Lapangan", "Pasca"]),
  program_slug: z.string().trim().max(80).nullable().optional(),
  gambar_url: z.string().trim().max(500).nullable().optional(),
  tampil: z.coerce.boolean().optional().default(true),
});

const pesananPatch = z.object({
  status: z.enum(["baru", "dikonfirmasi", "dikirim", "selesai", "batal"]),
});

const SCHEMAS: Record<string, z.ZodTypeAny> = {
  sponsors: sponsorSchema,
  programs: programSchema,
  produk: produkSchema,
  dokumentasi: dokumentasiSchema,
  pesanan: pesananPatch,
};

const PATCH_SCHEMAS: Record<string, z.ZodTypeAny> = {
  sponsors: sponsorSchema.partial(),
  programs: programSchema.partial(),
  produk: produkSchema.partial(),
  dokumentasi: dokumentasiSchema.partial(),
  pesanan: pesananPatch,
};

type Params = { params: Promise<{ resource: string }> };

const guard = async (resource: string) => {
  if (!TABLES.includes(resource as Res)) {
    return { error: NextResponse.json({ error: "Resource tidak dikenal." }, { status: 404 }) };
  }
  const auth = await requireAdmin();
  if (auth.error) return { error: auth.error };
  const db = getSupabaseAdmin();
  if (!db) {
    return {
      error: NextResponse.json(
        { error: "Supabase belum dikonfigurasi di server. Isi env lalu jalankan ulang." },
        { status: 503 },
      ),
    };
  }
  return { db, resource: resource as Res };
};

export async function GET(_req: Request, ctx: Params) {
  const { resource } = await ctx.params;
  const g = await guard(resource);
  if (g.error) return g.error;

  let q = g.db!.from(g.resource!).select("*");
  if (g.resource === "sponsors") q = q.order("nominal_akumulasi", { ascending: false });
  else if (g.resource === "programs") q = q.order("no", { ascending: true });
  else if (g.resource === "pesanan") q = q.order("created_at", { ascending: false });
  else if (g.resource === "dokumentasi") q = q.order("tanggal", { ascending: false });
  else q = q.order("created_at", { ascending: false });

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(req: Request, ctx: Params) {
  const { resource } = await ctx.params;
  const g = await guard(resource);
  if (g.error) return g.error;
  if (g.resource === "pesanan") {
    return NextResponse.json({ error: "Pesanan dibuat dari halaman checkout." }, { status: 400 });
  }

  const schema = SCHEMAS[g.resource!] as z.ZodTypeAny;
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Data tidak valid." }, { status: 400 });
  }

  const row = { ...parsed.data };
  if (g.resource === "produk") {
    const nama = row.nama as string;
    row.slug = row.slug || nama.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    row.aktif = row.aktif ?? true;
  }

  const { data, error } = await g.db!.from(g.resource!).insert(row).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data }, { status: 201 });
}

export async function PATCH(req: Request, ctx: Params) {
  const { resource } = await ctx.params;
  const g = await guard(resource);
  if (g.error) return g.error;

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body.id !== "string") {
    return NextResponse.json({ error: "ID baris wajib dikirim." }, { status: 400 });
  }
  const { id, ...rest } = body;

  if (g.resource === "pesanan") {
    const parsed = pesananPatch.safeParse(rest);
    if (!parsed.success) {
      return NextResponse.json({ error: "Status tidak valid." }, { status: 400 });
    }
    const { data, error } = await g.db!.from("pesanan").update(parsed.data).eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ data });
  }

  const parsed = PATCH_SCHEMAS[g.resource!].safeParse(rest);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Data tidak valid." }, { status: 400 });
  }

  const { data, error } = await g.db!.from(g.resource!).update(parsed.data).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function DELETE(req: Request, ctx: Params) {
  const { resource } = await ctx.params;
  const g = await guard(resource);
  if (g.error) return g.error;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID baris wajib dikirim." }, { status: 400 });

  const { error } = await g.db!.from(g.resource!).delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
