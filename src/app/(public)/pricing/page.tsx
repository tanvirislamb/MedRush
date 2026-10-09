import type { Metadata } from "next";
import { Ambulance, ArrowRight, Baby, Check, HeartPulse, Hospital, Siren, Sparkles } from "lucide-react";
import Link from "next/link";

import { buttonClass } from "@/Utils/button";
import { cn } from "@/Utils/cn";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent ambulance fares and fleet plans. Patients pay per trip through Stripe; operators choose a monthly plan that scales with their fleet.",
  openGraph: {
    title: "Pricing · MedRush",
    description:
      "Transparent per-trip ambulance fares and monthly fleet plans for operators, hospitals and dispatchers.",
    type: "website",
    siteName: "MedRush",
  },
};

const FARES = [
  {
    icon: <Ambulance className="h-5 w-5" />,
    name: "Basic life support",
    price: "$25",
    unit: "per trip",
    description: "Stable patients who need supervised transport, e.g. discharge or clinic transfer.",
  },
  {
    icon: <HeartPulse className="h-5 w-5" />,
    name: "Advanced life support",
    price: "$60",
    unit: "per trip",
    description: "High-acuity emergencies with monitoring and paramedic intervention en route.",
    featured: true,
  },
  {
    icon: <Baby className="h-5 w-5" />,
    name: "Neonatal & paediatric",
    price: "$75",
    unit: "per trip",
    description: "Specialist equipment and crews experienced with infants and children.",
  },
  {
    icon: <Hospital className="h-5 w-5" />,
    name: "Inter-facility transfer",
    price: "$40",
    unit: "per trip",
    description: "Scheduled or urgent transfers between hospitals and clinics with a documented hand-off.",
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    tagline: "For a single station getting onto the platform.",
    features: [
      "Up to 5 ambulances",
      "Up to 5 dispatcher seats",
      "Live dispatch queue",
      "Stripe trip payments",
      "Email support",
    ],
    cta: { href: "/contact", label: "Talk to us", variant: "secondary" as const },
  },
  {
    name: "Growth",
    price: "$129",
    period: "/month",
    tagline: "For growing fleets that dispatch every day.",
    features: [
      "Up to 25 ambulances",
      "Unlimited dispatcher seats",
      "Hospital directory & routing",
      "Priority triage & analytics",
      "Audit log & reports",
      "Priority support",
    ],
    featured: true,
    cta: { href: "/contact", label: "Talk to us", variant: "primary" as const },
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    tagline: "For multi-city operators and hospital groups.",
    features: [
      "Unlimited fleet & regions",
      "Custom roles & permissions",
      "Bulk audit exports",
      "SLA & onboarding",
      "Dedicated success manager",
    ],
    cta: { href: "/contact", label: "Contact sales", variant: "secondary" as const },
  },
];

const FAQ = [
  {
    question: "How do patients pay for a trip?",
    answer:
      "Trip fares are settled through Stripe Checkout. A patient pays from the payments screen, and the trip flips to paid only once Stripe confirms the transaction.",
  },
  {
    question: "Is there a charge for cancelled trips?",
    answer:
      "No. If a request is cancelled before a crew is dispatched, no fare is raised. Cancelled trips simply disappear from the payable list.",
  },
  {
    question: "Can I try MedRush before subscribing?",
    answer:
      "Yes. Create a free account to raise and track requests, or use one of the one-click demo logins on the sign-in page to explore the dispatcher and admin consoles.",
  },
  {
    question: "Do you support inter-facility transfers?",
    answer:
      "Absolutely. Dispatchers can route any trip to a partner hospital from the hospital directory, and both sides see a shared status timeline.",
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="relative overflow-hidden px-6 pb-16 pt-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand-100 opacity-40 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
            Pricing
          </span>
          <h1 className="text-display text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
            Pay per trip, or scale with a fleet plan
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Patients pay for the ride they take. Fleet operators and hospitals pick a monthly plan
            that grows with the number of ambulances they run. No hidden fees.
          </p>
        </div>
      </section>

      {/* PER-TRIP FARES */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-500" aria-hidden="true" />
            <h2 className="text-display text-2xl font-bold text-ink">Per-trip fares</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FARES.map((fare) => (
              <div
                key={fare.name}
                className={cn(
                  "flex flex-col rounded-2xl border bg-surface p-6",
                  fare.featured ? "border-brand-300 ring-1 ring-brand-200" : "border-line",
                )}
              >
                {fare.featured ? (
                  <span className="mb-3 inline-flex w-fit rounded-full bg-brand-500 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                    Most requested
                  </span>
                ) : null}
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-500 ring-1 ring-brand-100">
                  {fare.icon}
                </span>
                <h3 className="mt-4 text-base font-semibold text-ink">{fare.name}</h3>
                <p className="mt-4 flex items-baseline gap-1">
                  <span className="text-display text-3xl font-bold text-ink">{fare.price}</span>
                  <span className="text-xs text-ink-subtle">{fare.unit}</span>
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{fare.description}</p>
                <Link href="/register" className={cn(buttonClass("secondary"), "mt-5 w-full")}>
                  Request a trip
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-xs text-ink-subtle">
            Fares shown are indicative starting prices. The final amount is set by the operator for
            each trip and displayed before payment.
          </p>
        </div>
      </section>

      {/* FLEET PLANS */}
      <section className="border-t border-line bg-surface px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
              Fleet plans
            </span>
            <h2 className="text-display text-3xl font-bold text-ink sm:text-4xl">
              For operators, hospitals &amp; dispatchers
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "flex flex-col rounded-2xl border bg-canvas p-7",
                  plan.featured
                    ? "border-brand-300 shadow-xl shadow-brand-500/10 lg:-mt-3 lg:pb-9"
                    : "border-line",
                )}
              >
                {plan.featured ? (
                  <span className="mb-3 inline-flex w-fit rounded-full bg-brand-500 px-3 py-0.5 text-[11px] font-semibold text-white">
                    Most popular
                  </span>
                ) : null}
                <h3 className="text-lg font-semibold text-ink">{plan.name}</h3>
                <p className="mt-1 text-sm text-ink-muted">{plan.tagline}</p>
                <p className="mt-5 flex items-baseline gap-1">
                  <span className="text-display text-4xl font-bold text-ink">{plan.price}</span>
                  <span className="text-sm text-ink-subtle">{plan.period}</span>
                </p>
                <ul className="mt-6 flex-1 space-y-3 border-t border-line pt-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-ink-muted">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.cta.href}
                  className={cn(buttonClass(plan.cta.variant), "mt-7 w-full")}
                >
                  {plan.cta.label}
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-8 flex items-center justify-center gap-2 text-center text-sm text-ink-muted">
            <Siren className="h-4 w-4 text-critical" aria-hidden="true" />
            Emergency dispatch itself is never gated behind a plan — help is always one request away.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
              FAQ
            </span>
            <h2 className="text-display text-3xl font-bold text-ink">Questions, answered</h2>
          </div>

          <div className="space-y-3">
            {FAQ.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-line bg-surface p-5 open:border-brand-200"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-ink">
                  {item.question}
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-sunken text-ink-muted transition-transform group-open:rotate-45">
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.answer}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-line bg-surface px-6 py-10 text-center">
            <h3 className="text-display text-2xl font-bold text-ink">Still deciding?</h3>
            <p className="max-w-md text-sm text-ink-muted">
              Try the full console instantly with a one-click demo login, or talk to us about a plan
              that fits your fleet.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/login" className={buttonClass("primary")}>
                Try a demo account
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/contact" className={buttonClass("secondary")}>
                Contact sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
