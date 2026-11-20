import Link from "next/link";
import PageHead from "@/components/page-head";
import SponsorBoard from "@/components/sponsor-board";
import VestPreview from "@/components/vest-preview";
import TenunBand from "@/components/tenun-band";
import { adoption, facilityMatrix, logoRule, site, tiers } from "@/lib/content";
import { listSponsors } from "@/lib/repo";
import { rupiah } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sponsor dan mitra",
  description:
    "Papan peringkat mitra, aturan tata letak logo pada rompi panitia, paket fasilitas Buana, Wana, Tirta, dan Donatur Reguler, serta pos kebutuhan yang bisa diadopsi.",
  alternates: { canonical: "/sponsor" },
};

export default async function SponsorPage() {
  const sponsors = await listSponsors();

  return (
    <>
      <PageHead
        eyebrow="Kemitraan"
        title="Dukungan yang tercatat terbuka."
        lede="Setiap dukungan, baik dana, barang, jasa, maupun konsumsi, dikonversi ke nominal dan diurutkan otomatis. Posisi logo mengikuti akumulasi nilai, bukan kedekatan dengan panitia."
        meta={[`${sponsors.length} mitra terdaftar`, "4 tingkat dukungan", site.district]}
      />

      <section className="section" aria-labelledby="papan">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Papan peringkat</p>
              <h2 className="section-title" id="papan">
                Peringkat mitra.
              </h2>
            </div>
            <p className="lede">
              Diurutkan dari akumulasi nominal terbesar. Tier dihitung dari ambang proposal, bukan dipilih manual.
              Nama dapat ditampilkan sebagai anonim atas permintaan mitra.
            </p>
          </div>

          <SponsorBoard sponsors={sponsors} />

          <div className="notice notice--plain" style={{ marginTop: "1.5rem" }}>
            <b>Cara data masuk.</b> Panitia mencatat dukungan di panel admin. Situs membaca data yang sama, jadi
            papan peringkat dan simulasi rompi selalu sinkron tanpa mengedit kode.
          </div>
        </div>
      </section>

      <section className="section section--paper2" aria-labelledby="rompi">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Simulasi rompi</p>
              <h2 className="section-title" id="rompi">
                40 slot logo, satu aturan urutan.
              </h2>
            </div>
            <p className="lede">{logoRule}</p>
          </div>
          <VestPreview sponsors={sponsors} />
        </div>
      </section>

      <section className="section" id="paket" aria-labelledby="paket-judul">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Paket dukungan</p>
              <h2 className="section-title" id="paket-judul">
                Fasilitas per tingkat.
              </h2>
            </div>
            <p className="lede">
              Ambang mengikuti tabel feedback sponsor pada proposal. Nilai barang dan jasa dikonversi ke Rupiah
              berdasarkan harga pasar untuk menentukan tingkat.
            </p>
          </div>

          <div className="tier-list">
            {tiers.map((t) => (
              <div className={`tier tier--${t.name.toLowerCase().replace(/\s+/g, "-")}`} key={t.name}>
                <div>
                  <span className="tier__name">
                    <i className="tier__dot" aria-hidden="true" />
                    {t.name}
                  </span>
                  <span className="tier__range">{t.range}</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "var(--ink-soft)", fontSize: ".875rem" }}>
                  {t.facilities.map((f) => (
                    <li key={f} style={{ marginBottom: ".2rem" }}>
                      {f}
                    </li>
                  ))}
                </ul>
                <span className="tier__count">{t.facilities.length} fasilitas</span>
              </div>
            ))}
          </div>

          <h3 className="display" style={{ fontSize: "1.35rem", margin: "3rem 0 1rem" }}>
            Matriks fasilitas
          </h3>
          <div className="tbl-scroll">
            <table className="tbl" style={{ minWidth: "620px" }}>
              <caption className="sr-only">Fasilitas yang diterima setiap tingkat sponsor</caption>
              <thead>
                <tr>
                  <th scope="col">Fasilitas</th>
                  <th scope="col" className="check">Buana</th>
                  <th scope="col" className="check">Wana</th>
                  <th scope="col" className="check">Tirta</th>
                  <th scope="col" className="check">Reguler</th>
                </tr>
              </thead>
              <tbody>
                {facilityMatrix.map((row) => (
                  <tr key={row.label}>
                    <th scope="row" style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0, fontFamily: "inherit", fontSize: ".9375rem", color: "var(--ink)" }}>
                      {row.label}
                    </th>
                    <td className={row.buana ? "check" : "dash"}>{row.buana ? "Ada" : "Tidak"}</td>
                    <td className={row.wana ? "check" : "dash"}>{row.wana ? "Ada" : "Tidak"}</td>
                    <td className={row.tirta ? "check" : "dash"}>{row.tirta ? "Ada" : "Tidak"}</td>
                    <td className={row.reguler ? "check" : "dash"}>{row.reguler ? "Ada" : "Tidak"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="small muted" style={{ marginTop: ".75rem" }}>
            Tanda "Ada" berarti fasilitas tercantum untuk tingkat tersebut pada proposal. Teks lengkap ada di
            dokumen proposal bagian feedback sponsor.
          </p>
        </div>
      </section>

      <section className="section section--river" id="adopsi" aria-labelledby="adopsi-judul">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Adopsi pos</p>
              <h2 className="section-title" id="adopsi-judul">
                Dukung satu pos, bukan seluruh anggaran.
              </h2>
            </div>
            <p className="lede">
              Beberapa pos punya nilai yang jelas dan dampak langsung. Mitra dapat menutup satu pos tanpa harus
              masuk paket sponsor utama, dan tetap mendapat apresiasi sesuai nilai kontribusi.
            </p>
          </div>

          <div className="tbl-scroll">
            <table className="tbl" style={{ minWidth: "560px" }}>
              <thead>
                <tr>
                  <th scope="col">Pos kebutuhan</th>
                  <th scope="col">Keterangan</th>
                  <th scope="col" className="num">Nilai</th>
                </tr>
              </thead>
              <tbody>
                {adoption.map((a) => (
                  <tr key={a.name}>
                    <td style={{ color: "var(--paper)" }}>{a.name}</td>
                    <td className="small" style={{ color: "var(--on-dark)" }}>
                      {a.detail}
                    </td>
                    <td className="num" style={{ color: "var(--paper)" }}>
                      {rupiah(a.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: ".75rem", marginTop: "1.75rem" }}>
            <a className="btn btn--primary" href={`https://wa.me/${site.whatsapp}`} rel="noopener">
              Hubungi Bidang Usaha Dana
            </a>
            <a className="btn btn--on-dark" href={`mailto:${site.email}`}>
              Kirim surat kerja sama
            </a>
            <Link className="btn btn--on-dark" href="/links">
              Semua kanal resmi
            </Link>
          </div>
        </div>
        <TenunBand variant="dark" />
      </section>
    </>
  );
}
