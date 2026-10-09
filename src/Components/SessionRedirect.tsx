"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useSession } from "@/Hooks/useSession";

/**
 * Renders nothing. Sends signed-in visitors straight to the console so the
 * public landing page is only ever seen by logged-out users. Kept as a tiny
 * client island so the surrounding page can stay a Server Component and export
 * its own Metadata.
 */
export function SessionRedirect() {
  const router = useRouter();
  const { isLoading, user } = useSession();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [isLoading, user, router]);

  return null;
}
