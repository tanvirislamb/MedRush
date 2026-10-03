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
} from "lucide-react";
import Link from "next/link";

/* ─── stat card ─────────────────────────────────────────────────────────── */
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-8 py-6">
      <span className="text-display text-4xl font-bold text-brand-800">{value}</span>
      <span className="text-sm text-ink-muted">{label}</span>
    </div>
  );
}

/* ─── feature card ───────────────────────────────────────────────────────── */
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
    <div className="panel-raised flex flex-col gap-4 p-6 transition-shadow duration-200 hover:shadow-lg">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
        {icon}
      </span>
      <div>
        <h3 className="text-display text-base font-semibold text-ink">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{description}</p>
      </div>
    </div>
  );
}

/* ─── step ───────────────────────────────────────────────────────────────── */
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
      {/* vertical connector */}
      {!isLast && (
        <div className="absolute left-5 top-12 h-full w-px bg-line" aria-hidden="true" />
      )}
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-800 text-sm font-bold text-ink-invert">
        {number}
      </span>
      <div className="pb-10">
        <p className="font-semibold text-ink">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">{description}</p>
      </div>
    </div>
  );
}

/* ─── main component ─────────────────────────────────────────────────────── */
export function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-line bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          {/* logo */}
          <Link href="/" className="flex items-center gap-2.5" aria-label="MedRush home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-800 text-ink-invert animate-alarm">
              <Ambulance className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <span className="text-display text-xl font-semibold text-ink">MedRush</span>
          </Link>

          {/* nav links */}
          <nav className="hidden items-center gap-6 md:flex" aria-label="Site navigation">
            <a href="#features" className="text-sm text-ink-muted transition-colors hover:text-ink">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-ink-muted transition-colors hover:text-ink">
              How it works
            </a>
            <a href="#contact" className="text-sm text-ink-muted transition-colors hover:text-ink">
              Contact
            </a>
          </nav>

          {/* auth links */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              id="nav-login-btn"
              className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              id="nav-register-btn"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-800 px-4 py-2 text-sm font-semibold text-ink-invert transition-colors hover:bg-brand-700 active:bg-brand-900"
            >
              Get started
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-6 pb-24 pt-20 text-center">
          {/* decorative radial glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-start justify-center"
          >
            <div className="h-[520px] w-[900px] rounded-full bg-brand-100 opacity-40 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-3xl animate-rise">
            {/* pill badge */}
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-semibold text-brand-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-critical opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-critical" />
              </span>
              Live emergency dispatch platform
            </span>

            <h1 className="text-display text-5xl font-bold leading-tight text-ink sm:text-6xl">
              Every second counts.{" "}
              <span className="text-brand-700">Dispatch smarter.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
              MedRush connects patients with the nearest available ambulance in seconds — giving
              dispatchers full real-time visibility over fleet, trips, and hospitals.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                id="hero-register-btn"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-800 px-6 py-3.5 text-sm font-semibold text-ink-invert shadow-lg shadow-brand-900/20 transition-all hover:bg-brand-700 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Ambulance className="h-4 w-4" aria-hidden="true" />
                Request an ambulance
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/login"
                id="hero-login-btn"
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-6 py-3.5 text-sm font-semibold text-ink transition-all hover:bg-surface-sunken hover:-translate-y-0.5 active:translate-y-0"
              >
                Dispatcher login
              </Link>
            </div>

            {/* trust line */}
            <p className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs text-ink-subtle">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                No subscription needed
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                Available 24 / 7
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                Secure &amp; encrypted
              </span>
            </p>
          </div>
        </section>

        {/* ── STATS ────────────────────────────────────────────────────── */}
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

        {/* ── FEATURES ─────────────────────────────────────────────────── */}
        <section id="features" className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 text-center">
              <h2 className="text-display text-3xl font-bold text-ink sm:text-4xl">
                Built for speed &amp; clarity
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-base text-ink-muted">
                Every feature of MedRush is designed around one goal: getting the right ambulance
                to the right patient as fast as possible.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Zap className="h-6 w-6" />}
                title="Instant Dispatch"
                description="One-click dispatch assigns the nearest available crew and notifies the driver in real time — no radio delays."
              />
              <FeatureCard
                icon={<MapPin className="h-6 w-6" />}
                title="Live Fleet Tracking"
                description="Monitor every ambulance on the map. Statuses update automatically as crews accept, en route, or complete jobs."
              />
              <FeatureCard
                icon={<Hospital className="h-6 w-6" />}
                title="Hospital Directory"
                description="Integrated list of partner hospitals with capacity and speciality info so dispatchers route patients correctly."
              />
              <FeatureCard
                icon={<Activity className="h-6 w-6" />}
                title="Priority Triage"
                description="Requests are colour-coded critical → low so the highest-risk patients are never buried in a queue."
              />
              <FeatureCard
                icon={<Clock className="h-6 w-6" />}
                title="Trip Timeline"
                description="Full audit trail for every trip — accepted, en-route, arrived, completed — with timestamps for accountability."
              />
              <FeatureCard
                icon={<Shield className="h-6 w-6" />}
                title="Role-Based Access"
                description="Admins, dispatchers, and patients each see only what they need. JWT-secured with refresh token rotation."
              />
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
        <section id="how-it-works" className="bg-surface px-6 py-24">
          <div className="mx-auto grid max-w-5xl gap-16 md:grid-cols-2 md:items-start">
            {/* steps */}
            <div>
              <h2 className="text-display mb-10 text-3xl font-bold text-ink">
                From call to care — in minutes
              </h2>
              <Step
                number={1}
                title="Patient submits a request"
                description="Using MedRush's patient portal, a request is created with location, priority, and notes. Takes under 30 seconds."
              />
              <Step
                number={2}
                title="Dispatcher reviews &amp; assigns"
                description="The dispatcher console shows all live requests sorted by urgency. A single click assigns the nearest free ambulance."
              />
              <Step
                number={3}
                title="Crew is alerted instantly"
                description="The assigned driver receives the call details and begins navigating. Their status updates in real time on the map."
              />
              <Step
                number={4}
                title="Patient transported &amp; trip closed"
                description="On arrival the crew marks the trip complete. Payment is processed and the full record is archived for review."
                isLast
              />
            </div>

            {/* visual card */}
            <div className="panel-raised overflow-hidden">
              {/* mock dispatch card */}
              <div className="border-b border-line bg-surface-sunken px-5 py-3.5 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-critical animate-alarm" />
                <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Live dispatch — critical request
                </span>
              </div>
              <div className="space-y-4 p-6">
                {/* request row */}
                <div className="rounded-xl border border-critical-soft bg-critical-soft p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-ink">Cardiac arrest — adult male</p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
                        <MapPin className="h-3 w-3" aria-hidden="true" />
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
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-subtle mb-2">
                    Nearest available
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                      <Ambulance className="h-4.5 w-4.5" aria-hidden="true" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink">AMB-004</p>
                      <p className="text-xs text-ink-muted">ETA 4 min · Dr. Rahman on crew</p>
                    </div>
                    <span className="rounded-md bg-low-soft px-2 py-0.5 text-xs font-semibold text-low">
                      Available
                    </span>
                  </div>
                </div>

                {/* driver details */}
                <div className="rounded-xl border border-line p-4 flex items-center gap-3">
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
                  className="w-full rounded-xl bg-brand-800 py-3 text-sm font-semibold text-ink-invert opacity-90 cursor-default"
                >
                  Dispatch AMB-004
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ───────────────────────────────────────────────── */}
        <section id="contact" className="px-6 py-24">
          <div className="mx-auto max-w-3xl rounded-2xl bg-brand-800 px-8 py-14 text-center shadow-xl shadow-brand-900/30">
            <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-700">
              <Phone className="h-7 w-7 text-ink-invert" aria-hidden="true" />
            </span>
            <h2 className="text-display text-3xl font-bold text-ink-invert sm:text-4xl">
              Ready to save lives faster?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-brand-200">
              Create your free account and start dispatching in minutes. No complex setup — just
              a cleaner, faster way to respond to emergencies.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                id="cta-register-btn"
                className="inline-flex items-center gap-2 rounded-xl bg-ink-invert px-6 py-3.5 text-sm font-bold text-brand-800 shadow transition-all hover:bg-brand-50 hover:-translate-y-0.5 active:translate-y-0"
              >
                Create free account
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/login"
                id="cta-login-btn"
                className="inline-flex items-center gap-2 rounded-xl border border-brand-600 px-6 py-3.5 text-sm font-semibold text-brand-100 transition-all hover:bg-brand-700 hover:-translate-y-0.5 active:translate-y-0"
              >
                Sign in to console
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-line bg-surface px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-800 text-ink-invert">
              <Ambulance className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span className="text-display text-sm font-semibold text-ink">MedRush</span>
          </div>
          <p className="text-xs text-ink-subtle">
            &copy; {new Date().getFullYear()} MedRush · Emergency Ambulance Dispatch System
          </p>
          <div className="flex items-center gap-5">
            <Link href="/login" className="text-xs text-ink-muted hover:text-ink transition-colors">
              Sign in
            </Link>
            <Link href="/register" className="text-xs text-ink-muted hover:text-ink transition-colors">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
