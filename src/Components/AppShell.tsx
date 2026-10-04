"use client";

import {
  Ambulance,
  Building2,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Route,
  ScrollText,
  Siren,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/Components/Button";
import { useSession } from "@/Hooks/useSession";
import { cn } from "@/Utils/cn";
import { initialsOf } from "@/Utils/format";
import { ROLE_LABEL } from "@/Utils/presentation";
import type { Role } from "@/Types/domain";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  roles: Role[];
}

const ALL: Role[] = ["PATIENT", "DISPATCHER", "ADMIN"];

const NAV: NavItem[] = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: <LayoutDashboard className="h-4 w-4" aria-hidden="true" />,
    roles: ALL,
  },
  {
    href: "/requests",
    label: "My requests",
    icon: <ClipboardList className="h-4 w-4" aria-hidden="true" />,
    roles: ["PATIENT"],
  },
  {
    href: "/dispatch",
    label: "Dispatch queue",
    icon: <Siren className="h-4 w-4" aria-hidden="true" />,
    roles: ["DISPATCHER", "ADMIN"],
  },
  {
    href: "/trips",
    label: "Trips",
    icon: <Route className="h-4 w-4" aria-hidden="true" />,
    roles: ALL,
  },
  {
    href: "/payments",
    label: "Payments",
    icon: <CreditCard className="h-4 w-4" aria-hidden="true" />,
    roles: ["PATIENT", "ADMIN"],
  },
  {
    href: "/fleet",
    label: "Ambulances",
    icon: <Ambulance className="h-4 w-4" aria-hidden="true" />,
    roles: ["DISPATCHER", "ADMIN"],
  },
  {
    href: "/crew",
    label: "Drivers",
    icon: <Users className="h-4 w-4" aria-hidden="true" />,
    roles: ["DISPATCHER", "ADMIN"],
  },
  {
    href: "/hospitals",
    label: "Hospitals",
    icon: <Building2 className="h-4 w-4" aria-hidden="true" />,
    roles: ["DISPATCHER", "ADMIN"],
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: <Users className="h-4 w-4" aria-hidden="true" />,
    roles: ["ADMIN"],
  },
  {
    href: "/admin/audit",
    label: "Audit log",
    icon: <ScrollText className="h-4 w-4" aria-hidden="true" />,
    roles: ["ADMIN"],
  },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, isLoading, isUnauthenticated, signOut } = useSession();

  // Defer rendering entirely to the client — session state is never available
  // on the server, so rendering session-dependent JSX during SSR causes a
  // hydration mismatch (server: nothing, client: loading spinner or redirect).
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (isUnauthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isUnauthenticated, mounted, pathname, router]);

  // Nothing on the server — avoids hydration mismatch.
  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-canvas">
        <div className="flex flex-col items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-white shadow-lg shadow-brand-500/30">
            <Ambulance className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="text-sm text-ink-muted">Checking your session…</p>
        </div>
      </div>
    );
  }

  if (isUnauthenticated || !user || !role) return null;

  const items = NAV.filter((item) => item.roles.includes(role));

  return (
    <div className="min-h-dvh bg-canvas lg:grid lg:grid-cols-[15rem_1fr]">
      {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
      <aside className="hidden border-r border-line bg-surface lg:flex lg:flex-col">
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-line px-5 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-md shadow-brand-500/25">
            <Ambulance className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-bold tracking-tight text-ink">MedRush</p>
            <p className="mt-0.5 text-[11px] text-ink-subtle">Dispatch console</p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4 scroll-slim" aria-label="Main">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-brand-50 text-brand-600 shadow-sm ring-1 ring-brand-100"
                    : "text-ink-muted hover:bg-surface-sunken hover:text-ink",
                )}
              >
                <span className={cn("shrink-0", active ? "text-brand-500" : "")}>
                  {item.icon}
                </span>
                {item.label}
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="border-t border-line p-3">
          <div className="mb-1 flex items-center gap-3 rounded-lg px-2 py-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-bold text-white shadow-sm">
              {initialsOf(user.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
              <p className="truncate text-xs text-ink-subtle">{ROLE_LABEL[role]}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-0.5 w-full justify-start text-ink-muted hover:text-critical"
            icon={<LogOut className="h-4 w-4" aria-hidden="true" />}
            onClick={() => signOut()}
          >
            Sign out
          </Button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-col">
        {/* Mobile top bar */}
        <header className="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3 lg:hidden">
          <span className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white shadow-sm shadow-brand-500/25">
              <Ambulance className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-bold tracking-tight text-ink">MedRush</span>
          </span>
          <span className="truncate text-xs text-ink-subtle">
            {user.name} · {ROLE_LABEL[role]}
          </span>
        </header>

        {/* Mobile nav tabs */}
        <nav
          className="flex gap-1 overflow-x-auto border-b border-line bg-surface px-3 py-2 scroll-slim lg:hidden"
          aria-label="Main"
        >
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "bg-brand-500 text-white shadow-sm shadow-brand-500/25"
                    : "text-ink-muted hover:bg-surface-sunken hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}