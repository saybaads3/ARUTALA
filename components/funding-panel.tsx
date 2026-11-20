import { funding } from "@/lib/content";
import { percentLabel, percent, rupiah } from "@/lib/format";

export default function FundingPanel() {
  const collected = funding.income;
  const p = percent(collected, funding.total);

  return (
    <div className="funding-grid">
      <div>
        <p className="eyebrow">Transparansi anggaran</p>
        <p className="small" style={{ color: "var(--on-dark)", margin: 0 }}>
          Kebutuhan anggaran
        </p>
        <p className="funding-amount">{rupiah(funding.total)}</p>

        <div className="progress" aria-hidden="true">
          <span style={{ ["--p" as string]: `${p}%` }} />
        </div>
        <div className="progress-legend">
          <span>Terkumpul {rupiah(collected)}</span>
          <span>{percentLabel(collected, funding.total)}</span>
        </div>

        <p className="small" style={{ color: "var(--on-dark)", marginTop: "1.5rem", maxWidth: "40ch" }}>
          {funding.incomeNote}. Sisanya, {rupiah(funding.gap)}, menjadi kebutuhan dukungan mitra dan donatur.
          Seluruh pos pengeluaran dibuka di halaman tentang.
        </p>
        <a className="btn btn--on-dark" href="/tentang#anggaran" style={{ marginTop: "1.5rem" }}>
          Lihat rincian anggaran
        </a>
      </div>

      <div>
        <p className="mono small" style={{ color: "var(--on-dark)", marginBottom: ".75rem", letterSpacing: ".08em" }}>
          KOMPOSISI PER KELOMPOK BELANJA
        </p>
        <div className="stack-bar" aria-hidden="true">
          {funding.groups.map((g) => (
            <span key={g.label} style={{ background: g.color, width: `${percent(g.amount, funding.total)}%` }} />
          ))}
        </div>
        {funding.groups.map((g) => (
          <div className="stack-row" key={g.label}>
            <i style={{ background: g.color }} aria-hidden="true" />
            <div>
              <b>{g.label}</b>
              <small>
                {g.note} · {percentLabel(g.amount, funding.total)}
              </small>
            </div>
            <em>{rupiah(g.amount)}</em>
          </div>
        ))}
      </div>
    </div>
  );
}
