"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";

type Props = {
  produk: { id: string; slug: string; nama: string; harga: number; gambar_url?: string | null };
  stok: number;
};

export default function AddToCart({ produk, stok }: Props) {
  const [added, setAdded] = useState(false);

  if (stok <= 0) {
    return (
      <button type="button" className="btn btn--ghost" disabled>
        Stok habis
      </button>
    );
  }

  return (
    <button
      type="button"
      className="btn btn--primary"
      onClick={() => {
        addToCart({ ...produk, gambar_url: produk.gambar_url ?? null });
        setAdded(true);
        window.setTimeout(() => setAdded(false), 2200);
      }}
    >
      {added ? "Masuk keranjang" : "Tambah ke keranjang"}
    </button>
  );
}
