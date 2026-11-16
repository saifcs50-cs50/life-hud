import type { ReactNode } from "react";
import { View } from "@react-three/drei";
import { useUiStore } from "../store/uiStore";

interface Viewport3DProps {
  children: ReactNode;
  fallback: ReactNode;
  className?: string;
}

/**
 * Tracked window into the shared canvas, or the flat fallback under Eco Mode.
 * `View` (outside a Canvas) renders and tracks its own internal element, so
 * size/position must be passed as className/style directly to it. Wrapping
 * it in an extra sized div and passing that div as `track` does nothing,
 * since View ignores an externally-supplied track ref in this mode.
 */
export function Viewport3D({ children, fallback, className }: Viewport3DProps) {
  const ecoMode = useUiStore((s) => s.ecoMode);

  if (ecoMode) {
    return <div className={className}>{fallback}</div>;
  }

  return <View className={className}>{children}</View>;
}
