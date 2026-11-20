import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://arutala.web.id";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/keranjang", "/api/"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
