"use client";

import { Ambulance } from "lucide-react";
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

  // Only accept same-origin relative paths so `next` cannot become an open redirect.
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
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1.5 text-center">
        <h1 className="text-display text-2xl text-ink">Sign in</h1>
        <p className="text-sm text-ink-muted">Access the MedRush dispatch console.</p>
      </div>

      <form onSubmit={onSubmit} className="panel space-y-4 p-6" noValidate>
        {error ? <FormBanner>{error}</FormBanner> : null}

        <Field
          label="Email"
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

        <p className="text-center text-sm text-ink-muted">
          Need an account?{" "}
          <Link href="/register" className="font-semibold text-brand-700 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-canvas px-4 py-12">
      <Link href="/" className="flex items-center gap-2.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-800 text-ink-invert">
          <Ambulance className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="text-display text-xl text-ink">MedRush</span>
      </Link>

      <Suspense fallback={<LoadingState />}>
        <LoginForm />
      </Suspense>

      <p className="max-w-md text-center text-xs leading-relaxed text-ink-subtle">
        Demo accounts — admin@medrush.com / Admin123, dispatcher@medrush.com / Dispatch123,
        patient@medrush.com / Patient123
      </p>
    </main>
  );
}