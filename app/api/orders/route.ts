import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { orderCode } from "@/lib/format";

const bodySchema = z.object({
  nama: z.string().trim().min(2, "Nama penerima wajib diisi.").max(120),
  whatsapp: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, ""))
    .refine((v) => /^0[0-9]{8,14}$/.test(v), "Nomor WhatsApp tidak valid."),
  alamat: z.string().trim().max(400).optional().default(""),
  catatan: z.string().trim().max(400).optional().default(""),
  items: z
    .array(z.object({ produk_id: z.string().uuid(), qty: z.number().int().min(1).max(50) }))
    .min(1, "Keranjang masih kosong."),
});

export async function POST(req: Request) {
  const db = getSupabaseAdmin();
  if (!db) {
    return NextResponse.json(
      { error: "Pesanan belum aktif. Supabase belum dikonfigurasi di server ini." },
      { status: 503 },
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data pesanan tidak valid." },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const ids = [...new Set(data.items.map((i) => i.produk_id))];
  const { data: produkRows, error: produkError } = await db
    .from("produk")
    .select("id,nama,harga,stok,aktif")
    .in("id", ids);

  if (produkError) {
    return NextResponse.json({ error: "Gagal membaca katalog produk." }, { status: 500 });
  }

  const items = [];
  let total = 0;
  for (const item of data.items) {
    const produk = produkRows?.find((p) => p.id === item.produk_id);
    if (!produk || !produk.aktif) {
      return NextResponse.json({ error: "Ada produk yang tidak tersedia lagi." }, { status: 409 });
    }
    if (produk.stok < item.qty) {
      return NextResponse.json(
        { error: `Stok ${produk.nama} tinggal ${produk.stok}.` },
        { status: 409 },
      );
    }
    total += produk.harga * item.qty;
    items.push({ produk_id: produk.id, nama: produk.nama, harga: produk.harga, qty: item.qty });
  }

  const kode = orderCode();
  const { error: insertError } = await db.from("pesanan").insert({
    kode,
    nama: data.nama,
    whatsapp: data.whatsapp,
    alamat: data.alamat || null,
    catatan: data.catatan || null,
    total,
    status: "baru",
    items,
  });

  if (insertError) {
    return NextResponse.json({ error: "Pesanan gagal disimpan. Coba lagi." }, { status: 500 });
  }

  // Stok dikurangi setelah pesanan tercatat. Bila gagal, admin tetap melihat
  // pesanan dan stok dapat dikoreksi manual.
  for (const item of items) {
    const produk = produkRows?.find((p) => p.id === item.produk_id);
    if (!produk) continue;
    await db
      .from("produk")
      .update({ stok: Math.max(0, produk.stok - item.qty) })
      .eq("id", item.produk_id);
  }

  return NextResponse.json({ kode, total }, { status: 201 });
}
