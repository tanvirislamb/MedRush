"use client";

import { Ambulance, Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import { buttonClass } from "@/Components/Button";
import { cn } from "@/Utils/cn";

interface PublicNavItem {
  href: string;
  label: string;
}

/** Canonical order of the public site — shared by the header and the footer. */
export const PUBLIC_NAV: PublicNavItem[] = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/**
 * Chrome for every public marketing page: sticky header with responsive nav and
 * a footer. Rendered as a client component so the active link and the mobile
 * menu can react to navigation, while pages passed as `children` remain Server
 * Components.
 */
export function PublicShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <header className="sticky top-0 z-50 border-b border-line/60 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2.5" aria-label="MedRush home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-md shadow-brand-500/30">
              <Ambulance className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-lg font-bold tracking-tight text-ink">MedRush</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Site navigation">
            {PUBLIC_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-surface-sunken text-ink"
                    : "text-ink-muted hover:bg-surface-sunken hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 sm:flex">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink"
            >
              Sign in
            </Link>
            <Link href="/register" className={buttonClass("primary")}>
              Get started
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="public-mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink md:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>

        {menuOpen ? (
          <nav
            id="public-mobile-menu"
            aria-label="Site navigation"
            className="animate-fade border-t border-line bg-surface px-6 py-3 md:hidden"
          >
            <ul className="space-y-1">
              {PUBLIC_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-surface-sunken text-ink"
                        : "text-ink-muted hover:bg-surface-sunken hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className={cn(buttonClass("primary"), "w-full")}
              >
                Get started
              </Link>
            </div>
          </nav>
        ) : null}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-line bg-surface px-6 py-12">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
                <Ambulance className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-sm font-bold tracking-tight text-ink">MedRush</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              Emergency ambulance dispatch for patients, dispatchers and fleet teams — from request
              to hospital hand-off, with secure Stripe payments.
            </p>
            <a
              href="tel:999"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-critical hover:underline"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Emergency? Call 999
            </a>
          </div>

          <div>
            <p className="text-label">Explore</p>
            <ul className="mt-3 space-y-2">
              {PUBLIC_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-label">Get started</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/register" className="text-sm text-ink-muted transition-colors hover:text-ink">
                  Create an account
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-ink-muted transition-colors hover:text-ink">
                  Sign in to the console
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-ink-muted transition-colors hover:text-ink">
                  Fleet &amp; hospital services
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <p className="text-xs text-ink-subtle">
            &copy; {new Date().getFullYear()} MedRush · Emergency Ambulance Dispatch System
          </p>
          <p className="text-xs text-ink-subtle">Built with Next.js and Stripe</p>
        </div>
      </footer>
    </div>
  );
}
