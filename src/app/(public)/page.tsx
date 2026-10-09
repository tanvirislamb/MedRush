import type { Metadata } from "next";

import { LandingPage } from "@/Components/LandingPage";
import { SessionRedirect } from "@/Components/SessionRedirect";

export const metadata: Metadata = {
  title: { absolute: "MedRush — Emergency Ambulance Dispatch" },
  description:
    "Request an ambulance, track the crew live and settle fares securely. MedRush gives patients, dispatchers and fleet teams one real-time emergency dispatch platform.",
  openGraph: {
    title: "MedRush — Emergency Ambulance Dispatch",
    description:
      "Request an ambulance, track the crew live and settle fares securely with MedRush.",
    type: "website",
    siteName: "MedRush",
  },
};

export default function HomePage() {
  return (
    <>
      <SessionRedirect />
      <LandingPage />
    </>
  );
}
