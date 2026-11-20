import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/program", "/sponsor", "/dokumentasi", "/sosial", "/links", "/tentang", "/merch"];
  const now = new Date();
  return routes.map((r) => ({
    url: base + r,
    lastModified: now,
    changeFrequency: r === "" || r === "/sponsor" ? "weekly" : "monthly",
    priority: r === "" ? 1 : 0.7,
  }));
}
