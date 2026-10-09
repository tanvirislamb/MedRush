"use client";

import { Ambulance, ArrowRight, Loader2, ShieldCheck, Siren, UserRound, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent, type ReactNode } from "react";

import { Button } from "@/Components/Button";
import { LoadingState } from "@/Components/Data";
import { Field, FormBanner } from "@/Components/Form";
import { useSession } from "@/Hooks/useSession";
import { useToast } from "@/Hooks/useToast";
import { authService } from "@/Services/authService";
import { ApiError } from "@/Services/httpClient";
import type { Role } from "@/Types/domain";

interface DemoAccount {
  role: Role;
  label: string;
  description: string;
  email: string;
  password: string;
  icon: ReactNode;
}

/** One-click demo accounts so evaluators can test each role without typing. */
const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "PATIENT",
    label: "Patient",
    description: "Request and track ambulance trips",
    email: "tanvir@gmail.com",
    password: "123456",
    icon: <UserRound className="h-4 w-4" aria-hidden="true" />,
  },
  {
    role: "DISPATCHER",
    label: "Dispatcher",
    description: "Work the queue and dispatch crews",
    email: "noman@gmail.com",
    password: "123456",
    icon: <Siren className="h-4 w-4" aria-hidden="true" />,
  },
  {
    role: "ADMIN",
    label: "Admin",
    description: "Full access to users, fleet and reports",
    email: "mehedi@gmail.com",
    password: "123456",
    icon: <ShieldCheck className="h-4 w-4" aria-hidden="true" />,
  },
];

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { notify } = useToast();
  const { refreshUser } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoRole, setDemoRole] = useState<Role | null>(null);

  const rawNext = searchParams.get("next");
  const next = rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await signIn(email, password, next);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Unable to sign in right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function signIn(userEmail: string, userPassword: string, destination: string) {
    const user = await authService.login({ email: userEmail, password: userPassword });
    notify({ title: `Welcome back, ${user.name}`, tone: "success" });
    await refreshUser();
    router.replace(destination);
  }

  async function onDemoLogin(account: DemoAccount) {
    setError(null);
    setDemoRole(account.role);
    try {
      await signIn(account.email, account.password, "/dashboard");
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : `Unable to sign in to the ${account.label.toLowerCase()} demo right now.`,
      );
    } finally {
      setDemoRole(null);
    }
  }

  const isBusy = isSubmitting || demoRole !== null;

  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="rounded-2xl border border-line bg-surface p-8 shadow-xl shadow-ink/5">
        <div className="mb-7 space-y-1 text-center">
          <h1 className="text-display text-2xl font-bold text-ink">Welcome back</h1>
          <p className="text-sm text-ink-muted">Sign in to your MedRush account</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          {error ? <FormBanner>{error}</FormBanner> : null}

          <Field
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@medrush.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Field
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" className="w-full" isLoading={isSubmitting} disabled={isBusy}>
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-muted">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-brand-500 hover:text-brand-600 hover:underline transition-colors">
            Create one
          </Link>
        </p>
      </div>

      {/* One-click demo login */}
      <div className="mt-5 rounded-2xl border border-line bg-surface-sunken px-4 py-4">
        <div className="mb-3 flex items-center justify-center gap-2">
          <Zap className="h-3.5 w-3.5 text-brand-500" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Quick demo login
          </p>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-3">
          {DEMO_ACCOUNTS.map((account) => {
            const isLoading = demoRole === account.role;
            return (
              <button
                key={account.role}
                type="button"
                onClick={() => onDemoLogin(account)}
                disabled={isBusy}
                aria-label={`Demo login as ${account.label}`}
                className="group flex items-center gap-3 rounded-xl border border-line bg-surface p-3 text-left transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50/60 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:flex-col sm:items-start sm:gap-2.5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-brand-100 transition-colors group-hover:bg-brand-500 group-hover:text-white group-hover:ring-brand-500">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : account.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1 text-sm font-semibold text-ink">
                    {account.label}
                    {!isLoading ? (
                      <ArrowRight className="h-3.5 w-3.5 text-ink-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600" aria-hidden="true" />
                    ) : null}
                  </span>
                  <span className="mt-0.5 block text-xs leading-snug text-ink-subtle">
                    {account.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-center text-[11px] text-ink-subtle">
          Signs you straight in — no credentials required.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-canvas">
      {/* Background gradient */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-brand-100 opacity-50 blur-[120px]" />
      </div>

      {/* Top nav */}
      <header className="relative border-b border-line/60 bg-surface/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white shadow-sm shadow-brand-500/25 transition-transform group-hover:scale-105">
              <Ambulance className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-bold tracking-tight text-ink">MedRush</span>
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            Create account →
          </Link>
        </div>
      </header>

      {/* Form */}
      <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-12">
        <Suspense fallback={<LoadingState />}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
