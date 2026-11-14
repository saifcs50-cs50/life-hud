interface NumberFieldProps {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  suffix?: string;
  step?: number;
  min?: number;
  max?: number;
}

export function NumberField({
  label,
  value,
  onChange,
  suffix,
  step = 0.1,
  min = 0,
  max,
}: NumberFieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium tracking-wide text-ink-500 uppercase">
        {label}
      </span>
      <div className="relative">
        <input
          type="number"
          step={step}
          min={min}
          max={max}
          value={value ?? ""}
          onChange={(e) =>
            onChange(e.target.value === "" ? undefined : Number(e.target.value))
          }
          placeholder="—"
          className="font-tele w-full rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2.5 text-ink-100 outline-none focus:border-telemetry-500/50 focus:glow-telemetry"
        />
        {suffix && (
          <span className="font-tele pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xs text-ink-700">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}
