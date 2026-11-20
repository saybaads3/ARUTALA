"use client";

import { useMemo, useState } from "react";
import type { Sponsor } from "@/lib/repo";
import { compactRupiah } from "@/lib/format";

type Props = { sponsors: Sponsor[] };

const tierList = ["Semua", "Buana", "Wana", "Tirta", "Donatur Reguler"] as const;

export default function SponsorBoard({ sponsors }: Props) {
  const [tier, setTier] = useState<(typeof tierList)[number]>("Semua");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    return sponsors
      .map((s) => ({
        ...s,
        tier:
          s.nominal_akumulasi > 5_000_000
            ? "Buana"
            : s.nominal_akumulasi >= 2_000_000
              ? "Wana"
              : s.nominal_akumulasi >= 750_000
                ? "Tirta"
                : "Donatur Reguler",
        nama: s.tampilkan_nama ? s.nama_sponsor : "Sahabat Lestari",
      }))
      .filter((s) => (tier === "Semua" ? true : s.tier === tier))
      .filter((s) => (query.trim() ? s.nama.toLowerCase().includes(query.trim().toLowerCase()) : true));
  }, [sponsors, tier, query]);

  if (sponsors.length === 0) {
    return (
      <div className="empty">
        <h3>Papan peringkat belum berisi data</h3>
        <p>
          Mitra yang sudah mengonfirmasi kerja sama akan tampil di sini, diurutkan otomatis dari nominal
          dukungan terbesar. Data diisi panitia lewat panel admin.
        </p>
        <p className="small" style={{ marginTop: ".75rem" }}>
          Ingin menjadi mitra pertama? Hubungi Bidang Usaha Dana lewat halaman tautan resmi.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="lb-controls">
        <div className="lb-search">
          <label className="sr-only" htmlFor="cari-sponsor">
            Cari nama mitra
          </label>
          <input
            id="cari-sponsor"
            className="input"
            placeholder="Cari nama mitra"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="lb-filters" role="group" aria-label="Filter tier">
          {tierList.map((t) => (
            <button key={t} type="button" className="chip" aria-pressed={tier === t} onClick={() => setTier(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="notice notice--plain">Tidak ada mitra yang cocok dengan filter ini.</p>
      ) : (
        <>
          <div className="lb-table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th scope="col">Peringkat</th>
                  <th scope="col">Mitra</th>
                  <th scope="col">Dukungan</th>
                  <th scope="col">Tier</th>
                  <th scope="col" className="num">
                    Nominal
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s, i) => (
                  <tr key={s.id}>
                    <td className="rank">{String(i + 1).padStart(2, "0")}</td>
                    <td>
                      {s.tautan_mitra ? (
                        <a className="textlink" href={s.tautan_mitra} target="_blank" rel="noopener noreferrer">
                          {s.nama}
                        </a>
                      ) : (
                        <span>{s.nama}</span>
                      )}
                    </td>
                    <td className="small muted">{s.jenis_dukungan}</td>
                    <td>
                      <span className="badge-tier" data-tier={s.tier}>
                        <i aria-hidden="true" />
                        {s.tier}
                      </span>
                    </td>
                    <td className="num">{compactRupiah(s.nominal_akumulasi)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lb-cards">
            {rows.map((s, i) => (
              <div className="lb-card" key={s.id}>
                <span className="rank">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <b>{s.nama}</b>
                  <small>
                    {s.jenis_dukungan} · {s.tier}
                  </small>
                </div>
                <span className="amount">{compactRupiah(s.nominal_akumulasi)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
