import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Providers } from "@/Components/Providers";

import "./globals.css";

// globals.css references this custom property in --font-sans / --font-display.
// Inter is the only family in the system: hierarchy comes from size and weight.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MedRush — Emergency Ambulance Dispatch",
    template: "%s · MedRush",
  },
  description:
    "Dispatch console for emergency ambulance requests, fleet management and trip tracking.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-dvh antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}