"use client";

import { Ambulance } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/Components/Button";
import { Field, FormBanner, Select } from "@/Components/Form";
import { useSession } from "@/Hooks/useSession";
import { useToast } from "@/Hooks/useToast";
import { authService } from "@/Services/authService";
import { ApiError } from "@/Services/httpClient";
import type { Role } from "@/Types/domain";

const ROLE_HINT: Record<string, string> = {
  PATIENT: "Request an ambulance and track your own trips.",
  DISPATCHER: "Manage the fleet and dispatch incoming requests.",
};

export default function RegisterPage() {
  const router = useRouter();
  const { notify } = useToast();
  const { refreshUser } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"PATIENT" | "DISPATCHER">("PATIENT");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsSubmitting(true);
    try {
      const user = await authService.register({
        name,
        email,
        password,
        role,
        ...(phone.trim() ? { phone: phone.trim() } : {}),
      });
      notify({ title: `Account created for ${user.name}`, tone: "success" });
      await refreshUser();
      router.replace("/dashboard");
    } catch (caught) {
      if (caught instanceof ApiError) {
        setError(caught.message);
        setFieldErrors(caught.fieldErrors);
      } else {
        setError("Unable to create your account right now.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

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
            href="/login"
            className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            Already have an account? Sign in →
          </Link>
        </div>
      </header>

      {/* Form */}
      <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-2xl border border-line bg-surface p-8 shadow-xl shadow-ink/5">
            <div className="mb-7 space-y-1 text-center">
              <h1 className="text-display text-2xl font-bold text-ink">Create your account</h1>
              <p className="text-sm text-ink-muted">Join the MedRush emergency dispatch network.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              {error ? <FormBanner>{error}</FormBanner> : null}

              <Field
                label="Full name"
                name="name"
                autoComplete="name"
                placeholder="Ada Lovelace"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={fieldErrors.name}
              />
              <Field
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={fieldErrors.email}
              />
              <Field
                label="Phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+880 1700 000000"
                hint="Optional — helps dispatchers reach you."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={fieldErrors.phone}
              />
              <Field
                label="Password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 6 characters"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={fieldErrors.password}
              />
              <Select
                label="I am a"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value as Role as "PATIENT" | "DISPATCHER")}
                hint={ROLE_HINT[role]}
              >
                <option value="PATIENT">Patient</option>
                <option value="DISPATCHER">Dispatcher</option>
              </Select>

              <div className="pt-1">
                <Button type="submit" className="w-full" isLoading={isSubmitting}>
                  Create account
                </Button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-ink-muted">
              Already registered?{" "}
              <Link href="/login" className="font-semibold text-brand-500 hover:text-brand-600 hover:underline transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}