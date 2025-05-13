// components/ModelComponent.js
"use client";

/** *********************************************************************
 * ModelComponent (angolo iniziale 45°)
 * ------------------------------------------------------------
 * Carica il modello, spegne luci interne, applica materiali metallici,
 * mostra un loader e imposta la camera iniziale su un angolo di 45°
 * lungo l'asse Y (vista 3/4) invece che frontale.
 ***********************************************************************/

import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  useGLTF,
  Html,
  Environment,
} from '@react-three/drei';

//──────────────────────────────────────────────────────────────────────────
// Percorso GLB
//──────────────────────────────────────────────────────────────────────────
const MODEL_URL = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/model.glb`;
useGLTF.preload(MODEL_URL);

//──────────────────────────────────────────────────────────────────────────
// Component: Model
//──────────────────────────────────────────────────────────────────────────
function Model() {
  const { scene } = useGLTF(MODEL_URL);

  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isLight) obj.visible = false;
      if (obj.isMesh && obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((mat) => {
          if ("metalness" in mat) mat.metalness = 1;
          if ("roughness" in mat) mat.roughness = 0.05;
          if ("envMapIntensity" in mat) mat.envMapIntensity = 2;
          mat.needsUpdate = true;
        });
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
}

//──────────────────────────────────────────────────────────────────────────
// Loader
//──────────────────────────────────────────────────────────────────────────
function Loader() {
  return (
    <Html center>
      <svg viewBox="0 0 50 50" style={{ width: 64, height: 64 }}>
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="31.4 31.4"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 25 25"
            to="360 25 25"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </Html>
  );
}

//──────────────────────────────────────────────────────────────────────────
// ModelComponent wrapper con camera a 45°
//──────────────────────────────────────────────────────────────────────────
export default function ModelComponent() {
  // Coordinate camera: distanza 5, angolo 45° => x = 3.535, z = 3.535
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [-3.1, -0.4, 3.535], fov: 60 }}
      >
        {/* Ambiente HDRI per riflessi metallico */}
        <Environment preset="city" />

        {/* Luci da studio */}
        <pointLight position={[0, -2, 3]} intensity={8} distance={25} castShadow />
        <pointLight position={[2, 2, 3]} intensity={2.5} distance={25} castShadow />
        <pointLight position={[2, 1, -2]} intensity={1.5} distance={25} castShadow />

        <Suspense fallback={<Loader />}>
          <Model />
        </Suspense>

        {/* OrbitControls con damping e target al centro */}
        <OrbitControls enableDamping />
      </Canvas>
    </div>
  );
}