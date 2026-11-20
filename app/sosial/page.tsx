import Link from "next/link";
import PageHead from "@/components/page-head";
import TenunBand from "@/components/tenun-band";
import { site } from "@/lib/content";

export const metadata = {
  title: "Kanal sosial",
  description: "Rencana publikasi Instagram dan TikTok ARUTALA 2027, beserta status akun resmi.",
  alternates: { canonical: "/sosial" },
};

const channels = [
  {
    name: "Instagram",
    handle: site.instagram,
    role: "Poster apresiasi sponsor, infografis program, carousel edukasi, Reels harian",
    plan: [
      "Pengumuman mitra baru dengan tautan langsung ke peringkat di halaman sponsor",
      "Infografis empat program kerja sebelum keberangkatan",
      "Reels rangkuman harian selama 7 sampai 21 Januari",
    ],
  },
  {
    name: "TikTok",
    handle: site.tiktok,
    role: "Vlog perjalanan, keseharian di Rumah Betang, cuplikan TL Mengajar dan SEPEDA",
    plan: [
      "Vlog perjalanan Pontianak ke Kapuas Hulu",
      "Day in the life peserta di Rumah Betang",
      "Timelapse konstruksi tugu dan perbaikan TPS",
    ],
  },
];

export default function SosialPage() {
  return (
    <>
      <PageHead
        eyebrow="Kanal sosial"
        title="Publikasi berpusat di satu domain."
        lede="Instagram dan TikTok menjadi pintu masuk, situs ini menjadi rumah data: papan peringkat sponsor, jadwal, peta, dan arsip yang tidak hilang tertimbun unggahan."
        meta={["Instagram", "TikTok", "Tautan bio ke /links"]}
      />

      <section className="section">
        <div className="wrap">
          <div className="split--even" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.25rem" }}>
            {channels.map((c) => (
              <article className="card" key={c.name}>
                <p className="eyebrow" style={{ marginBottom: ".5rem" }}>
                  {c.name}
                </p>
                <h2 className="display" style={{ fontSize: "1.6rem", margin: "0 0 .5rem" }}>
                  {c.handle ? `@${c.handle.replace(/^@/, "")}` : "Belum aktif"}
                </h2>
                <p className="small muted" style={{ marginTop: 0 }}>
                  {c.role}
                </p>

                <h3 className="mono small" style={{ letterSpacing: ".08em", margin: "1.25rem 0 .5rem", textTransform: "uppercase", color: "var(--ink-soft)" }}>
                  Rencana konten
                </h3>
                <ul className="small" style={{ margin: 0, paddingLeft: "1.1rem", color: "var(--ink-soft)" }}>
                  {c.plan.map((p) => (
                    <li key={p} style={{ marginBottom: ".3rem" }}>
                      {p}
                    </li>
                  ))}
                </ul>

                <div style={{ marginTop: "1.25rem" }}>
                  {c.handle ? (
                    <a
                      className="btn btn--primary btn--sm"
                      href={`https://www.${c.name.toLowerCase()}.com/${c.handle.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Buka {c.name}
                    </a>
                  ) : (
                    <p className="notice notice--plain" style={{ margin: 0 }}>
                      Akun resmi belum dipublikasikan. Tautan akan dipasang setelah nama akun final, tanpa tautan
                      sementara yang bisa salah tujuan.
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="notice" style={{ marginTop: "2rem" }}>
            <b>Tidak ada sematan palsu.</b> Social wall akan diisi setelah akun resmi aktif dan unggahan pertama
            terbit. Sebelum itu, halaman ini menampilkan rencana konten, bukan kotak embed kosong.
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: ".75rem", marginTop: "1.75rem" }}>
            <Link className="btn btn--dark" href="/links">
              Halaman tautan bio
            </Link>
            <Link className="btn btn--ghost" href="/dokumentasi">
              Arsip dokumentasi
            </Link>
          </div>
        </div>
      </section>

      <TenunBand />
    </>
  );
}
