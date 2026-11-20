import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/admin-login-form";
import { getAdminUser } from "@/lib/admin-auth";
import { isServerSupabaseConfigured } from "@/lib/supabase-server";

export const metadata = {
  title: "Masuk panel admin",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (isServerSupabaseConfigured) {
    const user = await getAdminUser();
    if (user) redirect("/admin");
  }

  return (
    <section className="section">
      <div className="wrap wrap--narrow">
        <p className="eyebrow">Panel admin</p>
        <h1 className="page-title" style={{ fontSize: "clamp(2rem,1.2rem+2.4vw,3rem)" }}>
          Masuk untuk mengelola konten.
        </h1>
        <p className="page-lede">
          Panel ini mengelola sponsor, produk merch, pesanan, dokumentasi, dan status publikasi program.
        </p>
        <div style={{ marginTop: "2rem" }}>
          <AdminLoginForm configured={isServerSupabaseConfigured} />
        </div>
      </div>
    </section>
  );
}
