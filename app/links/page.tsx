import Link from "next/link";
import ShareButton from "@/components/share-button";
import { site } from "@/lib/content";

export const metadata = {
  title: "Tautan resmi",
  description: "Semua tautan resmi ARUTALA 2027: sponsor, adopsi pos, dokumentasi, peta, dan kontak panitia.",
  alternates: { canonical: "/links" },
};

const links = [
  { href: "/sponsor#paket", title: "Paket sponsor dan papan peringkat", note: "Fasilitas, ambang tier, dan urutan logo", no: "01" },
  { href: "/sponsor#adopsi", title: "Adopsi pos kebutuhan", note: "Bus perintis, konsumsi, rompi, material TPS", no: "02" },
  { href: "/dokumentasi", title: "Jurnal dokumentasi", note: "Foto dan catatan 15 hari di lapangan", no: "03" },
  { href: "/program#peta", title: "Peta lokasi kegiatan", note: "Batu Lintang dan Dusun Sungai Utik", no: "04" },
  { href: "/merch", title: "Merchandise", note: "Katalog resmi, pembayaran dikonfirmasi panitia", no: "05" },
];

export default function LinksPage() {
  return (
    <div className="links-shell">
      <div style={{ textAlign: "center" }}>
        <svg viewBox="0 0 24 24" width="30" height="30" fill="none" style={{ color: "var(--ochre)", margin: "0 auto" }} aria-hidden="true">
          <path d="M3 17 12 6l9 11" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M6.5 20 12 12.5 17.5 20" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        </svg>
        <h1 className="display" style={{ fontSize: "2rem", letterSpacing: "-.02em", margin: ".75rem 0 .25rem" }}>
          ARUTALA 2027
        </h1>
        <p className="mono small muted" style={{ margin: 0, letterSpacing: ".06em" }}>
          MENJEJAK BAKTI, MENJAGA LESTARI
        </p>
        <p className="small" style={{ margin: ".9rem auto 0", maxWidth: "34ch", color: "var(--ink-soft)" }}>
          PMKM Teknik Lingkungan Untan di Desa Batu Lintang, Kapuas Hulu. 7 sampai 21 Januari 2027.
        </p>
      </div>

      <div className="links-stack">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="link-btn">
            <span aria-hidden="true">{l.no}</span>
            <span>
              <b>{l.title}</b>
              <small>{l.note}</small>
            </span>
            <span aria-hidden="true">›</span>
          </Link>
        ))}

        <a className="link-btn" href={`https://wa.me/${site.whatsapp}`} rel="noopener">
          <span aria-hidden="true">06</span>
          <span>
            <b>WhatsApp panitia</b>
            <small>{site.whatsappLabel}</small>
          </span>
          <span aria-hidden="true">›</span>
        </a>

        <a className="link-btn" href={site.proposalPath} rel="noopener">
          <span aria-hidden="true">07</span>
          <span>
            <b>Proposal kegiatan</b>
            <small>Dokumen PDF, 31 halaman</small>
          </span>
          <span aria-hidden="true">›</span>
        </a>
      </div>

      <div style={{ marginTop: "1.25rem" }}>
        <ShareButton />
      </div>

      <p className="mono small" style={{ textAlign: "center", color: "var(--ink-soft)", marginTop: "2rem" }}>
        {site.coords.dms}
      </p>
    </div>
  );
}
