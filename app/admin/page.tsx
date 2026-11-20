import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin-dashboard";
import { getAdminUser } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Panel admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  return <AdminDashboard email={user.email ?? "admin"} />;
}
