"use client";

import { useSession } from "@/Hooks/useSession";
import { LandingPage } from "@/Components/LandingPage";
import { LoadingState } from "@/Components/Data";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Entry point: authenticated users go straight to the dashboard; everyone else sees the landing page. */
export default function HomePage() {
  const router = useRouter();
  const { isLoading, user } = useSession();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [isLoading, user, router]);

  if (isLoading) return <LoadingState label="Loading MedRush…" />;

  // Unauthenticated visitors see the landing page.
  if (!user) return <LandingPage />;

  // Authenticated — transitioning to dashboard, show a brief spinner.
  return <LoadingState label="Loading MedRush…" />;
}