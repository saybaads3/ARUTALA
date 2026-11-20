"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onCartChange, readCart } from "@/lib/cart";

export default function CartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const sync = () => setCount(readCart().reduce((n, i) => n + i.qty, 0));
    sync();
    return onCartChange(sync);
  }, []);

  return (
    <Link href="/keranjang" className="btn btn--ghost btn--sm">
      Keranjang
      <span className="mono" aria-label={`${count} item`}>
        {count}
      </span>
    </Link>
  );
}
