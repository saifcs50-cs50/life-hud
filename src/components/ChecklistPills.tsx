import { Check } from "lucide-react";
import { clsx } from "clsx";

interface ChecklistItem {
  key: string;
  label: string;
}

interface ChecklistPillsProps {
  items: ChecklistItem[];
  values: Record<string, boolean>;
  onToggle: (key: string) => void;
}

export function ChecklistPills({ items, values, onToggle }: ChecklistPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = !!values[item.key];
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onToggle(item.key)}
            className={clsx(
              "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              active
                ? "border-streak-500/40 bg-streak-500/10 text-streak-300 glow-streak"
                : "border-white/5 bg-white/[0.02] text-ink-500 hover:bg-white/[0.05]",
            )}
          >
            {active ? (
              <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
            ) : (
              <span className="h-3.5 w-3.5" />
            )}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
