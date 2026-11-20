// Verifikasi sesi admin untuk setiap route handler /admin.
// ADMIN_EMAILS: daftar email dipisah koma. Bila kosong, semua akun
// terautentikasi dianggap admin (cukup untuk pengembangan lokal).
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function getAdminUser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
  if (!url || !key) return null;

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // Route handler bersifat read only untuk cookie, refresh terjadi di middleware.
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
}

export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) {
    return {
      user: null,
      error: NextResponse.json({ error: "Sesi admin tidak ditemukan." }, { status: 401 }),
    };
  }

  const allow = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (allow.length > 0 && !allow.includes((user.email ?? "").toLowerCase())) {
    return {
      user: null,
      error: NextResponse.json({ error: "Akun ini tidak terdaftar sebagai admin." }, { status: 403 }),
    };
  }

  return { user, error: null };
}
