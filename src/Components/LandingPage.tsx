"use client";

import {
  Ambulance,
  ArrowRight,
  Clock,
  Hospital,
  MapPin,
  Shield,
  Activity,
  Users,
  Zap,
  CheckCircle2,
  Phone,
  ChevronRight,
  Star,
} from "lucide-react";
import Link from "next/link";

/* ─── stat card ─────────────────────────────────────────────────────────────── */
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-8 py-8">
      <span className="text-display text-4xl font-bold text-brand-500">{value}</span>
      <span className="text-sm text-ink-muted">{label}</span>
    </div>
  );
}

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
        <div className="absolute left-5 top-12 h-full w-px bg-gradient-to-b from-brand-200 to-transparent" aria-hidden="true" />
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

/* ─── testimonial ────────────────────────────────────────────────────────────── */
function Testimonial({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-brand-400 text-brand-400" />
        ))}
      </div>
      <p className="text-sm leading-relaxed text-ink-muted">"{quote}"</p>
      <div>
        <p className="text-sm font-semibold text-ink">{name}</p>
        <p className="text-xs text-ink-subtle">{role}</p>
      </div>
    </div>
  );
}

/* ─── main component ─────────────────────────────────────────────────────────── */
export function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      {/* ── NAV ────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-line/60 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          {/* logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="MedRush home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white shadow-md shadow-brand-500/30 transition-transform group-hover:scale-105 animate-alarm">
              <Ambulance className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <span className="text-lg font-bold tracking-tight text-ink">MedRush</span>
          </Link>

          {/* nav links */}
          <nav className="hidden items-center gap-7 md:flex" aria-label="Site navigation">
            {["Features", "How it works", "Contact"].map((label, i) => (
              <a
                key={label}
                href={`#${["features", "how-it-works", "contact"][i]}`}
                className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* auth links */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              id="nav-login-btn"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              id="nav-register-btn"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-500/20 transition-all hover:bg-brand-600 hover:shadow-md hover:shadow-brand-500/25 active:bg-brand-700"
            >
              Get started
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ── HERO ───────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-6 pb-28 pt-24 text-center">
          {/* background mesh gradient */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-brand-100 opacity-50 blur-[120px]" />
            <div className="absolute right-0 top-20 h-[400px] w-[400px] rounded-full bg-brand-200 opacity-25 blur-[100px]" />
            <div className="absolute -bottom-20 left-0 h-[300px] w-[300px] rounded-full bg-brand-50 opacity-60 blur-[80px]" />
          </div>

          <div className="relative mx-auto max-w-3xl animate-rise">
            {/* pill badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-brand-200/70 bg-brand-50/80 px-4 py-1.5 text-xs font-semibold text-brand-600 shadow-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-critical opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-critical" />
              </span>
              Live emergency dispatch platform
            </div>

            <h1 className="text-display text-5xl font-bold leading-[1.1] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Every second{" "}
              <span className="relative">
                <span className="text-gradient">counts.</span>
              </span>
              <br />
              <span className="text-ink-muted">Dispatch smarter.</span>
            </h1>

            <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-ink-muted">
              MedRush connects patients with the nearest available ambulance in seconds — giving
              dispatchers full real-time visibility over fleet, trips, and hospitals.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                id="hero-register-btn"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-600 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-500/30 active:translate-y-0"
              >
                <Ambulance className="h-4 w-4" aria-hidden="true" />
                Request an ambulance
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/login"
                id="hero-login-btn"
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-7 py-3.5 text-sm font-semibold text-ink shadow-sm transition-all hover:border-brand-200 hover:bg-brand-50 hover:-translate-y-0.5 active:translate-y-0"
              >
                Dispatcher login
              </Link>
            </div>

            {/* trust badges */}
            <div className="mt-9 flex flex-wrap items-center justify-center gap-6 text-xs text-ink-subtle">
              {[
                "No subscription needed",
                "Available 24 / 7",
                "Secure & encrypted",
              ].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" aria-hidden="true" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS ──────────────────────────────────────────────────────── */}
        <section className="border-y border-line bg-surface">
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-2 divide-x divide-line md:grid-cols-4">
              <StatCard value="< 8 min" label="Avg. response time" />
              <StatCard value="200+" label="Ambulances managed" />
              <StatCard value="50+" label="Partner hospitals" />
              <StatCard value="99.9%" label="Platform uptime" />
            </div>
          </div>
        </section>

        {/* ── FEATURES ───────────────────────────────────────────────────── */}
        <section id="features" className="px-6 py-28">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <span className="mb-3 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
                Features
              </span>
              <h2 className="text-display text-3xl font-bold text-ink sm:text-4xl">
                Built for speed & clarity
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-base text-ink-muted">
                Every feature of MedRush is designed around one goal: getting the right ambulance
                to the right patient as fast as possible.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Zap className="h-5 w-5" />}
                title="Instant Dispatch"
                description="One-click dispatch assigns the nearest available crew and notifies the driver in real time — no radio delays."
              />
              <FeatureCard
                icon={<MapPin className="h-5 w-5" />}
                title="Live Fleet Tracking"
                description="Monitor every ambulance on the map. Statuses update automatically as crews accept, en route, or complete jobs."
              />
              <FeatureCard
                icon={<Hospital className="h-5 w-5" />}
                title="Hospital Directory"
                description="Integrated list of partner hospitals with capacity and speciality info so dispatchers route patients correctly."
              />
              <FeatureCard
                icon={<Activity className="h-5 w-5" />}
                title="Priority Triage"
                description="Requests are colour-coded critical → low so the highest-risk patients are never buried in a queue."
              />
              <FeatureCard
                icon={<Clock className="h-5 w-5" />}
                title="Trip Timeline"
                description="Full audit trail for every trip — accepted, en-route, arrived, completed — with timestamps for accountability."
              />
              <FeatureCard
                icon={<Shield className="h-5 w-5" />}
                title="Role-Based Access"
                description="Admins, dispatchers, and patients each see only what they need. JWT-secured with refresh token rotation."
              />
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ───────────────────────────────────────────────── */}
        <section id="how-it-works" className="bg-surface px-6 py-28">
          <div className="mx-auto grid max-w-5xl gap-16 md:grid-cols-2 md:items-start">
            {/* steps */}
            <div>
              <span className="mb-3 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
                How it works
              </span>
              <h2 className="text-display mb-10 text-3xl font-bold text-ink">
                From call to care —{" "}
                <span className="text-gradient">in minutes</span>
              </h2>
              <Step
                number={1}
                title="Patient submits a request"
                description="Using MedRush's patient portal, a request is created with location, priority, and notes. Takes under 30 seconds."
              />
              <Step
                number={2}
                title="Dispatcher reviews & assigns"
                description="The dispatcher console shows all live requests sorted by urgency. A single click assigns the nearest free ambulance."
              />
              <Step
                number={3}
                title="Crew is alerted instantly"
                description="The assigned driver receives the call details and begins navigating. Their status updates in real time on the map."
              />
              <Step
                number={4}
                title="Patient transported & trip closed"
                description="On arrival the crew marks the trip complete. Payment is processed and the full record is archived for review."
                isLast
              />
            </div>

            {/* mock dispatch card */}
            <div className="panel-raised overflow-hidden">
              <div className="flex items-center gap-2.5 border-b border-line bg-surface-sunken px-5 py-3.5">
                <span className="h-2.5 w-2.5 rounded-full bg-critical animate-alarm" />
                <span className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
                  Live dispatch — critical
                </span>
              </div>
              <div className="space-y-4 p-6">
                {/* critical request */}
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

                {/* ambulance row */}
                <div className="rounded-xl border border-line p-4">
                  <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-ink-subtle">
                    Nearest available
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-500 ring-1 ring-brand-100">
                      <Ambulance className="h-4.5 w-4.5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-ink">AMB-004</p>
                      <p className="text-xs text-ink-muted">ETA 4 min · Dr. Rahman on crew</p>
                    </div>
                    <span className="rounded-md bg-low-soft px-2 py-0.5 text-xs font-semibold text-low">
                      Available
                    </span>
                  </div>
                </div>

                {/* driver */}
                <div className="flex items-center gap-3 rounded-xl border border-line p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-sunken text-ink-muted">
                    <Users className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">Driver: Karim Hassan</p>
                    <p className="text-xs text-ink-muted">Paramedic · License valid</p>
                  </div>
                </div>

                {/* dispatch button mock */}
                <button
                  disabled
                  aria-hidden="true"
                  className="w-full rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 opacity-90 cursor-default"
                >
                  Dispatch AMB-004
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ───────────────────────────────────────────────── */}
        <section className="px-6 py-28">
          <div className="mx-auto max-w-5xl">
            <div className="mb-14 text-center">
              <span className="mb-3 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
                Trusted by teams
              </span>
              <h2 className="text-display text-3xl font-bold text-ink">
                What our users say
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <Testimonial
                quote="MedRush cut our average response time by 40%. The dispatch queue is incredibly intuitive."
                name="Dr. Nadia Islam"
                role="Senior Dispatcher, Dhaka Central"
              />
              <Testimonial
                quote="I submitted my request in under a minute. The ambulance arrived before I even hung up."
                name="Rafiqul Hasan"
                role="Patient"
              />
              <Testimonial
                quote="The role-based access means our drivers only see what's relevant. Zero noise, all signal."
                name="Amina Begum"
                role="Fleet Administrator"
              />
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ─────────────────────────────────────────────────── */}
        <section id="contact" className="px-6 pb-28">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-brand-400 px-8 py-16 text-center shadow-2xl shadow-brand-500/30">
            {/* glow orbs */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white opacity-10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white opacity-10 blur-3xl" />
            </div>

            <span className="relative mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
              <Phone className="h-7 w-7 text-white" aria-hidden="true" />
            </span>
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
                id="cta-register-btn"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-brand-600 shadow-lg transition-all hover:bg-brand-50 hover:-translate-y-0.5 active:translate-y-0"
              >
                Create free account
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/login"
                id="cta-login-btn"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:-translate-y-0.5 active:translate-y-0"
              >
                Sign in to console
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-line bg-surface px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
              <Ambulance className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-bold tracking-tight text-ink">MedRush</span>
          </div>
          <p className="text-xs text-ink-subtle">
            &copy; {new Date().getFullYear()} MedRush · Emergency Ambulance Dispatch System
          </p>
          <div className="flex items-center gap-5">
            <Link href="/login" className="text-xs text-ink-muted transition-colors hover:text-ink">
              Sign in
            </Link>
            <Link href="/register" className="text-xs text-ink-muted transition-colors hover:text-ink">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
