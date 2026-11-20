import Link from "next/link";
import PageHead from "@/components/page-head";
import ProgramList from "@/components/program-list";
import DayTimeline from "@/components/day-timeline";
import TenunBand from "@/components/tenun-band";
import { construction, programs, site } from "@/lib/content";
import { listPrograms } from "@/lib/repo";

export const revalidate = 300;

export const metadata = {
  title: "Program kerja",
  description:
    "Empat program PMKM ARUTALA 2027: Geo-Digital Initiative, Eco-Action & Sustainability, Griya Lestari, dan Bakti Amerta, plus pekerjaan Divisi Konstruksi.",
  alternates: { canonical: "/program" },
};

export default async function ProgramPage() {
  const items = await listPrograms();

  return (
    <>
      <PageHead
        eyebrow="Program kerja"
        title="Empat program, satu jadwal 15 hari."
        lede="Setiap program berangkat dari persoalan yang disebut di proposal: data ruang desa belum terdigitalisasi, sanitasi dan sampah, penghijauan, serta akses air bersih."
        meta={[`${site.dates.label}`, site.district, `${site.participants} peserta`]}
      />

      <section className="section">
        <div className="wrap">
          <ProgramList programs={items} />
        </div>
      </section>

      <section className="section section--river" aria-labelledby="konstruksi">
        <div className="wrap">
          <div className="split">
            <div>
              <p className="eyebrow">Pekerjaan fisik</p>
              <h2 className="section-title" id="konstruksi">
                {construction.title}
              </h2>
              <p className="lede" style={{ marginTop: "1.25rem" }}>
                {construction.lead}
              </p>
              <ul className="l-items" style={{ marginTop: "1.75rem", borderColor: "var(--on-dark-line)" }}>
                {construction.items.map((c) => (
                  <li key={c.name} style={{ borderColor: "var(--on-dark-line)" }}>
                    <b style={{ color: "var(--paper)" }}>{c.name}</b>
                    <span style={{ color: "var(--on-dark)" }}>{c.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ display: "grid", gap: "1rem" }}>
              <figure className="figure">
                <img
                  src="/img/desain-tps.png"
                  alt="Gambar kerja TPS skala 1:50: tampak depan, tampak atas, dan tampak samping"
                  width={1298}
                  height={787}
                  loading="lazy"
                  style={{ background: "#fff" }}
                />
                <figcaption style={{ color: "var(--on-dark)" }}>
                  Gambar kerja TPS dari lampiran proposal. Dinding bata, empat kolom beton bertulang, cor semen
                  pada dasar. Skala 1:50.
                </figcaption>
              </figure>
              <figure className="figure">
                <img
                  src="/img/desain-plang-larangan.jpg"
                  alt="Desain plang larangan membuang sampah sembarangan"
                  width={736}
                  height={1030}
                  loading="lazy"
                />
                <figcaption style={{ color: "var(--on-dark)" }}>
                  Desain plang larangan membuang sampah sembarangan, dipasang bersama plang petunjuk arah.
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
        <TenunBand variant="dark" />
      </section>

      <section className="section" id="peta" aria-labelledby="peta-judul">
        <div className="wrap">
          <div className="split">
            <div>
              <p className="eyebrow">Peta lokasi</p>
              <h2 className="section-title" id="peta-judul">
                Titik kegiatan di Desa Batu Lintang.
              </h2>
              <p className="lede" style={{ marginTop: "1.25rem" }}>
                Program Geo-Digital Initiative menghasilkan peta wisata daerah dan pendampingan pemetaan bagi
                perangkat desa. Peta di samping adalah denah lokasi dari proposal, menjadi dasar titik kegiatan
                lapangan.
              </p>
              <dl className="hero__data" style={{ marginTop: "1.5rem", borderColor: "var(--line)" }}>
                <div style={{ borderColor: "var(--line)" }}>
                  <dt style={{ color: "var(--ink-soft)" }}>Koordinat</dt>
                  <dd style={{ color: "var(--ink)" }}>{site.coords.dms}</dd>
                </div>
                <div style={{ borderColor: "var(--line)" }}>
                  <dt style={{ color: "var(--ink-soft)" }}>Desa</dt>
                  <dd style={{ color: "var(--ink)" }}>
                    {site.village}, {site.district}
                  </dd>
                </div>
                <div style={{ borderColor: "var(--line)" }}>
                  <dt style={{ color: "var(--ink-soft)" }}>Desa kedua</dt>
                  <dd style={{ color: "var(--ink)" }}>Desa Sebindang, penyerahan alat pengolahan air</dd>
                </div>
              </dl>
              <a
                className="btn btn--ghost btn--sm"
                style={{ marginTop: "1.5rem" }}
                href={`https://www.openstreetmap.org/?mlat=${site.coords.lat}&mlon=${site.coords.lng}#map=14/${site.coords.lat}/${site.coords.lng}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Buka peta interaktif
              </a>
            </div>
            <figure className="figure">
              <img
                src="/img/peta-lokasi.jpg"
                alt="Peta denah lokasi kegiatan Desa Batu Lintang dengan legenda jalan, rumah warga, dan fasilitas"
                width={1402}
                height={988}
                loading="lazy"
              />
              <figcaption>
                Lampiran proposal: peta denah lokasi kegiatan, skala 1:1.000. Sumber basemap Google Earth Pro.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="section section--paper2" aria-labelledby="jadwal-judul">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Jadwal</p>
              <h2 className="section-title" id="jadwal-judul">
                Rundown resmi, 7 sampai 21 Januari 2027.
              </h2>
            </div>
            <p className="lede">
              Disusun dari rundown proposal. Waktu dapat bergeser mengikuti kondisi lapangan dan ketersediaan
              sinyal, tetapi urutan kegiatan mengikuti dokumen ini.
            </p>
          </div>
          <DayTimeline />
          <p className="small muted" style={{ marginTop: "1.5rem" }}>
            Ingin melihat dokumentasi harian? <Link className="textlink" href="/dokumentasi">Buka halaman dokumentasi</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
