import type { Metadata } from "next";
import { AlertTriangle, Clock, Mail, MapPin, MessageSquare, Phone, Siren } from "lucide-react";

import { ContactForm } from "@/Components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the MedRush team for support, fleet onboarding or partnerships — and find the emergency numbers to call in a crisis.",
  openGraph: {
    title: "Contact MedRush",
    description:
      "Reach the MedRush team for support, fleet onboarding or partnerships. In a medical emergency, always call 999.",
    type: "website",
    siteName: "MedRush",
  },
};

const CHANNELS = [
  {
    icon: <Phone className="h-5 w-5" />,
    label: "Support line",
    value: "+880 1700 000000",
    hint: "Mon–Fri, 9am–6pm",
    href: "tel:+8801700000000",
  },
  {
    icon: <Mail className="h-5 w-5" />,
    label: "Email",
    value: "hello@medrush.com",
    hint: "We reply within one business day",
    href: "mailto:hello@medrush.com",
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    label: "Head office",
    value: "Level 6, Gulshan Avenue, Dhaka 1212",
    hint: "Bangladesh",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    label: "Operations",
    value: "Dispatch runs 24 / 7",
    hint: "Emergency cover never closes",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden px-6 pb-16 pt-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand-100 opacity-40 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="mb-4 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
            Contact
          </span>
          <h1 className="text-display text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl">
            Talk to the MedRush team
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Questions about the platform, onboarding a fleet or partnering with us? Send a message
            and the right person will get back to you.
          </p>
        </div>
      </section>

      {/* EMERGENCY BANNER */}
      <section className="px-6 pb-12">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-4 rounded-2xl border border-critical/20 bg-critical-soft px-6 py-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-critical text-white">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">This form is not for emergencies.</p>
            <p className="mt-0.5 text-sm text-ink-muted">
              If someone needs urgent medical help right now, call the emergency services
              immediately.
            </p>
          </div>
          <a
            href="tel:999"
            className="inline-flex items-center gap-2 rounded-xl bg-critical px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-critical/90"
          >
            <Siren className="h-4 w-4" aria-hidden="true" />
            Call 999
          </a>
        </div>
      </section>

      {/* CHANNELS + FORM */}
      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <h2 className="text-display text-2xl font-bold text-ink">Contact details</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Prefer to reach us directly? Use any of the channels below.
            </p>

            <div className="mt-6 space-y-3">
              {CHANNELS.map((channel) => {
                const inner = (
                  <>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500 ring-1 ring-brand-100">
                      {channel.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                        {channel.label}
                      </span>
                      <span className="mt-0.5 block text-sm font-medium text-ink">{channel.value}</span>
                      {channel.hint ? (
                        <span className="mt-0.5 block text-xs text-ink-subtle">{channel.hint}</span>
                      ) : null}
                    </span>
                  </>
                );

                return channel.href ? (
                  <a
                    key={channel.label}
                    href={channel.href}
                    className="flex items-start gap-4 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-brand-200 hover:bg-brand-50/50"
                  >
                    {inner}
                  </a>
                ) : (
                  <div
                    key={channel.label}
                    className="flex items-start gap-4 rounded-2xl border border-line bg-surface p-4"
                  >
                    {inner}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-line bg-surface-sunken p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <MessageSquare className="h-4 w-4 text-brand-500" aria-hidden="true" />
                Onboarding a fleet or hospital?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                Tell us how many ambulances you run and where you operate. We&apos;ll help you set
                up dispatchers, drivers and hospital routes.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-8">
            <h2 className="text-display text-2xl font-bold text-ink">Send us a message</h2>
            <p className="mt-2 text-sm text-ink-muted">
              Fill in the form and we&apos;ll get back to you by email.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
