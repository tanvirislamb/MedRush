"use client";

import {
  Ambulance,
  Building2,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Loader2,
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

interface NavGroup {
  /** null keeps the item in an unlabelled block at the top of the sidebar. */
  label: string | null;
  items: NavItem[];
}

const ALL: Role[] = ["PATIENT", "DISPATCHER", "ADMIN"];

const NAV_GROUPS: NavGroup[] = [
  {
    label: null,
    items: [
      {
        href: "/dashboard",
        label: "Overview",
        icon: <LayoutDashboard className="h-4 w-4" aria-hidden="true" />,
        roles: ALL,
      },
    ],
  },
  {
    label: "Requests",
    items: [
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
    ],
  },
  {
    label: "Operations",
    items: [
      {
        href: "/trips",
        label: "Trips",
        icon: <Route className="h-4 w-4" aria-hidden="true" />,
        roles: ALL,
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
    ],
  },
  {
    label: "Billing",
    items: [
      {
        href: "/payments",
        label: "Payments",
        icon: <CreditCard className="h-4 w-4" aria-hidden="true" />,
        roles: ["PATIENT", "ADMIN"],
      },
    ],
  },
  {
    label: "Administration",
    items: [
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
    ],
  },
];

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2.5 rounded-md px-2 py-[7px] text-[13px] font-medium transition-colors",
        active ? "bg-surface-sunken text-ink" : "text-ink-muted hover:bg-surface-sunken/70 hover:text-ink",
      )}
    >
      <span className={cn("shrink-0", active ? "text-brand-600" : "text-ink-subtle")}>
        {item.icon}
      </span>
      {item.label}
    </Link>
  );
}

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
        <p className="flex items-center gap-2.5 text-sm text-ink-muted">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Checking your session…
        </p>
      </div>
    );
  }

  if (isUnauthenticated || !user || !role) return null;

  // Groups are filtered by role, then emptied groups are dropped entirely so a
  // patient never sees an orphaned "Administration" heading.
  const groups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => item.roles.includes(role)),
  })).filter((group) => group.items.length > 0);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-dvh bg-canvas lg:grid lg:grid-cols-[14rem_1fr]">
      {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line bg-surface lg:flex">
        {/* Brand */}
        <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-line px-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-white">
            <Ambulance className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-ink">MedRush</p>
            <p className="truncate text-[11px] leading-tight text-ink-subtle">Dispatch console</p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 scroll-slim" aria-label="Main">
          {groups.map((group) => (
            <div key={group.label ?? "root"} className="mb-5 last:mb-0">
              {group.label ? <p className="mb-1.5 px-2 text-label">{group.label}</p> : null}
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <NavLink item={item} active={isActive(item.href)} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="shrink-0 border-t border-line p-3">
          <div className="mb-1 flex items-center gap-2.5 rounded-md px-2 py-1.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-sunken text-[11px] font-semibold text-ink-muted">
              {initialsOf(user.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-ink">{user.name}</p>
              <p className="truncate text-[11px] leading-tight text-ink-subtle">
                {ROLE_LABEL[role]}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
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
        <header className="flex h-14 items-center justify-between gap-3 border-b border-line bg-surface px-4 lg:hidden">
          <span className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-white">
              <Ambulance className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-ink">MedRush</span>
          </span>
          <span className="truncate text-[11px] text-ink-subtle">
            {user.name} · {ROLE_LABEL[role]}
          </span>
        </header>

        {/* Mobile nav tabs */}
        <nav
          className="flex gap-1 overflow-x-auto border-b border-line bg-surface px-3 py-2 scroll-slim lg:hidden"
          aria-label="Main"
        >
          {groups.flatMap((group) => group.items).map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "shrink-0 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors",
                  active
                    ? "bg-brand-600 text-white"
                    : "text-ink-muted hover:bg-surface-sunken hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="mx-auto w-full max-w-[92rem] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}