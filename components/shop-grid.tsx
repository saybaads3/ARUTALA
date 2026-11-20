import Link from "next/link";
import type { Produk } from "@/lib/repo";
import { rupiah } from "@/lib/format";

type Props = { products: Produk[] };

export default function ShopGrid({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className="empty">
        <h3>Belum ada produk aktif</h3>
        <p>
          Katalog merchandise diisi oleh pengurus lewat panel admin. Produk yang ditambahkan akan muncul di sini
          lengkap dengan harga dan stok.
        </p>
        <Link className="btn btn--ghost" href="/program" style={{ marginTop: "1rem" }}>
          Lihat program kerja
        </Link>
      </div>
    );
  }

  return (
    <div className="merch-grid">
      {products.map((p) => (
        <article className="product" key={p.id}>
          <div className="product__img">
            {p.gambar_url ? (
              <img src={p.gambar_url} alt={p.nama} loading="lazy" />
            ) : (
              <span>Gambar belum diunggah</span>
            )}
          </div>
          <div className="product__body">
            <p className="mono small muted" style={{ margin: 0 }}>
              {p.kategori ?? "Merch"}
            </p>
            <h3 className="product__name">
              <Link href={`/merch/${p.slug}`}>{p.nama}</Link>
            </h3>
            <p className="product__price">{rupiah(p.harga)}</p>
            <div className="product__foot">
              <span className="small muted">Stok {p.stok}</span>
              <Link className="btn btn--ghost btn--sm" href={`/merch/${p.slug}`}>
                Detail
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
