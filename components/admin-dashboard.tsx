"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { rupiah } from "@/lib/format";

type Tab = "ringkasan" | "sponsors" | "produk" | "pesanan" | "programs" | "dokumentasi";
type Row = Record<string, unknown>;

type Field = {
  key: string;
  label: string;
  type: "text" | "number" | "textarea" | "select" | "checkbox" | "date";
  options?: string[];
  required?: boolean;
  half?: boolean;
  placeholder?: string;
};

const TABS: { id: Tab; label: string }[] = [
  { id: "ringkasan", label: "Ringkasan" },
  { id: "sponsors", label: "Sponsor" },
  { id: "produk", label: "Produk" },
  { id: "pesanan", label: "Pesanan" },
  { id: "programs", label: "Program" },
  { id: "dokumentasi", label: "Dokumentasi" },
];

const FIELDS: Record<Exclude<Tab, "ringkasan" | "pesanan">, Field[]> = {
  sponsors: [
    { key: "nama_sponsor", label: "Nama sponsor", type: "text", required: true },
    { key: "jenis_dukungan", label: "Jenis dukungan", type: "select", options: ["Dana", "Barang", "Jasa", "Konsumsi"], half: true },
    { key: "nominal_akumulasi", label: "Nominal (Rp)", type: "number", required: true, half: true },
    { key: "tanggal_masuk", label: "Tanggal masuk", type: "date", half: true },
    { key: "logo_url", label: "URL logo", type: "text", half: true, placeholder: "/img/sponsor/nama.svg" },
    { key: "tautan_mitra", label: "Tautan mitra", type: "text", placeholder: "https://instagram.com/..." },
    { key: "tampilkan_nama", label: "Tampilkan nama (matikan untuk anonim)", type: "checkbox" },
  ],
  produk: [
    { key: "nama", label: "Nama produk", type: "text", required: true },
    { key: "kategori", label: "Kategori", type: "text", half: true },
    { key: "slug", label: "Slug URL (opsional)", type: "text", half: true, placeholder: "otomatis dari nama" },
    { key: "harga", label: "Harga (Rp)", type: "number", required: true, half: true },
    { key: "stok", label: "Stok", type: "number", required: true, half: true },
    { key: "gambar_url", label: "URL gambar", type: "text" },
    { key: "deskripsi", label: "Deskripsi", type: "textarea" },
    { key: "aktif", label: "Tampilkan di katalog", type: "checkbox" },
  ],
  programs: [
    { key: "no", label: "Nomor urut", type: "text", required: true, half: true },
    { key: "slug", label: "Slug", type: "text", required: true, half: true },
    { key: "title", label: "Judul program", type: "text", required: true },
    { key: "faction", label: "Divisi", type: "text", half: true },
    { key: "lead", label: "Ringkasan satu baris", type: "text", required: true },
    { key: "body", label: "Uraian", type: "textarea" },
    { key: "output", label: "Indikator keberhasilan", type: "text" },
    { key: "publikasi", label: "Tampilkan di situs", type: "checkbox" },
  ],
  dokumentasi: [
    { key: "tanggal", label: "Tanggal", type: "date", required: true, half: true },
    { key: "fase", label: "Fase", type: "select", options: ["Pra", "Lapangan", "Pasca"], half: true },
    { key: "judul", label: "Judul catatan", type: "text", required: true },
    { key: "keterangan", label: "Keterangan", type: "textarea" },
    { key: "program_slug", label: "Terkait program", type: "text", half: true, placeholder: "geo-digital" },
    { key: "gambar_url", label: "URL gambar", type: "text", half: true },
    { key: "tampil", label: "Tampilkan di halaman dokumentasi", type: "checkbox" },
  ],
};

const DEFAULTS: Record<string, Row> = {
  sponsors: { nama_sponsor: "", jenis_dukungan: "Dana", nominal_akumulasi: 0, tanggal_masuk: "", logo_url: "", tautan_mitra: "", tampilkan_nama: true },
  produk: { nama: "", kategori: "", slug: "", harga: 0, stok: 0, gambar_url: "", deskripsi: "", aktif: true },
  programs: { no: "05", slug: "", title: "", faction: "", lead: "", body: "", output: "", publikasi: true },
  dokumentasi: { tanggal: "", fase: "Lapangan", judul: "", keterangan: "", program_slug: "", gambar_url: "", tampil: true },
};

export default function AdminDashboard({ email }: { email: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("ringkasan");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [form, setForm] = useState<Row>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [counts, setCounts] = useState({ sponsors: 0, produk: 0, pesanan: 0, omzet: 0 });

  const load = useCallback(
    async (which: Tab) => {
      if (which === "ringkasan") {
        setLoading(true);
        try {
          const [s, p, o] = await Promise.all([
            fetch("/api/admin/sponsors").then((r) => r.json()),
            fetch("/api/admin/produk").then((r) => r.json()),
            fetch("/api/admin/pesanan").then((r) => r.json()),
          ]);
          const orders: Row[] = o.data ?? [];
          setCounts({
            sponsors: (s.data ?? []).length,
            produk: (p.data ?? []).length,
            pesanan: orders.length,
            omzet: orders
              .filter((r) => r.status !== "batal")
              .reduce((n: number, r) => n + (Number(r.total) || 0), 0),
          });
        } finally {
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/${which}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Gagal memuat data.");
          setRows([]);
        } else {
          setRows(data.data ?? []);
        }
      } catch {
        setError("Tidak dapat menghubungi server.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void load(tab);
  }, [tab, load]);

  const reset = () => {
    setEditingId(null);
    setForm(tab in DEFAULTS ? { ...DEFAULTS[tab] } : {});
  };

  const startEdit = (row: Row) => {
    setEditingId(String(row.id));
    const next: Row = {};
    for (const f of FIELDS[tab as keyof typeof FIELDS]) next[f.key] = row[f.key] ?? "";
    setForm(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    const endpoint = `/api/admin/${tab}`;
    const payload = editingId ? { id: editingId, ...form } : form;
    const res = await fetch(endpoint, {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Gagal menyimpan.");
      return;
    }
    setNotice(editingId ? "Perubahan disimpan." : "Data baru ditambahkan.");
    reset();
    void load(tab);
  };

  const remove = async (id: string) => {
    if (!window.confirm("Hapus data ini? Tindakan tidak bisa dibatalkan.")) return;
    const res = await fetch(`/api/admin/${tab}?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Gagal menghapus.");
      return;
    }
    setNotice("Data dihapus.");
    void load(tab);
  };

  const setStatus = async (id: string, status: string) => {
    const res = await fetch("/api/admin/pesanan", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Gagal mengubah status.");
      return;
    }
    void load("pesanan");
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  const fields = tab === "ringkasan" || tab === "pesanan" ? [] : FIELDS[tab];

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <p className="mono small" style={{ padding: "0 .6rem .75rem", color: "var(--ink-soft)" }}>
          ARUTALA ADMIN
        </p>
        {TABS.map((t) => (
          <button key={t.id} type="button" aria-current={tab === t.id} onClick={() => { setTab(t.id); reset(); }}>
            {t.label}
          </button>
        ))}
        <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
          <a href="/" target="_blank" rel="noopener">
            Lihat situs
          </a>
          <button type="button" onClick={logout}>
            Keluar
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-top">
          <h1>{TABS.find((t) => t.id === tab)?.label}</h1>
          <span className="mono small muted">{email}</span>
        </div>

        {error && (
          <p className="notice" role="alert" style={{ marginBottom: "1rem" }}>
            {error}
          </p>
        )}
        {notice && (
          <p className="notice notice--plain" role="status" style={{ marginBottom: "1rem" }}>
            {notice}
          </p>
        )}

        {tab === "ringkasan" && (
          <>
            <div className="admin-kpi">
              <div className="card">
                <b>{counts.sponsors}</b>
                <span>Mitra</span>
              </div>
              <div className="card">
                <b>{counts.produk}</b>
                <span>Produk</span>
              </div>
              <div className="card">
                <b>{counts.pesanan}</b>
                <span>Pesanan</span>
              </div>
              <div className="card">
                <b style={{ fontSize: "1.4rem" }}>{rupiah(counts.omzet)}</b>
                <span>Nilai pesanan aktif</span>
              </div>
            </div>
            {loading && <p className="small muted">Memuat ringkasan...</p>}
            <div className="notice">
              <b>Alur kerja.</b> Tambahkan sponsor di tab Sponsor agar papan peringkat dan simulasi rompi ikut
              berubah. Produk yang ditambahkan di tab Produk langsung muncul di katalog merch.
            </div>
          </>
        )}

        {tab === "pesanan" && (
          <>
            {loading ? (
              <p className="small muted">Memuat pesanan...</p>
            ) : rows.length === 0 ? (
              <div className="empty">
                <h3>Belum ada pesanan</h3>
                <p>Pesanan dari halaman keranjang akan muncul di sini.</p>
              </div>
            ) : (
              <div className="admin-rows">
                {rows.map((r) => (
                  <div className="admin-row" key={String(r.id)}>
                    <div className="admin-row__main">
                      <b>
                        {String(r.kode)} · {String(r.nama)}
                      </b>
                      <small>
                        {String(r.whatsapp)} · {rupiah(Number(r.total))} ·{" "}
                        {new Date(String(r.created_at)).toLocaleString("id-ID")}
                      </small>
                      <small style={{ display: "block", marginTop: ".2rem" }}>
                        {(r.items as { nama: string; qty: number }[] | undefined)
                          ?.map((i) => `${i.nama} x${i.qty}`)
                          .join(", ")}
                        {r.alamat ? ` · ${String(r.alamat)}` : ""}
                      </small>
                    </div>
                    <div className="admin-actions">
                      <select
                        className="select"
                        value={String(r.status)}
                        aria-label={`Status pesanan ${String(r.kode)}`}
                        onChange={(e) => setStatus(String(r.id), e.target.value)}
                        style={{ width: "auto" }}
                      >
                        <option value="baru">Baru</option>
                        <option value="dikonfirmasi">Dikonfirmasi</option>
                        <option value="dikirim">Dikirim</option>
                        <option value="selesai">Selesai</option>
                        <option value="batal">Batal</option>
                      </select>
                      <a
                        className="btn btn--ghost btn--sm"
                        href={`https://wa.me/${String(r.whatsapp).replace(/^0/, "62")}`}
                        target="_blank"
                        rel="noopener"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {fields.length > 0 && (
          <section className="admin-section">
            <h2 className="display" style={{ fontSize: "1.3rem", margin: "0 0 .75rem" }}>
              {editingId ? "Ubah data" : "Tambah data"}
            </h2>
            <form className="card" onSubmit={save}>
              <div className="form-grid">
                {fields.map((f) => (
                  <label className="field" key={f.key} style={f.half ? undefined : { gridColumn: "1 / -1" }}>
                    <span className="label">{f.label}</span>
                    {f.type === "textarea" ? (
                      <textarea
                        className="textarea"
                        value={String(form[f.key] ?? "")}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      />
                    ) : f.type === "select" ? (
                      <select
                        className="select"
                        value={String(form[f.key] ?? "")}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      >
                        {f.options?.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    ) : f.type === "checkbox" ? (
                      <input
                        type="checkbox"
                        checked={Boolean(form[f.key])}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.checked })}
                        style={{ width: 20, height: 20 }}
                      />
                    ) : (
                      <input
                        className="input"
                        type={f.type}
                        required={f.required}
                        placeholder={f.placeholder}
                        value={String(form[f.key] ?? "")}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value,
                          })
                        }
                      />
                    )}
                  </label>
                ))}
              </div>
              <div style={{ display: "flex", gap: ".6rem", marginTop: ".5rem" }}>
                <button className="btn btn--primary" type="submit">
                  {editingId ? "Simpan perubahan" : "Tambah"}
                </button>
                {editingId && (
                  <button className="btn btn--ghost" type="button" onClick={reset}>
                    Batal
                  </button>
                )}
              </div>
            </form>
          </section>
        )}

        {tab !== "ringkasan" && (
          <section className="admin-section">
            <h2 className="display" style={{ fontSize: "1.3rem", margin: "0 0 .75rem" }}>
              Daftar {TABS.find((t) => t.id === tab)?.label}
            </h2>
            {loading ? (
              <p className="small muted">Memuat data...</p>
            ) : rows.length === 0 ? (
              <p className="notice notice--plain">Belum ada data. Tambahkan lewat formulir di atas.</p>
            ) : (
              <div className="admin-rows">
                {rows.map((r) => (
                  <div className="admin-row" key={String(r.id)}>
                    <div className="admin-row__main">
                      <b>
                        {String(
                          r.nama_sponsor ??
                            r.nama ??
                            r.title ??
                            r.judul ??
                            r.kode ??
                            r.slug ??
                            "Tanpa nama",
                        )}
                      </b>
                      <small>
                        {tab === "sponsors" &&
                          `${String(r.jenis_dukungan)} · ${rupiah(Number(r.nominal_akumulasi))} · ${
                            r.tampilkan_nama ? "nama tampil" : "anonim"
                          }`}
                        {tab === "produk" && `${rupiah(Number(r.harga))} · stok ${String(r.stok)} · ${r.aktif ? "aktif" : "nonaktif"}`}
                        {tab === "programs" && `${String(r.slug)} · ${r.publikasi ? "publik" : "draf"}`}
                        {tab === "dokumentasi" && `${String(r.tanggal)} · ${String(r.fase)} · ${r.tampil ? "tampil" : "disembunyikan"}`}
                      </small>
                    </div>
                    <div className="admin-actions">
                      {tab !== "pesanan" && (
                        <>
                          <button className="btn btn--ghost btn--sm" type="button" onClick={() => startEdit(r)}>
                            Ubah
                          </button>
                          <button className="btn btn--ghost btn--sm" type="button" onClick={() => remove(String(r.id))}>
                            Hapus
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
