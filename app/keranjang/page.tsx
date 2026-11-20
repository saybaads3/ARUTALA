import PageHead from "@/components/page-head";
import CartView from "@/components/cart-view";

export const metadata = {
  title: "Keranjang",
  description: "Keranjang merchandise ARUTALA 2027 dan formulir pesanan.",
  robots: { index: false, follow: false },
};

export default function KeranjangPage() {
  return (
    <>
      <PageHead
        eyebrow="Pesanan"
        title="Keranjang."
        lede="Periksa item, isi data pengiriman, lalu kirim pesanan. Panitia mengonfirmasi stok dan pembayaran lewat WhatsApp."
      />
      <section className="section">
        <div className="wrap">
          <CartView />
        </div>
      </section>
    </>
  );
}
