import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import type { Group } from "three";
import { use3DPalette } from "./theme3d";

export function TrophyMesh3D() {
  const groupRef = useRef<Group>(null);
  const { isLight, emissiveScale, ambientIntensity, pointLightScale } =
    use3DPalette();

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.1, 3]} fov={35} />
      {isLight && <color attach="background" args={["#fbfcfe"]} />}
      <ambientLight intensity={ambientIntensity} />
      <pointLight
        position={[2, 2, 2]}
        intensity={30 * pointLightScale}
        color="#ffc94d"
      />
      <pointLight
        position={[-2, -1, -1]}
        intensity={12 * pointLightScale}
        color="#8fefff"
      />

      <group ref={groupRef}>
        <mesh position={[0, 0.55, 0]}>
          <sphereGeometry
            args={[0.45, 24, 16, 0, Math.PI * 2, 0, Math.PI / 1.6]}
          />
          {isLight ? (
            <meshBasicMaterial color="#d97706" />
          ) : (
            <meshStandardMaterial
              color="#ffc94d"
              emissive="#e6920a"
              emissiveIntensity={0.4 * emissiveScale}
              metalness={0.8}
              roughness={0.25}
            />
          )}
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.06, 0.1, 0.6, 12]} />
          {isLight ? (
            <meshBasicMaterial color="#d97706" />
          ) : (
            <meshStandardMaterial color="#ffc94d" metalness={0.8} roughness={0.3} />
          )}
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.32, 0.38, 0.14, 24]} />
          {isLight ? (
            <meshBasicMaterial color="#b45309" />
          ) : (
            <meshStandardMaterial color="#e6920a" metalness={0.7} roughness={0.35} />
          )}
        </mesh>
      </group>
    </>
  );
}
