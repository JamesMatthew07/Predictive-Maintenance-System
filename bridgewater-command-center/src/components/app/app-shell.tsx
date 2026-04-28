"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Building2,
  ChevronDown,
  Clock3,
  Gauge,
  HardHat,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { useDemo } from "@/components/providers/demo-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { assets } from "@/lib/mock-data";
import { NOW_ISO } from "@/lib/engine/demo-engine";
import { formatTimestamp, titleCase } from "@/lib/utils";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/portfolio", label: "Portfolio", icon: Building2 },
  { href: "/executive", label: "Executive", icon: LayoutDashboard },
  { href: "/operations", label: "Operations", icon: Gauge },
  { href: "/maintenance", label: "Maintenance", icon: ShieldCheck },
  { href: "/technician", label: "Technician", icon: HardHat },
] as const;
type DemoScenario = ReturnType<typeof useDemo>["scenarios"][number];
type DemoPlants = ReturnType<typeof useDemo>["plants"];

function ShellNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-[1rem] px-3 py-2.5 text-sm transition-all",
              active
                ? "bg-white/12 text-white shadow-[0_12px_48px_-28px_rgba(255,255,255,0.6)]"
                : "text-white/72 hover:bg-white/8 hover:text-white",
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function MobileNavigation() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full border border-white/10 bg-white/6 text-white hover:bg-white/10 hover:text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[320px] border-none bg-[color:var(--brand-navy)] p-0 text-white">
        <div className="flex h-full flex-col">
          <div className="border-b border-white/10 px-5 py-5">
            <Image
              src="/brand/bridgewater-logo-white.png"
              alt="Bridgewater Interiors"
              width={168}
              height={44}
              className="h-auto w-[150px]"
              priority
            />
          </div>
          <ScrollArea className="flex-1 px-4 py-5">
            <ShellNavigation />
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function getScenarioMeta(
  scenario: DemoScenario,
  plants: DemoPlants,
) {
  if (!scenario.heroPlantId) {
    return "All plants visible | healthy reference state";
  }

  const plant = plants.find((entry) => entry.id === scenario.heroPlantId);
  const asset = scenario.heroAssetId
    ? assets.find((entry) => entry.id === scenario.heroAssetId)
    : undefined;
  const riskBand = scenario.heroAssetId
    ? scenario.assetStates[scenario.heroAssetId]?.riskBand
    : undefined;

  return [plant?.name, asset ? titleCase(asset.assetType) : undefined, riskBand ? titleCase(riskBand) : undefined]
    .filter(Boolean)
    .join(" | ");
}

function TopBar() {
  const { state, snapshot, scenarios, plants, setPlantId, setScenarioId, setWindow, resetDemo } =
    useDemo();
  const pathname = usePathname();
  const router = useRouter();
  const currentScenario =
    scenarios.find((scenario) => scenario.id === state.scenarioId) ?? snapshot.scenario;
  const baselineScenario = scenarios.find((scenario) => !scenario.heroPlantId);
  const incidentScenarios = scenarios.filter((scenario) => scenario.heroPlantId);
  const currentScenarioMeta = getScenarioMeta(currentScenario, plants);
  const handlePlantSelect = (plantId: string) => {
    const plantScenario = scenarios.find((scenario) => scenario.heroPlantId === plantId);

    if (plantScenario) {
      setScenarioId(plantScenario.id);
    } else {
      setPlantId(plantId);
    }

    if (pathname.startsWith("/plants/")) {
      router.push(`/plants/${plantId}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-[color:rgba(247,249,249,0.94)] backdrop-blur-xl">
      <div className="flex flex-col gap-3 px-4 py-3 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <MobileNavigation />
            <div className="space-y-1">
              <p className="text-[10px] font-semibold tracking-[0.24em] text-[color:var(--brand-sky)] uppercase">
                Bridgewater Interiors
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h2 className="text-base font-medium text-[color:var(--brand-ink)] md:text-lg">
                  Predictive Maintenance Command Center
                </h2>
                <span className="font-mono text-xs text-muted-foreground">
                  {snapshot.heroAsset?.code ?? "Portfolio"}
                </span>
              </div>
            </div>
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-white/80 px-3 py-2 text-xs text-muted-foreground">
                  <Clock3 className="h-3.5 w-3.5 text-[color:var(--brand-sky)]" />
                  <span>Last refresh</span>
                  <span className="font-mono text-[color:var(--brand-ink)]">{formatTimestamp(NOW_ISO)}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Fixed demo refresh time for deterministic walkthroughs.</TooltipContent>
            </Tooltip>
            <Button
              variant="outline"
              className="h-9 gap-2 rounded-xl border-border/60 bg-white/80 px-3 shadow-none hover:bg-white"
              onClick={resetDemo}
            >
              <RefreshCw className="h-4 w-4 text-[color:var(--brand-sky)]" />
              Reset Demo
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-border/50 pt-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-11 w-full min-w-[280px] justify-between rounded-xl border-border/60 bg-white/82 px-3 shadow-none transition-colors hover:bg-white sm:w-[380px]"
              >
                <div className="min-w-0 text-left">
                  <p className="truncate text-sm font-medium text-[color:var(--brand-ink)]">
                    {currentScenario.name}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {currentScenarioMeta}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              sideOffset={8}
              className="w-[360px] rounded-[1.2rem] border-border/70 bg-white/96 p-1.5 shadow-[0_18px_60px_-32px_rgba(18,40,76,0.28)]"
            >
              <DropdownMenuRadioGroup value={state.scenarioId} onValueChange={setScenarioId}>
                {baselineScenario ? (
                  <>
                    <DropdownMenuLabel className="px-3 pt-2 pb-1 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                      Baseline
                    </DropdownMenuLabel>
                    <DropdownMenuRadioItem
                      key={baselineScenario.id}
                      value={baselineScenario.id}
                      className="rounded-xl py-2.5 pr-3 pl-8"
                    >
                      <div className="grid gap-0.5">
                        <span className="font-medium text-[color:var(--brand-ink)]">
                          {baselineScenario.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {getScenarioMeta(baselineScenario, plants)}
                        </span>
                      </div>
                    </DropdownMenuRadioItem>
                  </>
                ) : null}
                {baselineScenario ? <DropdownMenuSeparator className="my-1.5" /> : null}
                <DropdownMenuLabel className="px-3 pt-1 pb-1 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  Incident Scenarios
                </DropdownMenuLabel>
                {incidentScenarios.map((scenario) => (
                  <DropdownMenuRadioItem
                    key={scenario.id}
                    value={scenario.id}
                    className="rounded-xl py-2.5 pr-3 pl-8"
                  >
                    <div className="grid gap-0.5">
                      <span className="font-medium text-[color:var(--brand-ink)]">
                        {scenario.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {getScenarioMeta(scenario, plants)}
                      </span>
                    </div>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-11 w-[150px] justify-between rounded-xl border-border/60 bg-white/82 px-3 shadow-none transition-colors hover:bg-white"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-[color:var(--brand-sky)]" />
                  <span className="truncate text-sm text-[color:var(--brand-ink)]">
                    {snapshot.selectedPlant.name}
                  </span>
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              sideOffset={8}
              className="w-48 rounded-[1rem] border-border/70 bg-white/96 p-1.5"
            >
              {plants.map((plant) => (
                <DropdownMenuItem
                  key={plant.id}
                  className={cn(
                    "rounded-xl px-3 py-2.5",
                    snapshot.selectedPlant.id === plant.id &&
                      "bg-[color:rgba(111,177,200,0.12)] text-[color:var(--brand-ink)]",
                  )}
                  onClick={() => handlePlantSelect(plant.id)}
                >
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate font-medium">
                      {plant.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {plant.city}, {plant.state}
                    </span>
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="grid h-11 w-[164px] grid-cols-2 gap-1 rounded-xl border border-border/60 bg-white/82 p-1">
            {(["24h", "72h"] as const).map((window) => (
              <Button
                key={window}
                variant="ghost"
                className={cn(
                  "h-full rounded-lg text-xs font-semibold tracking-[0.1em] uppercase transition-all",
                  state.window === window
                    ? "bg-[color:var(--brand-navy)] text-white shadow-[0_8px_18px_-14px_rgba(18,40,76,0.72)] hover:bg-[color:var(--brand-ink)]"
                    : "text-muted-foreground hover:bg-[color:rgba(18,40,76,0.04)]",
                )}
                onClick={() => setWindow(window)}
              >
                {window}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[color:var(--surface-0)] text-foreground lg:h-[100dvh] lg:overflow-hidden">
      <div className="grid min-h-screen lg:h-[100dvh] lg:grid-cols-[284px_1fr]">
        <aside className="hidden border-r border-white/10 bg-[linear-gradient(180deg,#12284C_0%,#10233F_48%,#0D1B30_100%)] lg:sticky lg:top-0 lg:flex lg:h-[100dvh] lg:flex-col">
          <div className="border-b border-white/10 px-6 py-7">
            <Image
              src="/brand/bridgewater-logo-white.png"
              alt="Bridgewater Interiors"
              width={190}
              height={48}
              className="h-auto w-[174px]"
              priority
            />
            <p className="mt-5 text-[11px] font-semibold tracking-[0.24em] text-white/48 uppercase">
              BWI Asset Health Console
            </p>
          </div>
          <div className="flex-1 px-4 py-6">
            <ShellNavigation />
          </div>
          <div className="border-t border-white/10 px-4 py-5">
            <Button
              asChild
              variant="ghost"
              className="h-11 w-full justify-start gap-3 rounded-[1rem] px-3 text-white/72 hover:bg-white/8 hover:text-white"
            >
              <Link href="/login">
                <LogOut className="h-4 w-4" />
                Log out
              </Link>
            </Button>
          </div>
        </aside>
        <div className="flex min-w-0 flex-col lg:h-[100dvh] lg:overflow-hidden">
          <TopBar />
          <main className="page-shell scrollbar-hidden flex-1 px-4 py-6 lg:min-h-0 lg:overflow-y-auto lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
