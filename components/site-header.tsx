"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/lib/content";
import CartCount from "./cart-count";

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  return (
    <header className="site-header">
      <div className="wrap">
        <nav className="nav" aria-label="Navigasi utama">
          <Link href="/" className="brand" aria-label={`${site.name} ${site.year}, beranda`}>
            <svg className="brand__mark" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 17 12 6l9 11" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              <path d="M6.5 20 12 12.5 17.5 20" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
            </svg>
            <span>Arutala</span>
            <span className="brand__year">{site.year}</span>
          </Link>

          <div className="nav-links">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} aria-current={isActive(item.href) ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="nav-actions">
            <CartCount />
            <Link href="/links" className="btn btn--ghost btn--sm">
              Tautan resmi
            </Link>
          </div>

          <button
            ref={toggleRef}
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="nav-panel"
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path d="M5 5l14 14M19 5 5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
            {open ? "Tutup" : "Menu"}
          </button>
        </nav>
      </div>

      <div id="nav-panel" className="nav-panel" data-open={open} ref={panelRef}>
        {nav.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
            <span className="mono">0{nav.indexOf(item) + 1}</span>
          </Link>
        ))}
        <Link href="/links" onClick={() => setOpen(false)}>
          Tautan resmi
          <span className="mono">IG / TikTok</span>
        </Link>
        <Link href="/sponsor#paket" className="btn btn--primary" onClick={() => setOpen(false)}>
          Lihat paket sponsor
        </Link>
      </div>
    </header>
  );
}
