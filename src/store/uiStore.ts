import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  startAmbient,
  stopAmbient,
  setAmbientVolume as setEngineVolume,
  type AmbientTrack,
} from "../lib/audioEngine";

type AmbientSelection = AmbientTrack | "off";
export type Theme = "dark" | "light";

interface UiState {
  ecoMode: boolean;
  toggleEcoMode: () => void;

  theme: Theme;
  toggleTheme: () => void;

  ambientTrack: AmbientSelection;
  setAmbientTrack: (track: AmbientSelection) => void;

  ambientVolume: number;
  setAmbientVolume: (volume: number) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      ecoMode: false,
      toggleEcoMode: () => set((s) => ({ ecoMode: !s.ecoMode })),

      theme: "dark",
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),

      ambientTrack: "off",
      setAmbientTrack: (track) => {
        if (track === "off") {
          stopAmbient();
        } else {
          startAmbient(track, get().ambientVolume);
        }
        set({ ambientTrack: track });
      },

      ambientVolume: 0.25,
      setAmbientVolume: (volume) => {
        setEngineVolume(volume);
        set({ ambientVolume: volume });
      },
    }),
    {
      name: "life-hud-ui",
      // Audio never auto-resumes on load (browsers block autoplay + we don't
      // want stale UI implying sound is playing when it isn't) — only
      // persist Eco Mode and theme across sessions.
      partialize: (state) => ({ ecoMode: state.ecoMode, theme: state.theme }),
    },
  ),
);
