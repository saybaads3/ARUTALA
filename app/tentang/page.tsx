import Link from "next/link";
import PageHead from "@/components/page-head";
import TenunBand from "@/components/tenun-band";
import { funding, panitia, site } from "@/lib/content";
import { percentLabel, rupiah } from "@/lib/format";

export const metadata = {
  title: "Tentang dan anggaran",
  description:
    "Susunan 38 panitia PMKM ARUTALA 2027, rekapitulasi anggaran Rp 106.352.644, dan unduhan proposal kegiatan.",
  alternates: { canonical: "/tentang" },
};

const totalPeople =
  panitia.inti.length + panitia.fields.reduce((n, f) => n + f.members.length, 0);

export default function TentangPage() {
  return (
    <>
      <PageHead
        eyebrow="Tentang"
        title="Siapa yang berangkat, dan ke mana uangnya pergi."
        lede="Program ini dijalankan 38 mahasiswa Jurusan Teknik Lingkungan, Fakultas Teknik, Universitas Tanjungpura, terbagi dalam 7 bidang kepanitiaan dan 4 divisi program kerja."
        meta={[`${totalPeople} mahasiswa`, `${panitia.fields.length} bidang`, `${panitia.divisions.length} divisi`]}
      />

      <section className="section" aria-labelledby="inti">
        <div className="wrap">
          <div className="split">
            <div>
              <p className="eyebrow">Pimpinan panitia</p>
              <h2 className="section-title" id="inti">
                Penanggung jawab kegiatan.
              </h2>
              <p className="lede" style={{ marginTop: "1.25rem" }}>
                Nama di bawah tercantum pada susunan kepanitiaan di proposal. NIM tidak ditampilkan untuk menjaga
                data pribadi.
              </p>
              <div style={{ marginTop: "1.75rem", borderTop: "1px solid var(--line-strong)" }}>
                {panitia.inti.map((p) => (
                  <div
                    key={p.name}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "1rem",
                      padding: ".7rem 0",
                      borderBottom: "1px solid var(--line)",
                    }}
                  >
                    <span className="mono small muted">{p.role}</span>
                    <span style={{ fontWeight: 600, textAlign: "right" }}>{p.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="eyebrow">Divisi program kerja</p>
              <div className="card-grid" style={{ gridTemplateColumns: "repeat(2,minmax(0,1fr))" }}>
                {panitia.divisions.map((d) => (
                  <div className="card" key={d.name}>
                    <p className="mono small muted" style={{ margin: 0 }}>
                      {d.size} orang
                    </p>
                    <h3 className="display" style={{ fontSize: "1.25rem", margin: ".25rem 0 .35rem" }}>
                      {d.name}
                    </h3>
                    <p className="small muted" style={{ margin: 0 }}>
                      {d.work}
                    </p>
                  </div>
                ))}
              </div>
              <p className="small muted" style={{ marginTop: "1rem" }}>
                Satu orang dapat tergabung pada lebih dari satu divisi, sehingga jumlah keanggotaan divisi tidak
                sama dengan jumlah peserta.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--paper2" aria-labelledby="bidang">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Struktur</p>
              <h2 className="section-title" id="bidang">
                Tujuh bidang kepanitiaan.
              </h2>
            </div>
            <p className="lede">
              Susunan diambil dari proposal. Nama ditulis apa adanya, tanpa gelar tambahan.
            </p>
          </div>

          <div style={{ borderTop: "1px solid var(--line-strong)" }}>
            {panitia.fields.map((f) => (
              <div
                key={f.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(160px,220px) minmax(0,1fr)",
                  gap: "1rem",
                  padding: "1rem 0",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                <div>
                  <b style={{ display: "block" }}>{f.name}</b>
                  <span className="mono small muted">{f.members.length} orang</span>
                </div>
                <p className="small" style={{ margin: 0, color: "var(--ink-soft)" }}>
                  {f.members.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="anggaran" aria-labelledby="anggaran-judul">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Anggaran</p>
              <h2 className="section-title" id="anggaran-judul">
                Rekapitulasi pengeluaran.
              </h2>
            </div>
            <p className="lede">
              Seluruh angka diambil dari rincian anggaran biaya pada proposal. Total pengeluaran{" "}
              {rupiah(funding.total)}, dengan pemasukan awal {rupiah(funding.income)} dari iuran panitia.
            </p>
          </div>

          <div className="tbl-scroll">
            <table className="tbl" style={{ minWidth: "560px" }}>
              <thead>
                <tr>
                  <th scope="col">Pos</th>
                  <th scope="col">Keterangan</th>
                  <th scope="col" className="num">
                    Jumlah
                  </th>
                  <th scope="col" className="num">
                    Porsi
                  </th>
                </tr>
              </thead>
              <tbody>
                {funding.rows.map((r) => (
                  <tr key={r.bidang}>
                    <td>{r.bidang}</td>
                    <td className="small muted">{r.note}</td>
                    <td className="num">{rupiah(r.amount)}</td>
                    <td className="num muted">{percentLabel(r.amount, funding.total)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2}>Total pengeluaran</td>
                  <td className="num">{rupiah(funding.total)}</td>
                  <td className="num">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="card-grid" style={{ marginTop: "1.5rem" }}>
            <div className="card">
              <span className="mono small muted">Pemasukan awal</span>
              <p className="display" style={{ fontSize: "1.5rem", margin: ".3rem 0" }}>
                {rupiah(funding.income)}
              </p>
              <p className="small muted" style={{ margin: 0 }}>
                {funding.incomeNote}
              </p>
            </div>
            <div className="card">
              <span className="mono small muted">Kebutuhan dukungan</span>
              <p className="display" style={{ fontSize: "1.5rem", margin: ".3rem 0" }}>
                {rupiah(funding.gap)}
              </p>
              <p className="small muted" style={{ margin: 0 }}>
                Selisih antara pengeluaran dan pemasukan awal
              </p>
            </div>
            <div className="card">
              <span className="mono small muted">Dokumen sumber</span>
              <p className="display" style={{ fontSize: "1.5rem", margin: ".3rem 0" }}>
                Proposal
              </p>
              <p className="small muted" style={{ margin: 0 }}>
                <a className="textlink" href={site.proposalPath} rel="noopener">
                  Unduh PDF 31 halaman
                </a>
              </p>
            </div>
          </div>

          <p className="small muted" style={{ marginTop: "1.25rem", maxWidth: "72ch" }}>
            Catatan: halaman ini menampilkan angka sebagaimana tertulis pada proposal. Jika ada revisi anggaran,
            perbarui angka di berkas data agar tabel, progres, dan grafik ikut berubah.
          </p>
        </div>
        <TenunBand />
      </section>

      <section className="section section--tight" aria-labelledby="identitas">
        <div className="wrap">
          <div className="split">
            <div>
              <p className="eyebrow">Identitas program</p>
              <h2 className="section-title" id="identitas">
                {site.organizer}
              </h2>
              <p className="lede" style={{ marginTop: "1.25rem" }}>
                Lokasi: {site.village} ({site.hamlet}), {site.district}, {site.regency}, {site.province}.
                Koordinat {site.coords.dms}.
              </p>
            </div>
            <div className="notice">
              <b>Kontak resmi.</b> {site.email} · WhatsApp {site.whatsappLabel}. Untuk kerja sama sponsor,
              gunakan kanal yang sama agar tercatat oleh Bidang Usaha Dana.
              <div style={{ marginTop: ".9rem", display: "flex", flexWrap: "wrap", gap: ".5rem" }}>
                <Link className="btn btn--ghost btn--sm" href="/sponsor#paket">
                  Paket sponsor
                </Link>
                <Link className="btn btn--ghost btn--sm" href="/links">
                  Tautan resmi
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
