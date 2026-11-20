"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Gagal masuk.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Tidak dapat menghubungi server.");
    } finally {
      setBusy(false);
    }
  };

  if (!configured) {
    return (
      <div className="notice">
        <b>Panel admin belum aktif.</b> Supabase belum dikonfigurasi pada server ini. Isi{" "}
        <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>, dan{" "}
        <code>SUPABASE_SERVICE_ROLE_KEY</code> di <code>.env.local</code>, lalu jalankan ulang server.
        Langkah lengkap ada di <code>README.md</code>.
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate style={{ maxWidth: "380px" }}>
      <label className="field">
        <span className="label">Email</span>
        <input
          className="input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
        />
      </label>
      <label className="field">
        <span className="label">Kata sandi</span>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </label>

      {error && (
        <p className="notice" role="alert" style={{ marginBottom: "1rem" }}>
          {error}
        </p>
      )}

      <button className="btn btn--primary" type="submit" disabled={busy} style={{ width: "100%" }}>
        {busy ? "Memeriksa..." : "Masuk panel admin"}
      </button>
      <p className="small muted" style={{ marginTop: ".75rem" }}>
        Akun dibuat di Supabase Authentication. Tidak ada pendaftaran publik.
      </p>
    </form>
  );
}
