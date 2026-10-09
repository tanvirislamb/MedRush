import type { Metadata } from "next";
import {
  Activity,
  Ambulance,
  ArrowRight,
  Building2,
  Heart,
  Hospital,
  MapPin,
  Shield,
  Siren,
  Target,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

import { buttonClass } from "@/Utils/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "MedRush is a real-time emergency ambulance dispatch platform connecting patients, dispatchers and hospital fleets across one shared console.",
  openGraph: {
    title: "About MedRush",
    description:
      "Learn how MedRush connects patients, dispatchers and hospital fleets on one real-time emergency dispatch platform.",
    type: "website",
    siteName: "MedRush",
  },
};

const PILLARS = [
  {
    icon: <Siren className="h-5 w-5" />,
    title: "Faster dispatch",
    description:
      "A single prioritised queue means critical cases are never buried. Dispatchers assign the nearest available crew in one action.",
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    title: "Real-time visibility",
    description:
      "Patients, dispatchers and drivers all see the same live trip status, from acceptance through to hospital hand-off.",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Trusted & accountable",
    description:
      "Every action is recorded in an audit log, and payments are settled through Stripe rather than handled by hand.",
  },
];

const VALUES = [
  { icon: <Zap className="h-4 w-4" />, title: "Speed by default", text: "Every screen is built to remove clicks, not add them." },
  { icon: <Heart className="h-4 w-4" />, title: "Patient first", text: "Clinical priority always outranks convenience." },
  { icon: <Activity className="h-4 w-4" />, title: "Honest data", text: "Statuses come from the backend, never from optimistic guesses." },
  { icon: <Shield className="h-4 w-4" />, title: "Least privilege", text: "People only ever see the tools their role requires." },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden px-6 pb-20 pt-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand-100 opacity-40 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
            About
          </span>
          <h1 className="text-display text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
            One console between an emergency and the help that follows
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            MedRush is an emergency ambulance dispatch platform. It turns a distress call into a
            tracked, auditable trip — matching a patient with the nearest available crew, routing
            them to the right hospital and settling the fare securely.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="border-y border-line bg-surface px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="mb-3 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
              Our mission
            </span>
            <h2 className="text-display text-3xl font-bold text-ink">
              Cut the distance between a call and a crew
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-muted">
              Ambulance response is a coordination problem. Calls arrive from every direction, fleet
              capacity changes by the minute, and hospitals have different intake capabilities.
              MedRush pulls all of that into one shared view so the next available ambulance is
              always obvious.
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              The platform gives each person exactly the tools they need: patients raise requests
              and pay, dispatchers run the queue, and administrators keep the fleet and its people
              healthy.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/services" className={buttonClass("primary")}>
                View our services
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/contact" className={buttonClass("secondary")}>
                Contact the team
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {PILLARS.map((pillar) => (
              <div key={pillar.title} className="rounded-2xl border border-line bg-canvas p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-500 ring-1 ring-brand-100">
                  {pillar.icon}
                </span>
                <h3 className="mt-4 text-base font-semibold text-ink">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT IS FOR */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
              Who it is for
            </span>
            <h2 className="text-display text-3xl font-bold text-ink sm:text-4xl">
              Built around three roles
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: <Users className="h-5 w-5" />,
                title: "Patients",
                text: "Raise an emergency request with a pickup location and priority, track the ambulance in real time, and pay the fare online.",
              },
              {
                icon: <Siren className="h-5 w-5" />,
                title: "Dispatchers",
                text: "Search the live queue, triage by urgency, assign ambulances and drivers, and move each trip through to completion.",
              },
              {
                icon: <Shield className="h-5 w-5" />,
                title: "Administrators",
                text: "Manage users and roles, oversee ambulances, drivers and hospitals, and review operations, revenue and audit logs.",
              },
            ].map((role) => (
              <div key={role.title} className="rounded-2xl border border-line bg-surface p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-500 ring-1 ring-brand-100">
                  {role.icon}
                </span>
                <h3 className="mt-4 text-base font-semibold text-ink">{role.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{role.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES + OPERATIONS */}
      <section className="bg-surface px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <span className="mb-3 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
              What we stand for
            </span>
            <h2 className="text-display text-3xl font-bold text-ink">Principles we build to</h2>
            <div className="mt-8 space-y-4">
              {VALUES.map((value) => (
                <div key={value.title} className="flex gap-4 rounded-xl border border-line bg-canvas p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
                    {value.icon}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{value.title}</p>
                    <p className="mt-1 text-sm text-ink-muted">{value.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-canvas p-8">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-500 ring-1 ring-brand-100">
              <Building2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="text-display mt-4 text-2xl font-bold text-ink">Operations we support</h2>
            <ul className="mt-6 space-y-4">
              {[
                { icon: <Ambulance className="h-4 w-4" />, label: "Emergency and non-emergency ambulance transport" },
                { icon: <Hospital className="h-4 w-4" />, label: "Inter-facility and hospital-to-hospital transfers" },
                { icon: <Activity className="h-4 w-4" />, label: "Advanced and basic life support response" },
                { icon: <Target className="h-4 w-4" />, label: "Priority triage for high-acuity cases" },
              ].map((item) => (
                <li key={item.label} className="flex items-center gap-3 text-sm text-ink-muted">
                  <span className="text-brand-500" aria-hidden="true">
                    {item.icon}
                  </span>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
