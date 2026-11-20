import PageHead from "@/components/page-head";
import ShopGrid from "@/components/shop-grid";
import TenunBand from "@/components/tenun-band";
import { site } from "@/lib/content";
import { listProduk } from "@/lib/repo";

export const revalidate = 60;

export const metadata = {
  title: "Merchandise",
  description: "Katalog merchandise resmi ARUTALA 2027. Pembayaran dikonfirmasi manual oleh panitia.",
  alternates: { canonical: "/merch" },
};

export default async function MerchPage() {
  const products = await listProduk(true);

  return (
    <>
      <PageHead
        eyebrow="Merchandise"
        title="Katalog resmi ARUTALA 2027."
        lede="Produk dicatat panitia beserta harga dan stok. Pesanan masuk ke panel admin, lalu dikonfirmasi lewat WhatsApp sebelum pembayaran."
        meta={[`${products.length} produk aktif`, "Pembayaran manual", site.district]}
      />

      <section className="section">
        <div className="wrap">
          <ShopGrid products={products} />
          <div className="notice" style={{ marginTop: "2rem" }}>
            <b>Alur pesanan.</b> Pilih produk, isi data pengiriman, lalu kirim pesanan. Kode pesanan muncul di
            akhir dan panitia menghubungi lewat WhatsApp untuk konfirmasi stok dan pembayaran. Tidak ada
            pembayaran otomatis di situs ini.
          </div>
        </div>
        <TenunBand />
      </section>
    </>
  );
}
