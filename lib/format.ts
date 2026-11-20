import type { TierName } from "./content";

export const rupiah = (n: number) =>
  "Rp " + Math.round(n).toLocaleString("id-ID");

export const compactRupiah = (n: number) => {
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return "Rp " + v.toLocaleString("id-ID", { maximumFractionDigits: v < 10 ? 2 : 1 }) + " jt";
  }
  if (n >= 1_000) return "Rp " + Math.round(n / 1000).toLocaleString("id-ID") + " rb";
  return rupiah(n);
};

export const tierOf = (nominal: number): TierName => {
  if (nominal > 5_000_000) return "Buana";
  if (nominal >= 2_000_000) return "Wana";
  if (nominal >= 750_000) return "Tirta";
  return "Donatur Reguler";
};

export const tierClass = (tier: string) => {
  const key = tier.toLowerCase().replace(/\s+/g, "-");
  return `tier--${key}`;
};

export const percent = (part: number, total: number) =>
  total <= 0 ? 0 : Math.max(0, Math.min(100, (part / total) * 100));

export const percentLabel = (part: number, total: number) =>
  (total <= 0 ? 0 : (part / total) * 100).toLocaleString("id-ID", {
    maximumFractionDigits: 1,
  }) + "%";

export const formatDate = (iso: string) => {
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
};

export const orderCode = () =>
  "ART-" + Date.now().toString(36).toUpperCase().slice(-6) +
  Math.floor(Math.random() * 90 + 10);
