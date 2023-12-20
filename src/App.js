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
  const isMobile = window.innerWidth < 768;
  const canvasConfig = {
    antialias: false,
    depth: false,
    stencil: false,
    alpha: false,
  };

  useEffect(() => {
    const pathSegments = window.location.pathname.split("/"); // Split the pathname
    // Assuming 'Sandor' is the second segment in the URL path
    if (pathSegments.length > 1) {
      setUrlSegment(pathSegments[1]); // Get the second segment
    }
  }, []);

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
      <Overlay inside={inside} setInside={setInside} />
      <Loader />
      {/* Optionally render the URL segment value somewhere in your component */}
    </>
  );
}
