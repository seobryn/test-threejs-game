import { Canvas } from "@react-three/fiber"
import { Suspense, useMemo } from "react"
import Scene from "./assets/components/Scene"
import { Physics } from "@react-three/rapier"
import { KeyboardControls } from "@react-three/drei"
import { Menu } from "./assets/components/Menu"

export const Controls = {
  forward: "forward",
  back: "back",
  left: "left",
  right: "right",
  jump: "jump"
}

function Game() {

  const keyMap = useMemo(() => ([
    { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
    { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
    { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
    { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
    { name: Controls.jump, keys: ["Space"] },
  ]), [])

  return (
    <KeyboardControls map={keyMap}>
      <Canvas shadows camera={{ position: [0, 6, 14], fov: 42 }}>
        <color attach="background" args={["#dbecfb"]} />
        <fog attach="fog" args={["#dbecfb", 30, 40]} />
        <Suspense>
          <Physics>
            <Scene />
          </Physics>
        </Suspense>
      </Canvas>
      <Menu />
    </KeyboardControls>
  )
}

export default Game
