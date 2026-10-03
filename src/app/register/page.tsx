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
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-canvas px-4 py-12">
      <Link href="/" className="flex items-center gap-2.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-800 text-ink-invert">
          <Ambulance className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="text-display text-xl text-ink">MedRush</span>
      </Link>

      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1.5 text-center">
          <h1 className="text-display text-2xl text-ink">Create your account</h1>
          <p className="text-sm text-ink-muted">Join the emergency dispatch network.</p>
        </div>

        <form onSubmit={onSubmit} className="panel space-y-4 p-6" noValidate>
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
            label="Email"
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

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Create account
          </Button>

          <p className="text-center text-sm text-ink-muted">
            Already registered?{" "}
            <Link href="/login" className="font-semibold text-brand-700 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}