import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import type { Group } from "three";
import {
  use3DPalette,
  MASCOT_STAGE_COLOR_DARK,
  MASCOT_STAGE_COLOR_LIGHT,
} from "./theme3d";

interface Mascot3DProps {
  stage: 1 | 2 | 3;
  /** 0-1, driven by combo streak */
  glowIntensity: number;
}

const SATELLITE_COLOR_DARK = "#34e8a0";
const SATELLITE_COLOR_LIGHT = "#065f46";

export function Mascot3D({ stage, glowIntensity }: Mascot3DProps) {
  const groupRef = useRef<Group>(null);
  const ringRef = useRef<Group>(null);
  const { isLight, emissiveScale, ambientIntensity, pointLightScale } =
    use3DPalette();

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
      groupRef.current.position.y = Math.sin(performance.now() / 700) * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.6;
      ringRef.current.rotation.z += delta * 0.3;
    }
  });

  const color = (isLight ? MASCOT_STAGE_COLOR_LIGHT : MASCOT_STAGE_COLOR_DARK)[
    stage
  ];
  const satelliteColor = isLight ? SATELLITE_COLOR_LIGHT : SATELLITE_COLOR_DARK;
  const emissiveIntensity = (0.3 + glowIntensity * 1.2) * emissiveScale;
  const detail = stage === 1 ? 0 : stage === 2 ? 1 : 2;

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.2, 3.4]} fov={35} />
      {isLight && <color attach="background" args={["#fbfcfe"]} />}
      <ambientLight intensity={ambientIntensity} />
      <pointLight
        position={[2, 2, 2]}
        intensity={30 * pointLightScale}
        color={color}
      />
      <pointLight
        position={[-2, -1, -1]}
        intensity={12 * pointLightScale}
        color="#8fefff"
      />

      <group ref={groupRef}>
        <mesh>
          <icosahedronGeometry args={[0.75, detail]} />
          {isLight ? (
            <meshBasicMaterial color={color} />
          ) : (
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={emissiveIntensity}
              roughness={0.25}
              metalness={0.4}
              flatShading
            />
          )}
        </mesh>

        {stage >= 2 && (
          <group ref={ringRef}>
            <mesh rotation={[Math.PI / 2.3, 0, 0]}>
              <torusGeometry args={[1.05, 0.02, 8, 48]} />
              {isLight ? (
                <meshBasicMaterial color={color} />
              ) : (
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={emissiveIntensity * 0.8}
                />
              )}
            </mesh>
          </group>
        )}

        {stage >= 3 &&
          [0, 1, 2].map((i) => {
            const angle = (i / 3) * Math.PI * 2;
            return (
              <mesh
                key={i}
                position={[
                  Math.cos(angle) * 1.3,
                  Math.sin(angle) * 0.4,
                  Math.sin(angle) * 1.3,
                ]}
              >
                <sphereGeometry args={[0.09, 12, 12]} />
                {isLight ? (
                  <meshBasicMaterial color={satelliteColor} />
                ) : (
                  <meshStandardMaterial
                    color={satelliteColor}
                    emissive={satelliteColor}
                    emissiveIntensity={emissiveScale}
                  />
                )}
              </mesh>
            );
          })}
      </group>
    </>
  );
}
