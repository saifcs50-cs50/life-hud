import { useLiveQuery } from "dexie-react-hooks";
import type { LucideIcon } from "lucide-react";
import {
  Trophy as TrophyIcon,
  Flag,
  Flame,
  Wind,
  Star,
  Crown,
  Swords,
} from "lucide-react";
import db from "../lib/db";
import { GlassCard } from "../components/GlassCard";
import { Viewport3D } from "../components/Viewport3D";
import { TrophyMesh3D } from "../three/TrophyMesh3D";
import { StubPage } from "../components/StubPage";

const ICON_MAP: Record<string, LucideIcon> = {
  flag: Flag,
  flame: Flame,
  wind: Wind,
  star: Star,
  trophy: TrophyIcon,
  crown: Crown,
  swords: Swords,
};

export function TrophyRoom() {
  const trophies = useLiveQuery(
    () => db.trophies.orderBy("unlockedAt").reverse().toArray(),
    [],
  );

  if (!trophies || trophies.length === 0) {
    return (
      <StubPage
        icon={TrophyIcon}
        title="Trophy Room"
        phase="No trophies yet."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {trophies.map((trophy) => {
        const Icon = ICON_MAP[trophy.icon] ?? TrophyIcon;
        return (
          <GlassCard
            key={trophy.id}
            blur={false}
            className="flex flex-col items-center gap-2 p-6 text-center"
          >
            <Viewport3D
              className="h-40 w-40"
              fallback={
                <div className="flex h-full w-full items-center justify-center">
                  <Icon className="h-10 w-10 text-amber-400" />
                </div>
              }
            >
              <TrophyMesh3D />
            </Viewport3D>
            <h2 className="text-sm font-semibold text-ink-100">
              {trophy.title}
            </h2>
            <p className="text-xs text-ink-500">{trophy.description}</p>
            {trophy.unlockedAt && (
              <p className="font-tele text-[10px] text-ink-700">
                {new Date(trophy.unlockedAt).toLocaleDateString()}
              </p>
            )}
          </GlassCard>
        );
      })}
    </div>
  );
}
