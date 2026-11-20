"use client";

export type CartItem = {
  id: string;
  slug: string;
  nama: string;
  harga: number;
  qty: number;
  gambar_url?: string | null;
};

const KEY = "arutala-cart-v1";
const EVENT = "arutala-cart-change";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i) => i && typeof i.id === "string" && typeof i.harga === "number" && typeof i.qty === "number",
    );
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVENT));
}

export function addToCart(item: Omit<CartItem, "qty">, qty = 1) {
  const items = readCart();
  const found = items.find((i) => i.id === item.id);
  if (found) found.qty += qty;
  else items.push({ ...item, qty });
  writeCart(items);
}

export function setQty(id: string, qty: number) {
  const items = readCart()
    .map((i) => (i.id === id ? { ...i, qty: Math.max(0, qty) } : i))
    .filter((i) => i.qty > 0);
  writeCart(items);
}

export function removeItem(id: string) {
  writeCart(readCart().filter((i) => i.id !== id));
}

export function clearCart() {
  writeCart([]);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.harga * i.qty, 0);
}

export function onCartChange(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
