"use client";

import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { buttonClass, type ButtonSize, type ButtonVariant } from "@/Utils/button";

export { buttonClass };
export type { ButtonSize, ButtonVariant };

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      className={buttonClass(variant, size, className)}
      {...rest}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : icon}
      {children}
    </button>
  );
}
