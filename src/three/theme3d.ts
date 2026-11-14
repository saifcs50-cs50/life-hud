import { useUiStore } from "../store/uiStore";

/**
 * The Canvas clears to transparent and shows through to the page behind it.
 * meshStandardMaterial's lit + specular response consistently washed even
 * saturated colors out to pale pastels here no matter how far lighting was
 * dialed down (confirmed empirically — pure red still rendered pale pink at
 * 6% of normal light intensity), so light-mode primary meshes render unlit
 * (meshBasicMaterial, exact color, no lighting interaction) instead of
 * fighting that. Dark mode is untouched and keeps its lit PBR look, which
 * already reads well against the near-black backdrop.
 */
export function use3DPalette() {
  const theme = useUiStore((s) => s.theme);
  const isLight = theme === "light";
  return {
    isLight,
    emissiveScale: isLight ? 0 : 1,
    ambientIntensity: isLight ? 0.5 : 0.6,
    pointLightScale: isLight ? 0.5 : 1,
  };
}

// Light-mode 3D materials also use darker, more saturated colors than their
// dark-mode counterparts — even rendered unlit, the dark-mode neon shades
// read as too pastel/low-contrast against a light page.
export const MASCOT_STAGE_COLOR_DARK = {
  1: "#8b93aa",
  2: "#22d3ee",
  3: "#34e8a0",
} as const;

export const MASCOT_STAGE_COLOR_LIGHT = {
  1: "#3d4459",
  2: "#075e73",
  3: "#065f46",
} as const;

export function useMascotStageColor(stage: 1 | 2 | 3): string {
  const { isLight } = use3DPalette();
  return (isLight ? MASCOT_STAGE_COLOR_LIGHT : MASCOT_STAGE_COLOR_DARK)[stage];
}
