import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  CheckCircle2,
  Layers,
  Search,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ToolCard } from "../components/ToolCard";
import { useAllTools } from "../hooks/useQueries";
import { CATEGORIES, type Category, FALLBACK_TOOLS } from "../lib/toolsData";

interface HomePageProps {
  onNavigate: (page: string, toolSlug?: string) => void;
}

const WHY_FEATURES = [
  {
    icon: Zap,
    title: "Genuinely Generous Free Tier",
    description:
      "20+ tools available completely free. No file size limits, no watermarks, no count restrictions.",
    color: "text-ruby",
    bg: "bg-ruby/10",
    border: "border-ruby/15",
  },
  {
    icon: ShieldCheck,
    title: "No Account Required",
    description:
      "Jump straight in. Your files are processed in the browser and never stored on our servers.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/15",
  },
  {
    icon: Layers,
    title: "Batch Processing, Always Free",
    description:
      "Process multiple files simultaneously without a premium plan. Handle entire workflows in one click.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/15",
  },
];

/** Flanked-dash section eyebrow — consistent luxury treatment */
function Eyebrow({ children }: { children: string }) {
  return (
    <div className="mb-4 flex items-center justify-center gap-3">
      <span className="h-px w-5 bg-ruby/20" />
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-ruby/70">
        {children}
      </span>
      <span className="h-px w-5 bg-ruby/20" />
    </div>
  );
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const { data: backendTools, isLoading } = useAllTools();

  const tools =
    backendTools && backendTools.length > 0 ? backendTools : FALLBACK_TOOLS;

  const filteredTools = useMemo(() => {
    let list = tools;
    if (activeCategory !== "All") {
      list = list.filter((t) => t.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q),
      );
    }
    return list;
  }, [tools, activeCategory, search]);

  return (
    <main className="animate-fade-in">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pb-24 pt-28">
        {/* Multi-layer atmospheric depth */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Central ruby bloom — the anchor of the luxury atmosphere */}
          <div
            className="animate-hero-bloom absolute left-1/2 top-[-100px] h-[600px] w-[600px] -translate-x-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at center, oklch(0.55 0.22 25 / 0.08) 0%, oklch(0.55 0.22 25 / 0.03) 45%, transparent 75%)",
            }}
          />
          {/* Secondary ambient left-cool */}
          <div
            className="absolute -left-32 top-1/3 h-80 w-80 rounded-full opacity-40"
            style={{
              background:
                "radial-gradient(ellipse, oklch(60 0.08 240 / 0.15) 0%, transparent 70%)",
            }}
          />
          {/* Secondary ambient right-warm */}
          <div
            className="absolute -right-24 top-1/4 h-72 w-72 rounded-full opacity-40"
            style={{
              background:
                "radial-gradient(ellipse, oklch(68 0.10 55 / 0.10) 0%, transparent 70%)",
            }}
          />
          {/* Thin horizontal ruby hairline */}
          <div
            className="absolute left-1/2 top-[140px] h-px w-64 -translate-x-1/2"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.55 0.22 25 / 0.2), transparent)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Pill badge */}
          <div className="animate-reveal-up mb-8 inline-flex items-center gap-2 rounded-full border border-ruby/20 bg-ruby/5 px-5 py-2">
            <span className="h-1.5 w-1.5 animate-ruby-pulse rounded-full bg-ruby" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ruby">
              The Luxury Standard for PDF
            </span>
          </div>

          {/* Headline — two visual lines for hierarchy and drama */}
          <h1 className="animate-reveal-up mb-10 font-display font-black tracking-[-0.04em] text-foreground [animation-delay:200ms]">
            <span className="block text-4xl leading-tight opacity-70 md:text-5xl lg:text-5xl">
              Your PDF Toolkit,
            </span>
            <span
              className="mt-2 block text-7xl md:text-8xl lg:text-[10rem]"
              style={{ lineHeight: 0.9 }}
            >
              <span className="animate-shimmer filter drop-shadow-2xl">IndPDF.</span>
            </span>
          </h1>

          <p className="animate-reveal-up mx-auto mb-16 max-w-2xl text-lg font-medium leading-relaxed tracking-tight text-muted-foreground/80 [animation-delay:400ms] md:text-xl">
            Elevate your document workflow with a signature suite of high-performance tools. Zero effort, absolute precision, and uncompromised privacy.
          </p>

          <div className="animate-reveal-up flex flex-col items-center justify-center gap-5 [animation-delay:600ms] sm:flex-row">
            <Button
              type="button"
              size="lg"
              className="group gap-2 rounded-full bg-gradient-to-r from-ruby-dark via-ruby to-ruby-light px-10 py-7 text-sm font-bold uppercase tracking-wider text-white shadow-ruby transition-all hover:scale-105 hover:shadow-ruby-sm"
              onClick={() =>
                document
                  .getElementById("tools-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore the Toolkit
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              className="gap-2 rounded-full border-border/40 px-10 py-7 text-sm font-bold uppercase tracking-wider text-foreground transition-all hover:border-ruby/40 hover:bg-ruby/5"
              onClick={() => onNavigate("pricing")}
            >
              Membership
            </Button>
          </div>

          {/* Stats strip — proper credential bar with dividers */}
          <div className="animate-reveal-up mt-20 flex flex-wrap items-center justify-center gap-4 [animation-delay:800ms]">
            {[
              { label: "Files Processed", value: "240M+" },
              { label: "Happy Users", value: "85M+" },
              { label: "Tools Available", value: "20+" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="card-surface group flex flex-col items-center justify-center rounded-2xl border border-border/20 px-8 py-5 transition-all duration-500 hover:border-ruby/30"
              >
                <span className="font-display text-2xl font-black leading-none text-ruby transition-transform group-hover:scale-110">
                  {value}
                </span>
                <span className="mt-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tools Section ─────────────────────────────────────────────── */}
      <section id="tools-section" className="px-4 pb-20">
        <div className="mx-auto max-w-7xl">
          {/* Search + tabs header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                data-ocid="home.search_input"
                placeholder="Search tools…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-secondary pl-10 placeholder:text-muted-foreground/40"
              />
            </div>
          </div>

          <Tabs
            value={activeCategory}
            onValueChange={(v) => setActiveCategory(v as Category)}
            className="mb-8"
          >
            <TabsList className="flex h-auto flex-wrap justify-center gap-2 bg-transparent p-0">
              {CATEGORIES.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  data-ocid="home.category.tab"
                  className="rounded-full border border-border/20 bg-white/40 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-all duration-300 data-[state=active]:border-ruby/40 data-[state=active]:bg-ruby/10 data-[state=active]:text-ruby-dark hover:bg-ruby/5"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={activeCategory} className="mt-0">
              {isLoading ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
                    <Skeleton key={i} className="h-44 rounded-xl bg-secondary/50" />
                  ))}
                </div>
              ) : filteredTools.length === 0 ? (
                <div className="py-20 text-center text-muted-foreground">
                  <Search className="mx-auto mb-3 h-10 w-10 opacity-30" />
                  <p className="font-display text-lg font-bold">No tools found</p>
                  <p className="mt-1 text-sm">Try a different search or category</p>
                </div>
              ) : (
                <div className="stagger-reveal grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                  {filteredTools.map((tool, i) => (
                    <div key={tool.slug} className="h-full">
                      <ToolCard
                        tool={tool}
                        index={i}
                        onClick={() => onNavigate("tool", tool.slug)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* ── Why LuxPDF ────────────────────────────────────────────────── */}
      <section className="border-y border-border/40 bg-card/20 px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <Eyebrow>Why IndPDF</Eyebrow>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Built for people who value their time
            </h2>
          </div>
          <div className="stagger-reveal grid grid-cols-1 gap-8 md:grid-cols-3">
            {WHY_FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="card-surface group rounded-2xl border border-border/20 p-8 transition-all duration-500 hover:-translate-y-2 hover:border-ruby/30 hover:shadow-ruby-sm"
                >
                  <div
                    className={`${feat.bg} ${feat.color} ${feat.border} mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 text-lg font-bold tracking-tight text-foreground">
                    {feat.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Pricing Teaser ────────────────────────────────────────────── */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <Eyebrow>Pricing</Eyebrow>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              Simple plans, real value
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Free */}
            <div className="rounded-2xl border border-border/50 bg-card p-7">
              <div className="mb-7">
                <div className="mb-0.5 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  Free
                </div>
                <div className="font-display text-4xl font-black text-foreground">
                  $0
                  <span className="ml-1 text-base font-normal text-muted-foreground">
                    /forever
                  </span>
                </div>
              </div>
              <ul className="mb-7 space-y-2.5">
                {[
                  "20+ tools included",
                  "Unlimited file size",
                  "Batch processing",
                  "No account needed",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400/70" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-xl border-border/40 text-[11px] font-bold uppercase tracking-widest transition hover:border-ruby/40 hover:bg-ruby/5"
                onClick={() =>
                  document
                    .getElementById("tools-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Start for Free
              </Button>
            </div>

            {/* Premium */}
            <div className="relative rounded-2xl border border-ruby/20 bg-white p-7 shadow-ruby-sm overflow-hidden animate-sweep">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                <span className="rounded-full bg-gradient-to-r from-ruby-dark via-ruby to-ruby-light px-5 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white shadow-ruby-sm">
                  ✦ Signature Tier
                </span>
              </div>
              <div className="mb-7 mt-1">
                <div className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-ruby/70">
                  Premium
                </div>
                <div className="font-display text-4xl font-black text-ruby-dark">
                  $9.99
                  <span className="ml-1 text-base font-normal text-muted-foreground">
                    /month
                  </span>
                </div>
              </div>
              <ul className="mb-7 space-y-2.5">
                {[
                  "Everything in Free",
                  "Sign & Annotate PDFs",
                  "Compare Documents",
                  "API Access",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-ruby/60" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                type="button"
                className="w-full rounded-xl bg-gradient-to-r from-ruby-dark via-ruby to-ruby-light py-6 text-xs font-bold uppercase tracking-widest text-white shadow-ruby transition-all hover:scale-[1.02] hover:shadow-ruby-sm"
                onClick={() => onNavigate("pricing")}
              >
                Go Premium
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
