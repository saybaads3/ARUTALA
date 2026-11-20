import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AddToCart from "@/components/add-to-cart";
import TenunBand from "@/components/tenun-band";
import { getProdukBySlug } from "@/lib/repo";
import { rupiah } from "@/lib/format";
import { site } from "@/lib/content";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const produk = await getProdukBySlug(slug);
  if (!produk) return { title: "Produk tidak ditemukan" };
  return {
    title: produk.nama,
    description: produk.deskripsi ?? `Merchandise ARUTALA 2027: ${produk.nama}.`,
    alternates: { canonical: `/merch/${produk.slug}` },
  };
}

export default async function ProdukPage({ params }: Params) {
  const { slug } = await params;
  const produk = await getProdukBySlug(slug);
  if (!produk) notFound();

  return (
    <section className="section">
      <div className="wrap">
        <p className="mono small muted" style={{ marginBottom: "1.5rem" }}>
          <Link className="textlink" href="/merch">
            Katalog
          </Link>{" "}
          / {produk.kategori ?? "Merch"}
        </p>

        <div className="split">
          <div>
            <div className="product__img" style={{ border: "1px solid var(--line)", borderRadius: "var(--r)" }}>
              {produk.gambar_url ? (
                <img src={produk.gambar_url} alt={produk.nama} />
              ) : (
                <span>Gambar belum diunggah</span>
              )}
            </div>
          </div>

          <div>
            <h1 className="page-title" style={{ fontSize: "clamp(2rem,1.2rem+2.6vw,3rem)" }}>
              {produk.nama}
            </h1>
            <p className="mono" style={{ fontSize: "1.15rem", margin: "1rem 0 .25rem" }}>
              {rupiah(produk.harga)}
            </p>
            <p className="small muted">Stok tersedia {produk.stok}</p>

            {produk.deskripsi && (
              <div className="prose" style={{ marginTop: "1.5rem" }}>
                <p>{produk.deskripsi}</p>
              </div>
            )}

            <div style={{ marginTop: "1.75rem", display: "flex", flexWrap: "wrap", gap: ".6rem" }}>
              <AddToCart produk={produk} stok={produk.stok} />
              <Link className="btn btn--ghost" href="/keranjang">
                Lihat keranjang
              </Link>
            </div>

            <div className="notice" style={{ marginTop: "1.75rem" }}>
              <b>Pengambilan dan pengiriman.</b> Panitia mengonfirmasi lewat WhatsApp {site.whatsappLabel}.
              Pengambilan langsung di sekretariat atau pengiriman sesuai kesepakatan.
            </div>
          </div>
        </div>
      </div>
      <TenunBand className="mt-16" />
    </section>
  );
}
