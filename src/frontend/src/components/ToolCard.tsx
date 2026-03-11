import {
  Contrast,
  Crop,
  Crown,
  Eraser,
  File,
  FileSpreadsheet,
  FileText,
  FileType,
  GitCompare,
  GitMerge,
  Hash,
  Image,
  Images,
  Layers,
  LayoutGrid,
  Lock,
  MessageSquare,
  Minimize2,
  PenTool,
  Presentation,
  RotateCcw,
  Scissors,
  Stamp,
  Table2,
  Tags,
  Unlock,
  Wrench,
} from "lucide-react";
import type { Tool } from "../hooks/useQueries";

const ICON_COMPONENTS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  GitMerge,
  Scissors,
  RotateCcw,
  LayoutGrid,
  FileText,
  Table2,
  Image,
  FileType,
  FileSpreadsheet,
  Minimize2,
  Contrast,
  Wrench,
  Layers,
  Lock,
  Unlock,
  Stamp,
  Eraser,
  Hash,
  Crop,
  Tags,
  PenTool,
  MessageSquare,
  GitCompare,
  Images,
  Presentation,
  PresentationIcon: Presentation,
};

interface ToolCardProps {
  tool: Tool;
  index: number;
  onClick: () => void;
}

/**
 * Per-category icon accent colors — icon ring only.
 * Cards themselves are uniformly dark; the icon color is the sole
 * category signal, keeping the grid visually calm and luxurious.
 */
const ICON_COLOR: Record<string, string> = {
  Organize: "text-sky-400",
  Convert: "text-violet-400",
  Optimize: "text-emerald-400",
  Security: "text-rose-400",
  Edit: "text-amber-400",
  Advanced: "text-crimson",
};

const ICON_RING: Record<string, string> = {
  Organize: "ring-sky-400/20   bg-sky-400/8",
  Convert: "ring-violet-400/20 bg-violet-400/8",
  Optimize: "ring-emerald-400/20 bg-emerald-400/8",
  Security: "ring-rose-400/20  bg-rose-400/8",
  Edit: "ring-amber-400/20  bg-amber-400/8",
  Advanced: "ring-crimson/20       bg-crimson/8",
};

export function ToolCard({ tool, index, onClick }: ToolCardProps) {
  const IconComponent = ICON_COMPONENTS[tool.iconName] || File;
  const isPremium = tool.tier === "premium";
  const iconColor = ICON_COLOR[tool.category] || "text-crimson";
  const iconRing = ICON_RING[tool.category] || "ring-crimson/20 bg-crimson/8";

  return (
    <button
      type="button"
      data-ocid={`tool.card.${index}`}
      onClick={onClick}
      className={
        "group relative flex w-full flex-col rounded-xl border border-border/40 " +
        "bg-card p-5 text-left " +
        /* subtle top-surface gloss */
        "[background-image:linear-gradient(to_bottom,oklch(0.35_0.03_340/0.3)_0%,transparent_60%)] " +
        "transition duration-300 " +
        "hover:-translate-y-[5px] hover:border-crimson/40 " +
        "hover:shadow-card-hover " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson/50"
      }
    >
      {/* Premium badge only — Free is the default, not worth labelling */}
      {isPremium && (
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-crimson/20 bg-crimson/10 px-2.5 py-0.5">
          <Crown className="h-2.5 w-2.5 text-crimson" />
          <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-crimson">
            Pro
          </span>
        </div>
      )}

      {/* Icon — larger, with category-colored tinted ring */}
      <div
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${iconRing} ${iconColor}`}
      >
        <IconComponent className="h-5 w-5" />
      </div>

      {/* Name */}
      <h3 className="mb-1.5 font-display text-[13px] font-bold leading-snug text-foreground">
        {tool.name}
      </h3>

      {/* Description */}
      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {tool.description}
      </p>

      {/* Hover CTA — fades in smoothly */}
      <div className="mt-4 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-crimson/0 transition duration-200 group-hover:text-crimson/80">
        <span>Use Tool</span>
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </div>
    </button>
  );
}
