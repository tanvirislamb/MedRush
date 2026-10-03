"use client";

import { Button } from "@/Components/Button";
import { ApiError } from "@/Services/httpClient";
import { useEffect } from "react";

/**
 * Route-level error boundary. Anything thrown while rendering a console page
 * lands here instead of blanking the screen.
 */
export default function ConsoleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const message =
    error instanceof ApiError ? error.message : error.message || "An unexpected error occurred.";

  return (
    <div className="panel mx-auto max-w-lg p-8 text-center">
      <h1 className="text-display text-xl text-ink">This screen could not load</h1>
      <p className="mt-2 text-sm text-ink-muted">{message}</p>
      <Button className="mt-5" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}