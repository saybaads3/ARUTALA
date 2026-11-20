import Link from "next/link";
import TenunBand from "@/components/tenun-band";
import ProgramList from "@/components/program-list";
import FundingPanel from "@/components/funding-panel";
import { programs, site, tiers } from "@/lib/content";
import { listSponsors } from "@/lib/repo";
import { compactRupiah } from "@/lib/format";

export const revalidate = 300;

export default async function Home() {
  const sponsors = await listSponsors();
  const top = sponsors.slice(0, 3);

  return (
    <>
      <section className="hero">
        <svg className="hero__river" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
          <g fill="none" stroke="currentColor" strokeWidth="1.1">
            <path d="M-40 620C220 560 330 700 560 640S920 470 1160 540s280 30 340-10" />
            <path d="M-40 680C240 620 350 760 580 700s360-170 600-100 300 30 360-10" opacity=".6" />
            <path d="M-40 740C260 680 380 820 600 760s340-170 580-100 320 30 380-10" opacity=".3" />
          </g>
        </svg>

        <div className="wrap hero__inner">
          <div className="hero__top">
            <span>PMKM Arutala 2027</span>
            <span>{site.coords.dms}</span>
            <span>{site.dates.label}</span>
          </div>

          <h1 className="hero__title">Arutala</h1>
          <p className="hero__tagline">Menjejak bakti, menjaga lestari.</p>

          <div className="hero__grid">
            <p className="hero__desc">
              <strong>38 mahasiswa Teknik Lingkungan Universitas Tanjungpura</strong> bekerja selama 15 hari di
              Dusun Sungai Utik, Desa Batu Lintang, Kapuas Hulu. Empat program: pemetaan digital desa, edukasi
              lingkungan, penghijauan, dan penyediaan alat pengolahan air.
            </p>

            <dl className="hero__data">
              <div>
                <dt>Lokasi</dt>
                <dd>
                  {site.village}, {site.district}
                  <br />
                  {site.regency}, {site.province}
                </dd>
              </div>
              <div>
                <dt>Waktu</dt>
                <dd>{site.dates.label}</dd>
              </div>
              <div>
                <dt>Peserta</dt>
                <dd>
                  {site.participants} mahasiswa, {site.committeeFields} bidang kepanitiaan
                </dd>
              </div>
              <div>
                <dt>Program</dt>
                <dd>{site.programCount} program kerja, 4 divisi</dd>
              </div>
            </dl>
          </div>

          <div className="hero__actions">
            <Link className="btn btn--primary" href="/sponsor#paket">
              Lihat paket sponsor
            </Link>
            <a className="btn btn--on-dark" href={site.proposalPath} rel="noopener">
              Unduh proposal PDF
            </a>
            <Link className="btn btn--on-dark" href="/program">
              Empat program kerja
            </Link>
          </div>
        </div>
        <TenunBand variant="dark" />
      </section>

      <section className="section--tight">
        <div className="wrap">
          <div className="stats">
            <div className="stat">
              <b>38</b>
              <span>Mahasiswa peserta</span>
            </div>
            <div className="stat">
              <b>15</b>
              <span>Hari di lapangan</span>
            </div>
            <div className="stat">
              <b>04</b>
              <span>Program kerja</span>
            </div>
            <div className="stat">
              <b>02</b>
              <span>Desa binaan</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="lokasi-judul">
        <div className="wrap">
          <div className="split">
            <div data-reveal>
              <p className="eyebrow">Lokasi kegiatan</p>
              <h2 className="section-title" id="lokasi-judul">
                Hulu Kapuas, di jalan menuju Betung Kerihun.
              </h2>
              <div className="prose" style={{ marginTop: "1.5rem" }}>
                <p>
                  Desa Batu Lintang berada di Kecamatan Embaloh Hulu, Kabupaten Kapuas Hulu. Dusun Sungai Utik di
                  dalamnya dikenal karena Rumah Betang dan pengelolaan hutan adat yang dijaga turun temurun.
                </p>
                <p>
                  Jarak dari Pontianak menempuh jalur darat lintas Kalimantan Barat, dengan bus perintis sebagai
                  moda utama. Perjalanan ini menjadi bagian dari kebutuhan anggaran terbesar dalam proposal.
                </p>
                <p>
                  Tiga persoalan yang dijawab program: data ruang desa yang belum terdigitalisasi, kesadaran
                  pengelolaan sampah dan sanitasi, serta akses air bersih di Desa Sebindang.
                </p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".75rem", marginTop: "1.75rem" }}>
                <a
                  className="btn btn--ghost btn--sm"
                  href={`https://www.openstreetmap.org/?mlat=${site.coords.lat}&mlon=${site.coords.lng}#map=13/${site.coords.lat}/${site.coords.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buka di OpenStreetMap
                </a>
                <span className="mono small muted" style={{ alignSelf: "center" }}>
                  {site.coords.dms}
                </span>
              </div>
            </div>

            <figure className="figure" data-reveal>
              <img
                src="/img/peta-lokasi.jpg"
                alt="Peta denah lokasi kegiatan di Desa Batu Lintang, Kecamatan Embaloh Hulu, Kabupaten Kapuas Hulu"
                width={1402}
                height={988}
                loading="lazy"
              />
              <figcaption>
                Peta denah lokasi kegiatan, lampiran proposal. Basemap Google Earth Pro, skala 1:1.000, dengan
                legenda jalan, rumah warga, lahan, pekarangan, posyandu, dan rumah ibadah.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="section section--paper2" aria-labelledby="program-judul">
        <div className="wrap">
          <div className="section-head">
            <div data-reveal>
              <p className="eyebrow">Program kerja</p>
              <h2 className="section-title" id="program-judul">
                Empat program, satu arah: desa yang mandiri.
              </h2>
            </div>
            <p className="lede" data-reveal>
              Setiap program punya indikator keberhasilan yang bisa diperiksa, bukan hanya dokumentasi seremonial.
              Buka tiap baris untuk membaca rincian kegiatan.
            </p>
          </div>

          <ProgramList programs={programs.slice(0, 4)} compact />

          <div style={{ marginTop: "1.75rem" }}>
            <Link className="textlink" href="/program">
              Rincian lengkap dan jadwal 15 hari
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--river" aria-labelledby="anggaran-judul">
        <div className="wrap">
          <h2 className="sr-only" id="anggaran-judul">
            Transparansi anggaran
          </h2>
          <FundingPanel />
        </div>
      </section>

      <section className="section" aria-labelledby="paket-judul">
        <div className="wrap">
          <div className="split">
            <div data-reveal>
              <p className="eyebrow">Kemitraan</p>
              <h2 className="section-title" id="paket-judul">
                Empat tingkat dukungan, satu aturan tata letak yang adil.
              </h2>
              <p className="lede" style={{ marginTop: "1.25rem" }}>
                Posisi dan ukuran logo ditentukan oleh akumulasi nominal dukungan. Sponsor terbesar mendapat slot
                terbesar pada rompi panitia, sisanya berurutan dari kiri atas ke kanan bawah.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".75rem", marginTop: "1.75rem" }}>
                <Link className="btn btn--primary" href="/sponsor#paket">
                  Baca paket dan fasilitas
                </Link>
                <Link className="btn btn--ghost" href="/sponsor#adopsi">
                  Adopsi pos kebutuhan
                </Link>
              </div>
            </div>

            <div className="tier-list" data-reveal>
              {tiers.map((t) => (
                <div className={`tier tier--${t.name.toLowerCase().replace(/\s+/g, "-")}`} key={t.name}>
                  <div>
                    <span className="tier__name">
                      <i className="tier__dot" aria-hidden="true" />
                      {t.name}
                    </span>
                    <span className="tier__range">{t.range}</span>
                  </div>
                  <p className="tier__fac">{t.facilities.slice(0, 4).join(", ")}.</p>
                  <span className="tier__count">{t.facilities.length} fasilitas</span>
                </div>
              ))}
            </div>
          </div>

          {top.length > 0 && (
            <div style={{ marginTop: "3rem" }}>
              <p className="eyebrow">Pendukung teratas</p>
              <div className="card-grid">
                {top.map((s, i) => (
                  <div className="card" key={s.id}>
                    <p className="mono small muted" style={{ margin: 0 }}>
                      Peringkat {i + 1}
                    </p>
                    <p className="display" style={{ fontSize: "1.35rem", margin: ".35rem 0" }}>
                      {s.tampilkan_nama ? s.nama_sponsor : "Sahabat Lestari"}
                    </p>
                    <p className="mono small" style={{ margin: 0 }}>
                      {compactRupiah(s.nominal_akumulasi)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section section--paper2" aria-labelledby="dok-judul">
        <div className="wrap">
          <div className="split">
            <div data-reveal>
              <p className="eyebrow">Dokumentasi</p>
              <h2 className="section-title" id="dok-judul">
                Arsip lapangan dibuka setelah ekspedisi.
              </h2>
              <p className="lede" style={{ marginTop: "1.25rem" }}>
                Foto dan catatan harian diunggah selama 7 sampai 21 Januari 2027, saat sinyal lapangan
                memungkinkan. Sampai saat itu, halaman dokumentasi hanya memuat jadwal resmi.
              </p>
              <Link className="textlink" href="/dokumentasi" style={{ marginTop: "1.5rem" }}>
                Lihat jadwal dan rencana dokumentasi
              </Link>
            </div>

            <div className="frame-grid" data-reveal>
              <div className="frame">
                <span>Foto lapangan menyusul</span>
                <figcaption>Pra-ekspedisi</figcaption>
              </div>
              <div className="frame">
                <span>Foto lapangan menyusul</span>
                <figcaption>7 sampai 21 Jan 2027</figcaption>
              </div>
              <div className="frame">
                <span>Foto lapangan menyusul</span>
                <figcaption>Laporan dampak</figcaption>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="wrap">
          <TenunBand />
          <div className="cta-row">
            <p className="display" style={{ fontSize: "clamp(1.5rem,1rem+2vw,2.25rem)", margin: 0 }}>
              Dukung ARUTALA 2027 sebelum keberangkatan 7 Januari.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".6rem" }}>
              <Link className="btn btn--dark" href="/sponsor#paket">
                Jadi mitra
              </Link>
              <a className="btn btn--ghost" href={`https://wa.me/${site.whatsapp}`} rel="noopener">
                Hubungi panitia
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
