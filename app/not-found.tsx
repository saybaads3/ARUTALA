import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap wrap--narrow">
        <p className="eyebrow">404</p>
        <h1 className="page-title">Halaman ini tidak ada di peta.</h1>
        <p className="lede" style={{ marginTop: "1.25rem" }}>
          Alamat yang dibuka mungkin sudah berubah atau salah ketik. Beberapa halaman yang tersedia:
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: ".6rem", marginTop: "1.75rem" }}>
          <Link className="btn btn--primary" href="/">
            Beranda
          </Link>
          <Link className="btn btn--ghost" href="/program">
            Program kerja
          </Link>
          <Link className="btn btn--ghost" href="/sponsor">
            Sponsor
          </Link>
          <Link className="btn btn--ghost" href="/links">
            Tautan resmi
          </Link>
        </div>
        <p className="mono small muted" style={{ marginTop: "2.5rem" }}>
          1°07&apos;16.4&quot;N 112°33&apos;48.7&quot;E
        </p>
      </div>
    </section>
  );
}
