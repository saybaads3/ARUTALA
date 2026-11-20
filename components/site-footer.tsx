import Link from "next/link";
import { site } from "@/lib/content";
import TenunBand from "./tenun-band";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <TenunBand variant="dark" className="mb-10" />
        <div className="footer-grid">
          <div>
            <p className="footer-word">
              {site.name} {site.year}
            </p>
            <p style={{ color: "rgba(244,241,231,0.76)", maxWidth: "34ch", margin: 0 }}>
              {site.tagline}. Program Pengabdian Mahasiswa Kepada Masyarakat {site.organizer}.
            </p>
          </div>

          <div>
            <h2>Halaman</h2>
            <div className="footer-list">
              <Link href="/program">Program kerja</Link>
              <Link href="/sponsor">Sponsor dan mitra</Link>
              <Link href="/dokumentasi">Dokumentasi lapangan</Link>
              <Link href="/merch">Merchandise</Link>
              <Link href="/tentang">Tentang dan anggaran</Link>
            </div>
          </div>

          <div>
            <h2>Kontak</h2>
            <div className="footer-list">
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <a href={`https://wa.me/${site.whatsapp}`} rel="noopener">WhatsApp {site.whatsappLabel}</a>
              <span style={{ color: "rgba(244,241,231,0.6)" }}>
                {site.village}, {site.district}
                <br />
                {site.regency}, {site.province}
              </span>
              <a href={site.proposalPath} rel="noopener">Unduh proposal (PDF)</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            {site.coords.dms} · {site.dates.label}
          </span>
          <span>
            {site.shortOrganizer} · <Link href="/admin">Panel admin</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
