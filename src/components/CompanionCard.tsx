import { GlassCard } from "./GlassCard";
import { Viewport3D } from "./Viewport3D";
import { Mascot3D } from "../three/Mascot3D";
import { MascotFallback } from "./MascotFallback";
import { useTelemetryEngine } from "../lib/useTelemetryEngine";
import { useMascotStageColor } from "../three/theme3d";

export function CompanionCard() {
  const telemetry = useTelemetryEngine();
  const stage = (telemetry?.mascot.stage.stage ?? 1) as 1 | 2 | 3;
  const color = useMascotStageColor(stage);

  if (!telemetry) {
    return (
      <GlassCard
        blur={false}
        className="flex min-h-[240px] items-center justify-center p-6"
      >
        <p className="font-tele text-xs text-ink-700">SPOOLING…</p>
      </GlassCard>
    );
  }

  const { mascot, streak } = telemetry;
  const glowIntensity = Math.min(1, streak / 7);

  return (
    <GlassCard blur={false} className="flex flex-col items-center gap-3 p-6">
      <h2 className="self-start text-lg font-semibold text-ink-100">
        Companion
      </h2>
      <Viewport3D
        className="h-56 w-full"
        fallback={<MascotFallback stageName={mascot.stage.name} color={color} />}
      >
        <Mascot3D stage={stage} glowIntensity={glowIntensity} />
      </Viewport3D>
      <p className="font-tele text-sm" style={{ color }}>
        {mascot.stage.name}
      </p>
    </GlassCard>
  );
}
