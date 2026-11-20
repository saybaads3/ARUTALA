"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cartTotal, clearCart, onCartChange, readCart, removeItem, setQty, type CartItem } from "@/lib/cart";
import { rupiah } from "@/lib/format";
import { site } from "@/lib/content";

type Success = { kode: string; total: number };

export default function CartView() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<Success | null>(null);
  const [form, setForm] = useState({ nama: "", whatsapp: "", alamat: "", catatan: "" });

  useEffect(() => {
    const sync = () => setItems(readCart());
    sync();
    setReady(true);
    return onCartChange(sync);
  }, []);

  const total = cartTotal(items);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (items.length === 0) {
      setError("Keranjang masih kosong.");
      return;
    }
    if (form.nama.trim().length < 2) {
      setError("Nama penerima wajib diisi.");
      return;
    }
    if (!/^0[0-9]{8,14}$/.test(form.whatsapp.replace(/[\s-]/g, ""))) {
      setError("Nomor WhatsApp tidak valid. Gunakan format 08xxxxxxxxxx.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({ produk_id: i.id, qty: i.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Pesanan gagal dikirim. Coba lagi.");
        return;
      }
      clearCart();
      setSuccess({ kode: data.kode, total: data.total });
      setItems([]);
    } catch {
      setError("Tidak dapat menghubungi server. Periksa koneksi lalu coba lagi.");
    } finally {
      setSending(false);
    }
  };

  if (!ready) {
    return <p className="mono small muted">Memuat keranjang...</p>;
  }

  if (success) {
    const pesan = encodeURIComponent(
      `Halo, saya sudah membuat pesanan ${success.kode} di situs ARUTALA 2027 dengan total ${rupiah(success.total)}. Mohon info langkah pembayarannya.`,
    );
    return (
      <div className="empty" role="status">
        <h3>Pesanan {success.kode} tercatat</h3>
        <p>
          Total {rupiah(success.total)}. Panitia akan menghubungi lewat WhatsApp untuk konfirmasi stok dan
          pembayaran. Simpan kode pesanan ini.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: ".6rem", marginTop: "1.25rem" }}>
          <a className="btn btn--primary" href={`https://wa.me/${site.whatsapp}?text=${pesan}`} rel="noopener">
            Konfirmasi lewat WhatsApp
          </a>
          <Link className="btn btn--ghost" href="/merch">
            Kembali ke katalog
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="empty">
        <h3>Keranjang masih kosong</h3>
        <p>Belum ada produk yang dipilih. Katalog merch diisi oleh pengurus lewat panel admin.</p>
        <Link className="btn btn--ghost" href="/merch" style={{ marginTop: "1rem" }}>
          Buka katalog merch
        </Link>
      </div>
    );
  }

  return (
    <div className="split">
      <div>
        <div style={{ borderTop: "1px solid var(--line-strong)" }}>
          {items.map((item) => (
            <div className="cart-row" key={item.id}>
              <div>
                <b style={{ display: "block", fontWeight: 600 }}>{item.nama}</b>
                <small className="mono muted">{rupiah(item.harga)}</small>
              </div>
              <div className="qty">
                <button type="button" aria-label={`Kurangi ${item.nama}`} onClick={() => setQty(item.id, item.qty - 1)}>
                  -
                </button>
                <span aria-live="polite">{item.qty}</span>
                <button type="button" aria-label={`Tambah ${item.nama}`} onClick={() => setQty(item.id, item.qty + 1)}>
                  +
                </button>
              </div>
              <button
                type="button"
                className="mono small"
                style={{ border: 0, background: "none", cursor: "pointer", textDecoration: "underline" }}
                onClick={() => removeItem(item.id)}
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "1rem" }}>
          <span className="mono small muted">Total</span>
          <b className="mono">{rupiah(total)}</b>
        </div>
      </div>

      <form onSubmit={submit} noValidate>
        <h2 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
          Data pengiriman
        </h2>
        <div className="form-grid">
          <label className="field">
            <span className="label">Nama penerima</span>
            <input
              className="input"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              autoComplete="name"
              required
            />
          </label>
          <label className="field">
            <span className="label">WhatsApp</span>
            <input
              className="input"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              inputMode="tel"
              placeholder="08xxxxxxxxxx"
              autoComplete="tel"
              required
            />
          </label>
        </div>
        <label className="field">
          <span className="label">Alamat atau catatan pengambilan</span>
          <textarea
            className="textarea"
            value={form.alamat}
            onChange={(e) => setForm({ ...form, alamat: e.target.value })}
            placeholder="Alamat kirim, atau tulis ambil langsung di sekretariat"
          />
        </label>
        <label className="field">
          <span className="label">Catatan tambahan</span>
          <input
            className="input"
            value={form.catatan}
            onChange={(e) => setForm({ ...form, catatan: e.target.value })}
            placeholder="Ukuran, warna, atau permintaan lain"
          />
        </label>

        {error && (
          <p className="notice" role="alert" style={{ marginBottom: "1rem" }}>
            {error}
          </p>
        )}

        <button className="btn btn--primary" type="submit" disabled={sending} style={{ width: "100%" }}>
          {sending ? "Mengirim pesanan..." : `Kirim pesanan, ${rupiah(total)}`}
        </button>
        <p className="small muted" style={{ marginTop: ".75rem" }}>
          Pembayaran dikonfirmasi manual oleh panitia lewat WhatsApp. Tidak ada pembayaran otomatis di halaman ini.
        </p>
      </form>
    </div>
  );
}
