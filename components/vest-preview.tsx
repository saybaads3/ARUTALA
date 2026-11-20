import { vestCapacity } from "@/lib/content";
import type { Sponsor } from "@/lib/repo";
import { compactRupiah } from "@/lib/format";

type Props = { sponsors: Sponsor[] };

// Simulasi urutan logo pada punggung rompi. Slot 1 adalah area VIP
// (2x2) untuk akumulasi nominal tertinggi, sisanya mengalir kiri atas
// ke kanan bawah sesuai aturan proposal.
export default function VestPreview({ sponsors }: Props) {
  const ordered = [...sponsors].sort((a, b) => b.nominal_akumulasi - a.nominal_akumulasi);
  const filled = ordered.slice(0, vestCapacity);
  const slots = Array.from({ length: vestCapacity }, (_, i) => filled[i] ?? null);

  return (
    <div className="vest-grid">
      <div>
        <div className="slots" role="img" aria-label={`Simulasi 40 slot logo pada rompi, ${filled.length} terisi`}>
          {slots.map((s, i) => (
            <div
              key={i}
              className={`slot ${i === 0 ? "slot--vip" : ""} ${s ? "slot--filled" : ""}`}
            >
              {s ? (s.tampilkan_nama ? s.nama_sponsor : "Sahabat Lestari") : String(i + 1).padStart(2, "0")}
            </div>
          ))}
        </div>
        <p className="small muted" style={{ marginTop: ".75rem" }}>
          {filled.length} dari {vestCapacity} slot terisi. Slot 01 ditandai sebagai area VIP, mengikuti kotak logo
          utama pada gambar kerja rompi di samping.
        </p>
      </div>

      <div>
        <figure className="figure">
          <img src="/img/rompi-belakang.jpg" alt="Gambar kerja punggung rompi panitia ARUTALA dengan kotak penempatan logo" width={727} height={520} loading="lazy" />
          <figcaption>
            Gambar kerja punggung rompi dari proposal: area merek, kotak logo utama, grid logo pendukung, dan
            koordinat lokasi di bagian bawah.
          </figcaption>
        </figure>

        <h3 className="display" style={{ fontSize: "1.25rem", margin: "1.5rem 0 .5rem" }}>
          Urutan slot saat ini
        </h3>
        {filled.length === 0 ? (
          <p className="small muted">
            Belum ada mitra terdaftar. Begitu data masuk, nama akan mengisi slot dari kiri atas ke kanan bawah
            otomatis.
          </p>
        ) : (
          <ol className="small" style={{ margin: 0, paddingLeft: "1.1rem", columns: 2, columnGap: "1.5rem" }}>
            {filled.map((s, i) => (
              <li key={s.id} style={{ breakInside: "avoid", marginBottom: ".3rem" }}>
                {s.tampilkan_nama ? s.nama_sponsor : "Sahabat Lestari"}{" "}
                <span className="mono muted">({compactRupiah(s.nominal_akumulasi)})</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
