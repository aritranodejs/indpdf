import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, Crown, FileText, Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import type { Tool } from "../hooks/useQueries";
import { usePremium } from "../context/PremiumContext";
import { CATEGORIES, FALLBACK_TOOLS } from "../lib/toolsData";
import { StartTrialModal } from "./StartTrialModal";

interface TopNavProps {
  onNavigate: (page: string, toolSlug?: string) => void;
  tools?: Tool[];
}

const ICON_MAP: Record<string, string> = {
  Organize: "🗂",
  Convert: "🔄",
  Optimize: "⚡",
  Security: "🔒",
  Edit: "✏️",
  Advanced: "🔮",
};

export function TopNav({ onNavigate, tools }: TopNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const { isPremium, isTrialing, daysLeftInTrial } = usePremium();

  const allTools = tools && tools.length > 0 ? tools : FALLBACK_TOOLS;
  const navCategories = CATEGORIES.filter((c) => c !== "All");

  const getToolsForCategory = (cat: string) =>
    allTools.filter((t) => t.category === cat).slice(0, 4);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 font-display text-xl font-black tracking-tight"
            data-ocid="nav.home_link"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-crimson to-crimson-dark shadow-crimson-sm overflow-hidden animate-sweep ring-1 ring-crimson/20">
              <FileText className="h-5 w-5 text-background" />
            </div>
            <span className="text-foreground -ml-0.5">
              Ind<span className="text-luxury-gradient">PDF</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navCategories.map((cat, i) => (
              <div
                key={cat}
                className="relative"
                onMouseEnter={() => setActiveDropdown(cat)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  data-ocid={`nav.menu_link.${i + 1}`}
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                >
                  {cat}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>

                {activeDropdown === cat && (
                  <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-border/40 bg-popover/95 p-4 shadow-2xl backdrop-blur-xl animate-scale-in">
                    <p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-crimson/70">
                      <span>{ICON_MAP[cat]}</span> {cat}
                    </p>
                    <div className="space-y-0.5">
                      {getToolsForCategory(cat).map((tool) => (
                        <button
                          type="button"
                          key={tool.slug}
                          onClick={() => {
                            onNavigate("tool", tool.slug);
                            setActiveDropdown(null);
                          }}
                          className="w-full rounded-xl px-4 py-2.5 text-left text-sm text-muted-foreground transition-all hover:bg-crimson/5 hover:text-foreground"
                        >
                          {tool.name}
                          {tool.tier === "premium" && (
                            <span className="ml-2 rounded-full bg-crimson/10 px-2 py-0.5 text-[9px] font-bold text-crimson uppercase tracking-tighter">
                              PRO
                            </span>
                          )}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate("home");
                          setActiveDropdown(null);
                        }}
                        className="w-full rounded-xl px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-widest text-crimson/70 transition hover:text-crimson hover:bg-crimson/5"
                      >
                        View all tools →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate("pricing")}
              className="hidden text-sm font-medium text-muted-foreground transition hover:text-foreground md:block"
              data-ocid="nav.pricing_link"
            >
              Pricing
            </button>

            {isTrialing ? (
              <div className="hidden items-center gap-2 md:flex">
                <Badge className="gap-1.5 border-crimson/30 bg-crimson/5 text-crimson font-bold uppercase text-[10px] tracking-wider px-3 py-1">
                  <Crown className="h-3 w-3" /> Trial: {daysLeftInTrial} day
                  {daysLeftInTrial !== 1 ? "s" : ""} left
                </Badge>
                <button
                  type="button"
                  data-ocid="nav.manage_trial_link"
                  onClick={() => onNavigate("pricing")}
                  className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
                >
                  Manage
                </button>
              </div>
            ) : isPremium ? (
              <div className="hidden items-center gap-2 md:flex">
                <Badge className="gap-1.5 border-crimson/30 bg-crimson/5 text-crimson font-bold uppercase text-[10px] tracking-wider px-3 py-1">
                  <Sparkles className="h-3 w-3" /> Premium ✦
                </Badge>
              </div>
            ) : (
              <Button
                type="button"
                data-ocid="nav.start_trial_button"
                variant="outline"
                size="sm"
                onClick={() => setTrialModalOpen(true)}
                className="hidden rounded-full border-crimson/30 bg-crimson/5 px-5 text-[11px] font-bold uppercase tracking-widest text-crimson transition-all hover:bg-crimson/10 hover:border-crimson/50 md:flex h-10"
              >
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                Start Trial
              </Button>
            )}

            <Button
              type="button"
              data-ocid="nav.go_premium_button"
              onClick={() => onNavigate("pricing")}
              className="rounded-full bg-gradient-to-r from-crimson-dark via-crimson to-crimson-light px-6 py-2 h-10 text-[11px] font-bold uppercase tracking-widest text-background shadow-crimson transition-all hover:scale-105 hover:shadow-crimson-sm"
            >
              Membership
            </Button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/50 text-muted-foreground transition hover:bg-crimson/10 hover:text-crimson md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="animate-reveal-up border-t border-border/40 bg-background/98 px-4 pb-8 md:hidden shadow-2xl overflow-y-auto max-h-[calc(100vh-64px)]">
            <div className="space-y-6 pt-6">
              {navCategories.map((cat, i) => (
                <div key={cat} className="space-y-3">
                  <p className="px-1 text-[10px] font-bold uppercase tracking-[0.3em] text-crimson">
                    {cat}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {getToolsForCategory(cat).map((tool) => (
                      <button
                        type="button"
                        key={tool.slug}
                        onClick={() => {
                          onNavigate("tool", tool.slug);
                          setMobileOpen(false);
                        }}
                        className="flex flex-col rounded-xl border border-border/30 bg-card/50 px-4 py-3 text-left transition hover:border-crimson/30 hover:bg-crimson/5"
                      >
                        <span className="text-sm font-medium text-foreground">{tool.name}</span>
                        {tool.tier === "premium" && (
                          <span className="mt-0.5 text-[9px] font-black text-crimson uppercase tracking-tighter">PRO</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-border/20">
                {!isPremium && (
                  <Button
                    type="button"
                    variant="outline"
                    data-ocid="nav.mobile_start_trial_button"
                    onClick={() => {
                      setTrialModalOpen(true);
                      setMobileOpen(false);
                    }}
                    className="w-full rounded-2xl border-crimson/20 bg-crimson/5 font-black uppercase tracking-[0.2em] text-crimson py-7"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Start Free Trial
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={() => {
                    onNavigate("pricing");
                    setMobileOpen(false);
                  }}
                  className="w-full rounded-2xl bg-gradient-to-r from-crimson-dark via-crimson to-crimson-light font-black uppercase tracking-[0.2em] text-background py-7 shadow-crimson"
                >
                  Membership Hub
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      <StartTrialModal
        open={trialModalOpen}
        onClose={() => setTrialModalOpen(false)}
      />
    </>
  );
}
