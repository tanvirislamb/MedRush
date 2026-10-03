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
import { useEffect, type ReactNode } from "react";

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

  // The refresh interceptor in httpClient also redirects here on a dead session; this
  // effect covers a cold load on a deep link. Must not run during render.
  useEffect(() => {
    if (isUnauthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isUnauthenticated, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-canvas">
        <p className="text-sm text-ink-muted">Checking your session…</p>
      </div>
    );
  }

  if (isUnauthenticated) return null;

  if (!user || !role) return null;

  const items = NAV.filter((item) => item.roles.includes(role));

  return (
    <div className="min-h-dvh bg-canvas lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="hidden border-r border-line bg-surface lg:flex lg:flex-col">
        <div className="flex items-center gap-2.5 border-b border-line px-5 py-4">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-800 text-ink-invert">
            <Ambulance className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-display text-base leading-none text-ink">MedRush</p>
            <p className="mt-1 text-xs text-ink-subtle">Dispatch console</p>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3 scroll-slim" aria-label="Main">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-50 text-brand-800"
                    : "text-ink-muted hover:bg-surface-sunken hover:text-ink",
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-line p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800">
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
            className="mt-1 w-full justify-start"
            icon={<LogOut className="h-4 w-4" aria-hidden="true" />}
            onClick={() => {
              signOut();
              router.replace("/login");
            }}
          >
            Sign out
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        {/* Compact bar so navigation is not desktop-only. */}
        <header className="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3 lg:hidden">
          <span className="flex items-center gap-2 text-sm font-semibold text-ink">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-800 text-ink-invert">
              <Ambulance className="h-4 w-4" aria-hidden="true" />
            </span>
            MedRush
          </span>
          <span className="truncate text-xs text-ink-subtle">
            {user.name} · {ROLE_LABEL[role]}
          </span>
        </header>

        <nav
          className="flex gap-1 overflow-x-auto border-b border-line bg-surface px-2 py-2 scroll-slim lg:hidden"
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
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium",
                  active ? "bg-brand-800 text-ink-invert" : "text-ink-muted hover:bg-surface-sunken",
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