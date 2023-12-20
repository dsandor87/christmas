import { useFrame, useThree } from "@react-three/fiber";
import {
  MeshTransmissionMaterial,
  useGLTF,
  useTexture,
  Text,
  Billboard,
  Text3D,
} from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef, useLayoutEffect, useState, useEffect } from "react";
import { easing } from "maath";
import gsap from "gsap";
import SnowFlakes from "./SnowFlakes";
import FireWorks from "./FireWorks";
import LumaWorld from "./LumaWorld";

export default function SnowGlobeModel(props) {
  console.log(props, "opopopopojghjb-==-=");
  const { nodes, materials } = useGLTF("/snowglobe-transformed.glb");
  const footer = document.querySelector(".footer");
  const snowGlobeRef = useRef();
  const snowGlobeRef2 = useRef();
  const internalWorldRef = useRef();
  const fireWorksRef = useRef();
  const [insideMesh, setInsideMesh] = useState(false);
  const [nameFromUrl, setNameFromUrl] = useState("");

  useEffect(() => {
    const pathSegments = window.location.pathname.split("/");
    if (pathSegments.length > 1) {
      setNameFromUrl(pathSegments[1]);
    }
  }, []);

  const groupRef = useRef();
  const texture = useTexture("/epic.jpg");
  const { camera } = useThree();
  const cameraPosition = camera.position;
  const ray = new THREE.Ray(new THREE.Vector2(0, 0), cameraPosition);
  const raycaster = new THREE.Raycaster();

  function useGsapContext(scope) {
    const ctx = useMemo(() => gsap.context(() => {}, scope), [scope]);
    return ctx;
  }

  const ctx = useGsapContext(snowGlobeRef);

  useLayoutEffect(() => {
    gsap.to(camera.position, {
      z: props.inside ? 0.1 : 3,
      x: props.inside ? 0.1 : 3,
      ease: "power3.inOut",
      duration: 1.8,
    });

    return () => ctx.revert();
  }, [props.inside]);

  useFrame((state, delta) => {
    checkIntersection(snowGlobeRef.current, delta);
  });

  const checkIntersection = (object, delta) => {
    raycaster.set(cameraPosition, ray.direction);

    const intersections = raycaster.intersectObject(object);

    if (intersections.length > 0) {
      setInsideMesh(false);
    } else {
      setInsideMesh(true);
    }
    easing.dampC(
      internalWorldRef.current.material.color,
      intersections.length > 0 ? "grey" : "white",
      0.25,
      delta
    );
    easing.damp(
      footer.style,
      "opacity",
      intersections.length > 0 ? "0.1" : "1",
      0.25,
      delta
    );
  };

  useEffect(() => {
    if (!insideMesh) {
      snowGlobeRef2.current.visible = false;
      snowGlobeRef.current.visible = false;
      fireWorksRef.current.visible = true;
      camera.fov = 95;
      camera.updateProjectionMatrix();
    } else {
      camera.fov = 65;
      camera.updateProjectionMatrix();
      snowGlobeRef2.current.visible = true;
      snowGlobeRef.current.visible = true;
      fireWorksRef.current.visible = false;
    }
  }, [insideMesh]);

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <mesh
        ref={snowGlobeRef}
        castShadow
        receiveShadow
        geometry={
          nodes.build_scenebuild_sceneSnow_Scene_Snow_Globe___Default1_0
            .geometry
        }
      >
        <MeshTransmissionMaterial
          backsideThickness={8}
          samples={4}
          thickness={0.9}
          anisotropicBlur={0.8}
          ior={1.8}
          iridescence={0.5}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
          clearcoat={1}
          roughness={0.2}
          envMapIntensity={0.7}
          metalness={0.3}
        />
      </mesh>
      <mesh ref={internalWorldRef} position={[0, 15, 0]}>
        <sphereGeometry args={[12.5, 24, 24]} />
        <meshStandardMaterial
          map={texture}
          side={THREE.BackSide}
          envMapIntensity={3}
        />
        <FireWorks ref={fireWorksRef} />
      </mesh>
      <mesh
        ref={snowGlobeRef2}
        castShadow
        receiveShadow
        geometry={nodes.build_scenebuild_sceneSnow_Scene_blinn1_0.geometry}
      >
        <meshPhysicalMaterial
          metalness={0.2}
          roughness={0.2}
          color={"grey"}
          envMapIntensity={2}
        />
        <SnowFlakes count={2000} />
      </mesh>
      {!props.isMobile && <LumaWorld visible={insideMesh} />}
      <Texts nameFromUrl={nameFromUrl} isMobile={props.isMobile} />
    </group>
  );
}
useGLTF.preload("/snowglobe-transformed.glb");

const pathTextMapping = {
  Rita: "Boldog Karácsonyt az egész Családnak ",
  Ani: "Boldog Karácsonyt az egész Családnak ",

  Ron: "Wishing you a season filled with warm moments and cherished memories",
  Sandor:
    "May this holiday season bring you peace, joy, and cherished moments,",
  Campbell:
    "Wishing you a season filled with warm moments and cherished memories,",
  Andrew: "May the magic of the holiday season stay with you all year long,",
  Joe: "Here's to a wonderful holiday season and a happy New Year,",
  Phil: "May your holidays sparkle with joy and laughter,",
  Charlie:
    "Wishing you a festive season filled with love, joy, and prosperity,",
  Taylor:
    "Hope this holiday season is filled with much joy, warmth, and happiness,",
  Riley: "Season's greetings and best wishes for a New Year filled with joy,",
  Kennedy: "May the holiday spirit bring you and yours love and laughter,",
  Casey:
    "Sending you warm wishes for a holiday season brimming with joy and peace,",
  Bailey:
    "May the joy and festivities continue to radiate in your lives, long after Christmas is gone,",
};
const second = {
  Rita: "Sikerekben gazdag boldog Új Évet Kívánok \n Sándor",
  Ani: "Sikerekben gazdag boldog Új Évet Kívánok \n Sándor",
};

export function Texts({ nameFromUrl, isMobile }) {
  console.log(isMobile, "isisisis-==-==");
  const textToShow = pathTextMapping[nameFromUrl] || "Happy Holidays";

  const text2 =
    second[nameFromUrl] ||
    "Wishing you a Merry Christmas filled withlove, joy and happiness.";

  return (
    <>
      <Text3D
        letterSpacing={0.06}
        size={0.3}
        font="/Inter_Bold.json"
        position={[-2.8, 3.3, 10]}
        color="red"
      >
        SANDOR DESI
        <meshPhysicalMaterial
          metalness={0.2}
          roughness={0.2}
          color={"#a1a1a1"}
        />
      </Text3D>
      <Billboard>
        <Text
          font="/PhotographSignature.ttf"
          maxWidth={4.5}
          textAlign="center"
          position={[0, 12.45, 0]}
          fontSize="0.45"
          lineHeight={1.16}
        >
          {textToShow}
          {nameFromUrl}.{"\n\n"} {text2}
        </Text>
        {/* ... other Text components ... */}
      </Billboard>
    </>
  );
}
