import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { DoubleSide, type Group, type Mesh } from "three";
import { use3DPalette } from "./theme3d";

interface WaterCylinder3DProps {
  /** 0-1 */
  fillRatio: number;
}

const HEIGHT = 2.4;
const RADIUS = 0.7;

export function WaterCylinder3D({ fillRatio }: WaterCylinder3DProps) {
  const waterRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  const { isLight, emissiveScale, ambientIntensity, pointLightScale } =
    use3DPalette();
  const target = Math.max(0.03, Math.min(1, fillRatio));

  useFrame((_, delta) => {
    if (waterRef.current) {
      const scale = waterRef.current.scale;
      scale.y += (target - scale.y) * Math.min(1, delta * 4);
      waterRef.current.position.y = -HEIGHT / 2 + (scale.y * HEIGHT) / 2;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  const shellColor = isLight ? "#0891b2" : "#8fefff";
  const waterColor = isLight ? "#075e73" : "#22d3ee";
  const waterEmissive = isLight ? "#075e73" : "#0ea5c7";

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.3, 4]} fov={35} />
      {isLight && <color attach="background" args={["#fbfcfe"]} />}
      <ambientLight intensity={ambientIntensity} />
      <pointLight
        position={[2, 3, 2]}
        intensity={40 * pointLightScale}
        color="#8fefff"
      />
      <pointLight
        position={[-2, -1, -2]}
        intensity={15 * pointLightScale}
        color="#22d3ee"
      />

      <group ref={groupRef}>
        <mesh>
          <cylinderGeometry args={[RADIUS, RADIUS * 0.92, HEIGHT, 32, 1, true]} />
          {isLight ? (
            <meshBasicMaterial
              color={shellColor}
              transparent
              opacity={0.3}
              side={DoubleSide}
            />
          ) : (
            <meshPhysicalMaterial
              color={shellColor}
              transparent
              opacity={0.16}
              roughness={0.05}
              metalness={0}
              side={DoubleSide}
            />
          )}
        </mesh>

        <mesh ref={waterRef} scale={[1, 0.03, 1]} position={[0, -HEIGHT / 2, 0]}>
          <cylinderGeometry args={[RADIUS * 0.88, RADIUS * 0.82, HEIGHT, 32]} />
          {isLight ? (
            <meshBasicMaterial color={waterColor} />
          ) : (
            <meshStandardMaterial
              color={waterColor}
              emissive={waterEmissive}
              emissiveIntensity={0.35 * emissiveScale}
              roughness={0.3}
            />
          )}
        </mesh>
      </group>
    </>
  );
}
