import { clsx } from "clsx";

interface RatingDotsProps {
  value: number | undefined;
  onChange: (value: 1 | 2 | 3 | 4 | 5) => void;
}

const LEVELS = [1, 2, 3, 4, 5] as const;

export function RatingDots({ value, onChange }: RatingDotsProps) {
  return (
    <div className="flex gap-2">
      {LEVELS.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`Rate ${n} of 5`}
          className={clsx(
            "h-7 w-7 rounded-full border transition-colors",
            value !== undefined && n <= value
              ? "border-telemetry-400 bg-telemetry-500/70 glow-telemetry"
              : "border-white/10 bg-white/[0.02] hover:bg-white/[0.06]",
          )}
        />
      ))}
    </div>
  );
}
