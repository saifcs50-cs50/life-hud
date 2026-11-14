import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { Color, DoubleSide, type Group } from "three";
import { use3DPalette } from "./theme3d";

interface TireWear3DProps {
  /** 0-100 */
  gripPct: number;
}

const FULL_GRIP_DARK = new Color("#34e8a0");
const WORN_DARK = new Color("#ff2b4d");
const FULL_GRIP_LIGHT = new Color("#065f46");
const WORN_LIGHT = new Color("#991b1b");

const TREAD_OUTER = 1.0;
const TREAD_INNER = 0.64;
const TREAD_RADIUS = (TREAD_OUTER + TREAD_INNER) / 2;
const TREAD_TUBE = (TREAD_OUTER - TREAD_INNER) / 2;
const RIM_OUTER = 0.6;
const HUB_OUTER = 0.18;
const SPOKE_COUNT = 5;

export function TireWear3D({ gripPct }: TireWear3DProps) {
  const wheelRef = useRef<Group>(null);
  const { isLight, emissiveScale, ambientIntensity, pointLightScale } =
    use3DPalette();
  const t = Math.max(0, Math.min(1, gripPct / 100));
  const fullGrip = isLight ? FULL_GRIP_LIGHT : FULL_GRIP_DARK;
  const worn = isLight ? WORN_LIGHT : WORN_DARK;
  const color = fullGrip.clone().lerp(worn, 1 - t);
  const colorHex = `#${color.getHexString()}`;
  const rimColor = isLight ? "#c7cdd8" : "#8b93aa";

  useFrame((_, delta) => {
    if (wheelRef.current) {
      wheelRef.current.rotation.z += delta * (0.3 + (1 - t) * 0.6);
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 4.4]} fov={35} />
      {isLight && <color attach="background" args={["#fbfcfe"]} />}
      <ambientLight intensity={ambientIntensity} />
      <pointLight
        position={[2, 2, 2]}
        intensity={7 * pointLightScale}
        color={colorHex}
      />
      <pointLight
        position={[-2, -1, 2]}
        intensity={5 * pointLightScale}
        color="#8fefff"
      />

      <group ref={wheelRef}>
        {/* Black rubber tread band — flat-ish faceted tube reads as tire, not a bagel */}
        <mesh>
          <torusGeometry args={[TREAD_RADIUS, TREAD_TUBE, 8, 48]} />
          {isLight ? (
            <meshBasicMaterial color="#14161c" />
          ) : (
            <meshStandardMaterial
              color="#14161c"
              roughness={0.9}
              metalness={0.05}
            />
          )}
        </mesh>

        {/* Compound-indicator sidewall stripe, tinted by remaining grip */}
        <mesh position={[0, 0, TREAD_TUBE * 0.7]}>
          <torusGeometry args={[TREAD_RADIUS, 0.055, 8, 48]} />
          {isLight ? (
            <meshBasicMaterial color={color} />
          ) : (
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.9 * emissiveScale}
            />
          )}
        </mesh>

        {/* Thin rim lip — where the alloy meets the tyre's inner edge */}
        <mesh>
          <ringGeometry args={[RIM_OUTER - 0.045, RIM_OUTER, 32]} />
          <meshStandardMaterial
            color={rimColor}
            metalness={0.7}
            roughness={0.3}
            side={DoubleSide}
          />
        </mesh>

        {/* Spokes — solid bars with open gaps between them, like an alloy wheel */}
        {Array.from({ length: SPOKE_COUNT }).map((_, i) => (
          <group key={i} rotation={[0, 0, (i / SPOKE_COUNT) * Math.PI * 2]}>
            <mesh position={[0, (HUB_OUTER + RIM_OUTER) / 2, 0]}>
              <planeGeometry args={[0.12, RIM_OUTER - HUB_OUTER + 0.02]} />
              <meshStandardMaterial
                color={rimColor}
                metalness={0.6}
                roughness={0.35}
                side={DoubleSide}
              />
            </mesh>
          </group>
        ))}

        {/* Center hub cap */}
        <mesh position={[0, 0, 0.02]}>
          <circleGeometry args={[HUB_OUTER * 0.85, 24]} />
          <meshStandardMaterial
            color={isLight ? "#3a4152" : "#0d1017"}
            metalness={0.4}
            roughness={0.5}
          />
        </mesh>
      </group>
    </>
  );
}
