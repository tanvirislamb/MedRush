"use client";

import { Ambulance, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";

import { Button } from "@/Components/Button";
import { LoadingState } from "@/Components/Data";
import { Field, FormBanner } from "@/Components/Form";
import { useSession } from "@/Hooks/useSession";
import { useToast } from "@/Hooks/useToast";
import { authService } from "@/Services/authService";
import { ApiError } from "@/Services/httpClient";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { notify } = useToast();
  const { refreshUser } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rawNext = searchParams.get("next");
  const next = rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const user = await authService.login({ email, password });
      notify({ title: `Welcome back, ${user.name}`, tone: "success" });
      await refreshUser();
      router.replace(next);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Unable to sign in right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

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

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
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

      {/* Demo credentials */}
      <div className="mt-5 rounded-xl border border-line bg-surface-sunken px-4 py-3">
        <p className="mb-1.5 text-xs font-semibold text-ink-muted">Demo accounts</p>
        <div className="space-y-1 text-xs text-ink-subtle">
          <p><span className="font-medium text-ink-muted">Admin:</span> admin@medrush.com / Admin123</p>
          <p><span className="font-medium text-ink-muted">Dispatcher:</span> dispatcher@medrush.com / Dispatch123</p>
          <p><span className="font-medium text-ink-muted">Patient:</span> patient@medrush.com / Patient123</p>
        </div>
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