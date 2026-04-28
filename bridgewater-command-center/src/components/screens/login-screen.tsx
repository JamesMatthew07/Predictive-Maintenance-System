"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import {
  ArrowRight,
  Building2,
  Factory,
  Gauge,
  Loader2,
  LockKeyhole,
  Mail,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const workspaceFeatures = [
  {
    icon: Building2,
    label: "Four-plant visibility",
    description: "Detroit HQ, Warren, Eastaboga, and Lansing in one operating view.",
  },
  {
    icon: Gauge,
    label: "Predictive asset health",
    description: "Risk windows, telemetry drift, and action priority stay connected to plant context.",
  },
  {
    icon: Sparkles,
    label: "Grounded AI support",
    description: "AI explanations stay tied to asset signals, alerts, and maintenance actions.",
  },
];

const plantChips = ["Detroit HQ", "Warren", "Eastaboga", "Lansing"];

function isValidWorkspaceEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("alex.ops@bridgewater-interiors.com");
  const [password, setPassword] = useState("warren72");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!isValidWorkspaceEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      router.push("/portfolio");
    }, 420);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[color:var(--surface-0)] text-[color:var(--brand-ink)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(111,177,200,0.18),transparent_30%),radial-gradient(circle_at_76%_12%,rgba(18,40,76,0.10),transparent_26%),linear-gradient(120deg,rgba(255,255,255,0.86),rgba(237,242,243,0.72))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(18,40,76,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(18,40,76,0.055)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="pointer-events-none absolute -top-24 right-[-12%] h-[520px] w-[520px] rounded-full border border-white/70 bg-white/32 blur-3xl" />

      <section className="relative mx-auto grid min-h-screen w-full max-w-[1500px] items-center gap-10 px-5 py-8 md:px-10 lg:grid-cols-[1.12fr_0.88fr] lg:px-14">
        <div className="fade-in-up max-w-4xl">
          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-[1.2rem] bg-[color:var(--brand-navy)] px-4 py-3 shadow-[0_28px_80px_-48px_rgba(18,40,76,0.72)]">
              <Image
                src="/brand/bridgewater-logo-white.png"
                alt="Bridgewater Interiors"
                width={170}
                height={46}
                priority
                className="h-auto w-[146px]"
              />
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-[0.32em] text-muted-foreground uppercase">
                Predictive maintenance access
              </p>
              <p className="mt-2 text-lg font-medium tracking-[-0.03em]">
                Bridgewater Asset Health Console
              </p>
            </div>
          </div>

          <div className="mt-14 max-w-3xl space-y-5">
            <div className="inline-flex rounded-full border border-border/70 bg-white/70 px-4 py-2 text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase backdrop-blur">
              Protected operations workspace
            </div>
            <h1 className="text-5xl font-medium leading-[0.96] tracking-[-0.065em] md:text-7xl">
              Sign in to the Bridgewater command center.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              Access plant health, work-order dispatch, and grounded AI explanations from a
              Bridgewater-branded command workspace.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {plantChips.map((plant) => (
              <span
                key={plant}
                className="rounded-full border border-border/70 bg-white/74 px-4 py-2 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase"
              >
                {plant}
              </span>
            ))}
          </div>

          <div className="mt-10 max-w-3xl divide-y divide-border/70 border-y border-border/70">
            {workspaceFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <div key={feature.label} className="grid gap-4 py-4 sm:grid-cols-[44px_1fr]">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/78 text-[color:var(--brand-navy)] shadow-[0_18px_50px_-34px_rgba(18,40,76,0.45)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium tracking-[-0.02em]">{feature.label}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="fade-in-up mx-auto w-full max-w-[460px] lg:justify-self-end">
          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-[1.6rem] border border-border/70 bg-white/86 shadow-[0_30px_110px_-70px_rgba(18,40,76,0.5)] backdrop-blur-xl"
          >
            <div className="space-y-4 border-b border-border/70 px-6 py-6">
              <div className="flex items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white px-3 py-1.5 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  <ShieldCheck className="h-3.5 w-3.5 text-[color:var(--brand-sky)]" />
                  Secure access
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">RW-WAR-01</span>
              </div>
              <div>
                <h2 className="text-2xl font-medium tracking-[-0.045em]">
                  Enter asset health workspace
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Enter your workspace credentials to continue.
                </p>
              </div>
            </div>

            <div className="space-y-4 px-6 py-6">
              <label className="block space-y-2">
                <span className="text-sm font-medium">Email</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="pl-10"
                    placeholder="operator@example.com"
                    autoComplete="email"
                    aria-invalid={error.includes("email")}
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium">Password</span>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="pl-10"
                    placeholder="Minimum 6 characters"
                    autoComplete="current-password"
                    aria-invalid={error.includes("password")}
                  />
                </div>
              </label>

              {error ? (
                <p className="rounded-xl border border-[color:rgba(199,70,52,0.18)] bg-[color:rgba(199,70,52,0.08)] px-3 py-2 text-sm text-[color:var(--critical)]">
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-2xl bg-[color:var(--brand-navy)] text-white shadow-[0_18px_42px_-26px_rgba(18,40,76,0.72)] hover:bg-[color:var(--brand-ink)]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Opening workspace
                  </>
                ) : (
                  <>
                    Enter command center
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-5 grid gap-3 rounded-[1.4rem] border border-border/60 bg-white/56 px-5 py-4 backdrop-blur md:grid-cols-2">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-[color:var(--brand-sky)]" />
              <span className="text-sm text-muted-foreground">Primary story: Warren thermal drift</span>
            </div>
            <div className="flex items-center gap-3 md:justify-end">
              <Factory className="h-4 w-4 text-[color:var(--brand-sky)]" />
              <span className="text-sm text-muted-foreground">Asset health workspace</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
