import type { Metadata } from "next";
import {
  Activity,
  Ambulance,
  ArrowRight,
  Baby,
  Building2,
  Clock,
  HeartPulse,
  Hospital,
  MapPin,
  Route,
  ShieldCheck,
  Siren,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

import { buttonClass } from "@/Utils/button";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Emergency and non-emergency ambulance services managed through MedRush — advanced life support, patient transfers, event medical standby and more.",
  openGraph: {
    title: "Ambulance services · MedRush",
    description:
      "Emergency and non-emergency ambulance services managed through MedRush, from advanced life support to inter-facility transfers.",
    type: "website",
    siteName: "MedRush",
  },
};

const SERVICES = [
  {
    icon: <Siren className="h-5 w-5" />,
    title: "Emergency response",
    description:
      "Round-the-clock dispatch for life-threatening emergencies, with critical cases prioritised the moment they arrive in the queue.",
    points: ["24/7 availability", "Priority triage", "Nearest-crew assignment"],
  },
  {
    icon: <HeartPulse className="h-5 w-5" />,
    title: "Advanced life support",
    description:
      "Equipped ambulances and trained crews for high-acuity patients who need monitoring and intervention on the way to hospital.",
    points: ["Cardiac & trauma ready", "Paramedic crew", "Direct hospital routing"],
  },
  {
    icon: <Ambulance className="h-5 w-5" />,
    title: "Basic life support",
    description:
      "Dependable transport for stable patients who still need supervision. Ideal for planned transfers and discharge journeys.",
    points: ["Stretcher & wheelchair", "Oxygen available", "Trained attendants"],
  },
  {
    icon: <Hospital className="h-5 w-5" />,
    title: "Inter-facility transfers",
    description:
      "Move patients between clinics and hospitals with a documented hand-off and a status timeline both teams can follow.",
    points: ["Scheduled or urgent", "Hospital directory", "Hand-off record"],
  },
  {
    icon: <Baby className="h-5 w-5" />,
    title: "Neonatal & paediatric",
    description:
      "Gentle, monitored transport for infants and children by crews experienced with smaller patients and specialist equipment.",
    points: ["Specialist equipment", "Paediatric crew", "Escort friendly"],
  },
  {
    icon: <Activity className="h-5 w-5" />,
    title: "Event medical standby",
    description:
      "On-site ambulance cover for concerts, marathons and corporate events, ready to respond without waiting for a 999 call.",
    points: ["On-site standby", "Crowd-ready teams", "Rapid egress"],
  },
];

const FLOW = [
  { icon: <MapPin className="h-4 w-4" />, title: "Request", text: "A patient submits pickup, contact and priority." },
  { icon: <Users className="h-4 w-4" />, title: "Assign", text: "A dispatcher attaches the nearest free crew." },
  { icon: <Route className="h-4 w-4" />, title: "Transport", text: "The trip updates live, en route to the hospital." },
  { icon: <ShieldCheck className="h-4 w-4" />, title: "Complete", text: "Hand-off is recorded and the fare is paid securely." },
];

export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden px-6 pb-20 pt-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand-100 opacity-40 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
            Services
          </span>
          <h1 className="text-display text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
            Ambulance services, coordinated end to end
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Whether it is a life-threatening emergency or a planned hospital transfer, MedRush gives
            every service the same thing: a clear request, the right crew, and a trackable trip.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/register" className={buttonClass("primary")}>
              Request an ambulance
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/pricing" className={buttonClass("secondary")}>
              See pricing
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICE CARDS */}
      <section className="border-t border-line bg-surface px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="group flex flex-col rounded-2xl border border-line bg-canvas p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/8"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-500 ring-1 ring-brand-100 transition-colors group-hover:bg-brand-500 group-hover:text-white group-hover:ring-brand-500">
                  {service.icon}
                </span>
                <h2 className="mt-4 text-base font-semibold text-ink">{service.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{service.description}</p>
                <ul className="mt-5 space-y-2 border-t border-line pt-4">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-xs text-ink-muted">
                      <Zap className="h-3.5 w-3.5 shrink-0 text-brand-500" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW A TRIP FLOWS */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
              Request to hand-off
            </span>
            <h2 className="text-display text-3xl font-bold text-ink sm:text-4xl">
              How every service runs
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FLOW.map((step, index) => (
              <div key={step.title} className="relative rounded-2xl border border-line bg-surface p-6">
                <span className="absolute right-5 top-5 text-display text-3xl font-bold text-line-strong">
                  {index + 1}
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-500 ring-1 ring-brand-100">
                  {step.icon}
                </span>
                <h3 className="mt-4 text-sm font-semibold text-ink">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT IS FOR */}
      <section className="bg-surface px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-3">
          {[
            {
              icon: <Users className="h-5 w-5" />,
              title: "For patients & families",
              text: "Raise a request in seconds, watch the ambulance approach on the trip page, and pay the fare online with a card.",
              cta: { href: "/register", label: "Create an account" },
            },
            {
              icon: <Ambulance className="h-5 w-5" />,
              title: "For fleet operators",
              text: "Manage your ambulances, drivers and hospitals, dispatch the queue, and track utilisation and earnings in one console.",
              cta: { href: "/contact", label: "Talk to us" },
            },
            {
              icon: <Building2 className="h-5 w-5" />,
              title: "For hospitals & clinics",
              text: "Book inter-facility transfers, keep a documented hand-off for every patient, and see arrival status in real time.",
              cta: { href: "/contact", label: "Talk to us" },
            },
          ].map((audience) => (
            <div key={audience.title} className="flex flex-col rounded-2xl border border-line bg-canvas p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-500 ring-1 ring-brand-100">
                {audience.icon}
              </span>
              <h3 className="mt-4 text-base font-semibold text-ink">{audience.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{audience.text}</p>
              <Link
                href={audience.cta.href}
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                {audience.cta.label}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 rounded-3xl border border-line bg-surface px-8 py-14 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 ring-1 ring-brand-100">
            <Clock className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="text-display text-3xl font-bold text-ink">Need a crew right now?</h2>
          <p className="max-w-md text-base text-ink-muted">
            Create your account and raise an emergency request — a dispatcher will assign the
            nearest available ambulance.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/register" className={buttonClass("primary")}>
              Request an ambulance
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/contact" className={buttonClass("secondary")}>
              Contact the team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
