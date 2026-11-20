import { NextRequest, NextResponse } from "next/server";
import { createSupabaseMiddleware, isServerSupabaseConfigured } from "@/lib/supabase-server";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLogin = pathname === "/admin/login";

  if (!isServerSupabaseConfigured) {
    if (isLogin) return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("setup", "1");
    return NextResponse.redirect(url);
  }

  const res = NextResponse.next();
  const supabase = createSupabaseMiddleware(req, res);
  if (!supabase) return res;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
