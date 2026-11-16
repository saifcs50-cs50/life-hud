import type { LucideIcon } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface StubPageProps {
  icon: LucideIcon;
  title: string;
  phase: string;
}

export function StubPage({ icon: Icon, title, phase }: StubPageProps) {
  return (
    <GlassCard className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <Icon className="h-8 w-8 text-ink-700" strokeWidth={1.5} />
      <h1 className="text-xl font-semibold text-ink-300">{title}</h1>
      <p className="text-sm text-ink-500">{phase}</p>
    </GlassCard>
  );
}
