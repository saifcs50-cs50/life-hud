import { Minus, Plus } from "lucide-react";
import { Viewport3D } from "./Viewport3D";
import { WaterFillBar } from "./WaterFillBar";
import { WaterCylinder3D } from "../three/WaterCylinder3D";

interface WaterGaugeProps {
  glasses: number;
  goal?: number;
  onChange: (glasses: number) => void;
}

export function WaterGauge({ glasses, goal = 8, onChange }: WaterGaugeProps) {
  const fillPct = Math.min(100, (glasses / goal) * 100);

  return (
    <div className="flex items-center gap-5">
      <Viewport3D
        className="h-44 w-32 shrink-0"
        fallback={<WaterFillBar fillPct={fillPct} />}
      >
        <WaterCylinder3D fillRatio={glasses / goal} />
      </Viewport3D>

      <div className="flex flex-col gap-2">
        <p className="font-tele text-2xl text-ink-100">
          {glasses}
          <span className="text-sm text-ink-700"> / {goal} glasses</span>
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange(Math.max(0, glasses - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-ink-300 hover:bg-white/[0.06]"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onChange(glasses + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-telemetry-400/30 bg-telemetry-500/10 text-telemetry-300 hover:bg-telemetry-500/20"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
