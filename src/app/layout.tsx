import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";

import { Providers } from "@/Components/Providers";

import "./globals.css";

// globals.css references these two custom properties in --font-sans / --font-display.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
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
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-dvh antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}