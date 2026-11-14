import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import type { RefObject } from "react";

interface Scene3DRootProps {
  eventSource: RefObject<HTMLElement | null>;
}

/**
 * Single shared WebGL context for the whole app. Individual 3D cards render
 * into it via drei's <View className="..."> from anywhere in the DOM —
 * avoids spinning up a separate canvas (and GPU context) per card.
 */
export function Scene3DRoot({ eventSource }: Scene3DRootProps) {
  return (
    <Canvas
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
      eventSource={eventSource as RefObject<HTMLElement>}
      eventPrefix="client"
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
    >
      <View.Port />
    </Canvas>
  );
}
