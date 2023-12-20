import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { useState, useEffect, Suspense } from "react";
import PostProcessingEffects from "./PostProcessingEffects";
import SnowGlobeModel from "./SnowGlobeModel";
import Overlay from "./Overlay";
import SceneSetup from "./Scene";

export default function App() {
  const [inside, setInside] = useState(false);
  const [urlSegment, setUrlSegment] = useState(""); // State to store the URL segment
  const [orientation, setOrientation] = useState(window.orientation); // Add orientation state

  const isMobile = window.innerWidth < 768;
  const canvasConfig = {
    antialias: false,
    depth: false,
    stencil: false,
    alpha: false,
  };
  console.log(orientation, "ori =-=-=-=-=-=-=-==-=-=");

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.orientation); // Update orientation on change
    };

    window.addEventListener("orientationchange", handleOrientationChange);

    const pathSegments = window.location.pathname.split("/");
    if (pathSegments.length > 1) {
      setUrlSegment(pathSegments[1]);
    }

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange); // Clean up
    };
  }, []);

  const hu = ["Rita", "Ani"];

  if (orientation === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // Full viewport height
          fontSize: "2em", // Larger text
          textAlign: "center",
          padding: "20px", // Padding for smaller screens
        }}
      >
        {hu.includes(urlSegment)
          ? `"Kérlek, fordítsd a telefont tájkép/horizontalis módba ⤵️ `
          : `Please turn your device to landscape mode. ⤵️`}
      </div>
    );
  }

  return (
    <>
      {/* {urlSegment && <div>URL Segment: {urlSegment}</div>} */}
      <Canvas
        gl={canvasConfig}
        camera={{ position: [0, 0, 5], fov: 35, far: 20000 }}
        dpr={1}
      >
        <Suspense fallback={null}>
          <SceneSetup isMobile={isMobile} />
          <SnowGlobeModel
            nameFromUrl={urlSegment}
            isMobile={isMobile}
            position={[0, -1.1, 0]}
            scale={0.09}
            inside={inside}
          />
          <PostProcessingEffects />
        </Suspense>
      </Canvas>
      <Overlay inside={inside} setInside={setInside} name={urlSegment} />
      <Loader />
      {/* Optionally render the URL segment value somewhere in your component */}
    </>
  );
}
