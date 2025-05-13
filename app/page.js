// components/ModelComponent.js
"use client";

/** *********************************************************************
 * ModelComponent
 * ------------------------------------------------------------
 * ✔ Carica un modello GLB, spegne le luci interne, rende i materiali
 *   metallici/lucidi e mostra un loader durante il download.
 * ✔ Il percorso del file è calcolato dinamicamente così funziona sia
 *   in locale che in produzione (basePath, sottocartelle, ecc.).
 * ✔ Niente commenti "//" dentro il JSX → nessun errore ESLint
 *   (react/jsx‑no‑comment‑textnodes).
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
// 1. Percorso GLB robusto (gestisce eventuale basePath in next.config.js)
//    Esempio: se basePath = '/portfolio', MODEL_URL diventa '/portfolio/model.glb'
//──────────────────────────────────────────────────────────────────────────
const MODEL_URL = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/model.glb`;

// Pre‑download in background non appena possibile
useGLTF.preload(MODEL_URL);

//──────────────────────────────────────────────────────────────────────────
// 2. Component: Model
//──────────────────────────────────────────────────────────────────────────
function Model() {
  const { scene } = useGLTF(MODEL_URL);

  useEffect(() => {
    scene.traverse((obj) => {
      // Spegne luci esportate dal programma di modellazione
      if (obj.isLight) obj.visible = false;

      // Rende qualsiasi materiale metallico e lucido
      if (obj.isMesh && obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((mat) => {
          if ('metalness' in mat) mat.metalness = 1;
          if ('roughness' in mat) mat.roughness = 0.05;
          if ('envMapIntensity' in mat) mat.envMapIntensity = 2;
          mat.needsUpdate = true;
        });
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
}

//──────────────────────────────────────────────────────────────────────────
// 3. Loader (spinner centrato)
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
// 4. ModelComponent wrapper
//──────────────────────────────────────────────────────────────────────────
export default function ModelComponent() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 1, 5], fov: 60 }}
      >
        {/* HDRI ambiente per riflessi metallo */}
        <Environment preset="city" />

        {/* Luci da studio -------------------------------------------------*/}
        <pointLight position={[0, -2, 3]} intensity={8} distance={25} castShadow />
        <pointLight position={[2, 2, 3]} intensity={2.5} distance={25} castShadow />
        <pointLight position={[2, 1, -2]} intensity={1.5} distance={25} castShadow />

        {/* Modello 3D dentro React.Suspense ------------------------------*/}
        <Suspense fallback={<Loader />}>
          <Model />
        </Suspense>

        {/* Controlli orbitali con damping -------------------------------*/}
        <OrbitControls enableDamping />
      </Canvas>
    </div>
  );
}
