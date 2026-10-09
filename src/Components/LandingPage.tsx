import {
  Activity,
  Ambulance,
  ArrowRight,
  CheckCircle2,
  Clock,
  Hospital,
  MapPin,
  Shield,
  Siren,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

import { buttonClass } from "@/Utils/button";

/* ─── feature card ───────────────────────────────────────────────────────────── */
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/8">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500 ring-1 ring-brand-100 transition-colors group-hover:bg-brand-500 group-hover:text-white group-hover:ring-brand-500">
        {icon}
      </span>
      <div>
        <h3 className="text-base font-semibold text-ink">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{description}</p>
      </div>
    </div>
  );
}

/* ─── step ───────────────────────────────────────────────────────────────────── */
function Step({
  number,
  title,
  description,
  isLast,
}: {
  number: number;
  title: string;
  description: string;
  isLast?: boolean;
}) {
  return (
    <div className="relative flex gap-5">
      {!isLast && (
        <div
          className="absolute left-5 top-12 h-full w-px bg-gradient-to-b from-brand-200 to-transparent"
          aria-hidden="true"
        />
      )}
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white shadow-lg shadow-brand-500/30">
        {number}
      </span>
      <div className="pb-10">
        <p className="font-semibold text-ink">{title}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{description}</p>
      </div>
    </div>
  );
}

/* ─── main component ─────────────────────────────────────────────────────────── */
export function LandingPage() {
  return (
    <>
      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-24 pt-20 text-center">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-brand-100 opacity-50 blur-[120px]" />
          <div className="absolute right-0 top-20 h-[400px] w-[400px] rounded-full bg-brand-200 opacity-25 blur-[100px]" />
          <div className="absolute -bottom-20 left-0 h-[300px] w-[300px] rounded-full bg-brand-50 opacity-60 blur-[80px]" />
        </div>

        <div className="relative mx-auto max-w-3xl animate-rise">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-brand-200/70 bg-brand-50/80 px-4 py-1.5 text-xs font-semibold text-brand-600 shadow-sm backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-critical opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-critical" />
            </span>
            Live emergency dispatch platform
          </div>

          <h1 className="text-display text-5xl font-bold leading-[1.1] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            Every second <span className="text-gradient">counts.</span>
            <br />
            <span className="text-ink-muted">Dispatch smarter.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-ink-muted">
            MedRush connects patients with the nearest available ambulance in seconds — giving
            dispatchers full real-time visibility over fleet, trips, and hospitals.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register" className={buttonClass("primary", "md", "px-7 py-3.5 text-sm")}>
              <Ambulance className="h-4 w-4" aria-hidden="true" />
              Request an ambulance
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/services" className={buttonClass("secondary", "md", "px-7 py-3.5 text-sm")}>
              Explore services
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-6 text-xs text-ink-subtle">
            {["No subscription needed", "Available 24 / 7", "Secure Stripe payments"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAPABILITY STRIP ───────────────────────────────────────────── */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-y divide-line md:grid-cols-4 md:divide-y-0">
          {[
            { icon: <Siren className="h-4 w-4" />, label: "Priority triage", value: "Critical → Low" },
            { icon: <MapPin className="h-4 w-4" />, label: "Live tracking", value: "Status timeline" },
            { icon: <Hospital className="h-4 w-4" />, label: "Hospital routing", value: "Partner directory" },
            { icon: <Shield className="h-4 w-4" />, label: "Role-based access", value: "3 secure roles" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1.5 px-6 py-7 text-center">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
                {item.icon}
              </span>
              <span className="text-sm font-semibold text-ink">{item.value}</span>
              <span className="text-xs text-ink-subtle">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────── */}
      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
              Features
            </span>
            <h2 className="text-display text-3xl font-bold text-ink sm:text-4xl">
              Built for speed &amp; clarity
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-ink-muted">
              Every feature of MedRush is designed around one goal: getting the right ambulance to
              the right patient as fast as possible.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Zap className="h-5 w-5" />}
              title="Instant dispatch"
              description="Assign the nearest available crew to a request in one click — no radio delays, no paper trail."
            />
            <FeatureCard
              icon={<MapPin className="h-5 w-5" />}
              title="Live fleet tracking"
              description="Monitor every ambulance as crews accept, go en route, arrive and complete each job."
            />
            <FeatureCard
              icon={<Hospital className="h-5 w-5" />}
              title="Hospital directory"
              description="A managed list of partner hospitals so dispatchers route each patient to the right facility."
            />
            <FeatureCard
              icon={<Activity className="h-5 w-5" />}
              title="Priority triage"
              description="Requests are colour-coded critical to low, so the highest-risk patients are never buried in a queue."
            />
            <FeatureCard
              icon={<Clock className="h-5 w-5" />}
              title="Trip timeline"
              description="A full audit trail for every trip — accepted, en route, arrived, completed — with timestamps."
            />
            <FeatureCard
              icon={<Shield className="h-5 w-5" />}
              title="Role-based access"
              description="Admins, dispatchers and patients each see only what they need, secured with rotating session tokens."
            />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-surface px-6 py-24">
        <div className="mx-auto grid max-w-5xl gap-16 md:grid-cols-2 md:items-start">
          <div>
            <span className="mb-3 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
              How it works
            </span>
            <h2 className="text-display mb-10 text-3xl font-bold text-ink">
              From call to care — <span className="text-gradient">in minutes</span>
            </h2>
            <Step
              number={1}
              title="Patient submits a request"
              description="From the patient portal, a request is created with location, priority and notes. It takes under 30 seconds."
            />
            <Step
              number={2}
              title="Dispatcher reviews &amp; assigns"
              description="The dispatch queue shows all live requests sorted by urgency. One click assigns the nearest free ambulance."
            />
            <Step
              number={3}
              title="Crew is alerted instantly"
              description="The assigned driver receives the call details and the trip status updates in real time for everyone."
            />
            <Step
              number={4}
              title="Patient transported &amp; fare paid"
              description="On arrival the crew closes the trip, the fare is settled through Stripe Checkout, and the record is archived."
              isLast
            />
          </div>

          {/* illustrative dispatch card */}
          <div className="panel-raised overflow-hidden">
            <div className="flex items-center gap-2.5 border-b border-line bg-surface-sunken px-5 py-3.5">
              <span className="h-2.5 w-2.5 rounded-full bg-critical animate-alarm" />
              <span className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
                Live dispatch — critical
              </span>
            </div>
            <div className="space-y-4 p-6">
              <div className="rounded-xl border border-critical/20 bg-critical-soft p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">Cardiac arrest — adult male</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
                      <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                      12 Main Street, Downtown
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-critical px-2 py-0.5 text-xs font-bold text-white">
                    CRITICAL
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-line p-4">
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-ink-subtle">
                  Nearest available
                </p>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-500 ring-1 ring-brand-100">
                    <Ambulance className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink">AMB-004</p>
                    <p className="text-xs text-ink-muted">ETA 4 min · Advanced life support</p>
                  </div>
                  <span className="rounded-md bg-low-soft px-2 py-0.5 text-xs font-semibold text-low">
                    Available
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-line p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-sunken text-ink-muted">
                  <Users className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">Driver: Karim Hassan</p>
                  <p className="text-xs text-ink-muted">Paramedic · Licence valid</p>
                </div>
              </div>

              <div className="w-full rounded-xl bg-brand-500 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-brand-500/25">
                Dispatch AMB-004
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROLES ──────────────────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
              One platform, three roles
            </span>
            <h2 className="text-display text-3xl font-bold text-ink sm:text-4xl">
              A tailored console for everyone
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: <Users className="h-5 w-5" />,
                title: "Patients",
                description:
                  "Raise an emergency request, watch the crew approach and pay the fare securely — all from one account.",
                href: "/register",
                cta: "Create an account",
              },
              {
                icon: <Siren className="h-5 w-5" />,
                title: "Dispatchers",
                description:
                  "Work the incoming queue, assign ambulances and drivers, and keep every trip moving to hand-off.",
                href: "/login",
                cta: "Open the console",
              },
              {
                icon: <Shield className="h-5 w-5" />,
                title: "Administrators",
                description:
                  "Manage users and roles, oversee the fleet, and monitor operations and revenue from one dashboard.",
                href: "/login",
                cta: "Open the console",
              },
            ].map((role) => (
              <div key={role.title} className="flex flex-col rounded-2xl border border-line bg-surface p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-500 ring-1 ring-brand-100">
                  {role.icon}
                </span>
                <h3 className="mt-4 text-base font-semibold text-ink">{role.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{role.description}</p>
                <Link
                  href={role.href}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  {role.cta}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-brand-400 px-8 py-16 text-center shadow-2xl shadow-brand-500/30">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white opacity-10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white opacity-10 blur-3xl" />
          </div>

          <h2 className="text-display relative text-3xl font-bold text-white sm:text-4xl">
            Ready to save lives faster?
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-base text-white/80">
            Create your free account and start dispatching in minutes. No complex setup — just a
            cleaner, faster way to respond to emergencies.
          </p>
          <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-brand-600 shadow-lg transition-all hover:bg-brand-50 hover:-translate-y-0.5 active:translate-y-0"
            >
              Create free account
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:-translate-y-0.5 active:translate-y-0"
            >
              Talk to our team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
