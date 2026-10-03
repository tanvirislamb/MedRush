"use client";

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

import { cn } from "@/Utils/cn";

const CONTROL_BASE =
  "w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink placeholder:text-ink-subtle " +
  "transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 " +
  "disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-ink-subtle";

function Wrapper({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
}: {
  label?: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
          {label}
          {required ? <span className="ml-0.5 text-critical">*</span> : null}
        </label>
      ) : null}
      {children}
      {error ? (
        <p className="text-xs font-medium text-critical" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-ink-subtle">{hint}</p>
      ) : null}
    </div>
  );
}

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Field({ label, error, hint, className, id, required, ...rest }: FieldProps) {
  const controlId = id ?? rest.name;
  return (
    <Wrapper label={label} htmlFor={controlId} error={error} hint={hint} required={required}>
      <input
        id={controlId}
        aria-invalid={error ? true : undefined}
        className={cn(CONTROL_BASE, "h-10", error && "border-critical", className)}
        {...rest}
      />
    </Wrapper>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Select({ label, error, hint, className, id, required, children, ...rest }: SelectProps) {
  const controlId = id ?? rest.name;
  return (
    <Wrapper label={label} htmlFor={controlId} error={error} hint={hint} required={required}>
      <select
        id={controlId}
        aria-invalid={error ? true : undefined}
        className={cn(CONTROL_BASE, "h-10 cursor-pointer", error && "border-critical", className)}
        {...rest}
      >
        {children}
      </select>
    </Wrapper>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({ label, error, hint, className, id, required, ...rest }: TextareaProps) {
  const controlId = id ?? rest.name;
  return (
    <Wrapper label={label} htmlFor={controlId} error={error} hint={hint} required={required}>
      <textarea
        id={controlId}
        aria-invalid={error ? true : undefined}
        className={cn(CONTROL_BASE, "min-h-24 py-2 leading-relaxed", error && "border-critical", className)}
        {...rest}
      />
    </Wrapper>
  );
}

export function FormBanner({ tone = "critical", children }: { tone?: "critical" | "info"; children: ReactNode }) {
  return (
    <p
      role="alert"
      className={cn(
        "rounded-lg px-3 py-2 text-sm font-medium",
        tone === "critical" ? "bg-critical-soft text-critical" : "bg-medium-soft text-medium",
      )}
    >
      {children}
    </p>
  );
}