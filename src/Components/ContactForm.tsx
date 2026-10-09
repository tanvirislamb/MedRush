"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/Components/Button";
import { FormBanner } from "@/Components/Form";
import { useToast } from "@/Hooks/useToast";

interface FormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const EMPTY: FormValues = { name: "", email: "", subject: "", message: "" };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "Please tell us your name.";
  if (!values.email.trim()) {
    errors.email = "We need an email address to reply.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.subject.trim()) errors.subject = "Add a short subject.";
  if (values.message.trim().length < 10) {
    errors.message = "Please give us a little more detail (at least 10 characters).";
  }
  return errors;
}

interface ServerError {
  path?: string;
  message?: string;
}

export function ContactForm() {
  const { notify } = useToast();

  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [banner, setBanner] = useState<{ tone: "critical" | "info"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBanner(null);

    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setBanner({ tone: "critical", text: "Please fix the highlighted fields below." });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
        errors?: ServerError[];
      };

      if (!response.ok || payload.success === false) {
        const fieldErrors: FormErrors = {};
        for (const issue of payload.errors ?? []) {
          if (issue.path && issue.path in EMPTY) {
            fieldErrors[issue.path as keyof FormValues] = issue.message ?? "Invalid value.";
          }
        }
        setErrors(fieldErrors);
        setBanner({
          tone: "critical",
          text: payload.message ?? "We could not send your message. Please try again.",
        });
        return;
      }

      setIsSent(true);
      setValues(EMPTY);
      notify({ title: "Message sent", description: "Our team will get back to you shortly.", tone: "success" });
    } catch {
      setBanner({
        tone: "critical",
        text: "We could not reach the server. Check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {banner ? <FormBanner tone={banner.tone}>{banner.text}</FormBanner> : null}
      {isSent && !banner ? (
        <FormBanner tone="info">
          Thanks — your message is on its way. We usually reply within one business day.
        </FormBanner>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="block text-sm font-medium text-ink">
            Full name <span className="text-critical">*</span>
          </span>
          <input
            name="name"
            autoComplete="name"
            placeholder="Ada Lovelace"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={errors.name ? true : undefined}
            className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink placeholder:text-ink-subtle focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 aria-[invalid]:border-critical"
          />
          {errors.name ? (
            <span role="alert" className="block text-xs font-medium text-critical">
              {errors.name}
            </span>
          ) : null}
        </label>

        <label className="block space-y-1.5">
          <span className="block text-sm font-medium text-ink">
            Email address <span className="text-critical">*</span>
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            aria-invalid={errors.email ? true : undefined}
            className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink placeholder:text-ink-subtle focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 aria-[invalid]:border-critical"
          />
          {errors.email ? (
            <span role="alert" className="block text-xs font-medium text-critical">
              {errors.email}
            </span>
          ) : null}
        </label>
      </div>

      <label className="block space-y-1.5">
        <span className="block text-sm font-medium text-ink">
          Subject <span className="text-critical">*</span>
        </span>
        <input
          name="subject"
          placeholder="Fleet onboarding, partnership, support…"
          value={values.subject}
          onChange={(e) => update("subject", e.target.value)}
          aria-invalid={errors.subject ? true : undefined}
          className="h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink placeholder:text-ink-subtle focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 aria-[invalid]:border-critical"
        />
        {errors.subject ? (
          <span role="alert" className="block text-xs font-medium text-critical">
            {errors.subject}
          </span>
        ) : null}
      </label>

      <label className="block space-y-1.5">
        <span className="block text-sm font-medium text-ink">
          Message <span className="text-critical">*</span>
        </span>
        <textarea
          name="message"
          rows={5}
          placeholder="Tell us how we can help…"
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          aria-invalid={errors.message ? true : undefined}
          className="min-h-24 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm leading-relaxed text-ink placeholder:text-ink-subtle focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 aria-[invalid]:border-critical"
        />
        {errors.message ? (
          <span role="alert" className="block text-xs font-medium text-critical">
            {errors.message}
          </span>
        ) : null}
      </label>

      <Button type="submit" className="w-full sm:w-auto" isLoading={isSubmitting}>
        Send message
      </Button>
    </form>
  );
}
