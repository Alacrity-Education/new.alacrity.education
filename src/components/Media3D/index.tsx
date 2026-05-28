'use client'

import React, { Suspense, useMemo } from 'react'
import { Box3, Vector3 } from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, useProgress, Html } from '@react-three/drei'

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)

  // Offset the scene so its bounding-box center lands exactly at the origin,
  // making the camera's look-at (0,0,0) frame the object correctly.
  const offset = useMemo(() => {
    const box = new Box3().setFromObject(scene)
    return box.getCenter(new Vector3())
  }, [scene])

  return <primitive object={scene} position={[-offset.x, -offset.y, -offset.z]} />
}

function CanvasLoader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
        <span className="text-xs text-base-content/60 tabular-nums">{Math.round(progress)}%</span>
      </div>
    </Html>
  )
}

export function Media3D({ url, defaultZoom = 5 }: { url: string; defaultZoom?: number | null }) {
  const cameraZ = typeof defaultZoom === 'number' ? defaultZoom : 5

  return (
    <Canvas
      gl={{ alpha: true }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
      camera={{ position: [0, 0, cameraZ], fov: 45 }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      <directionalLight position={[-10, -5, -5]} intensity={0.3} />
      <Suspense fallback={<CanvasLoader />}>
        <Model url={url} />
      </Suspense>
      <OrbitControls enableZoom enablePan enableRotate />
    </Canvas>
  )
}
