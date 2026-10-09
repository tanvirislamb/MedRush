import { cn } from "@/Utils/cn";

/**
 * Button styling lives in a framework-agnostic module (no "use client") so it
 * can be called from both Server and Client Components. The interactive
 * <Button> component re-exports it for existing client-side imports.
 */
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800",
  secondary: "bg-surface text-ink border border-line hover:bg-surface-sunken hover:border-line-strong",
  ghost: "text-ink-muted hover:bg-surface-sunken hover:text-ink",
  danger: "bg-critical text-white hover:bg-critical/90 active:bg-critical",
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 px-2.5 text-[13px]",
  md: "h-9 gap-2 px-3.5 text-sm",
};

const BASE_CLASS =
  "inline-flex items-center justify-center rounded-md font-medium transition-colors " +
  "disabled:cursor-not-allowed disabled:opacity-55";

/**
 * Shared button styling, also used by <Link> so navigation actions are
 * indistinguishable from in-page buttons.
 */
export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(BASE_CLASS, VARIANT_CLASS[variant], SIZE_CLASS[size], className);
}
