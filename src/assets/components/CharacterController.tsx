import { CapsuleCollider, IntersectionEnterPayload, RapierRigidBody, RigidBody, vec3 } from "@react-three/rapier"
import { Character } from "./Character"
import { useKeyboardControls } from "@react-three/drei"
import { Controls } from "../../Game"
import { useEffect, useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Group, Vector3 } from "three"
import { useGameStore } from "../Store"
import { CharState } from "../shared/types"

const JUMP_FORCE = .7
const SPEED = .1
const MAX_SPEED = 3
const RUN_SPEED = 1

export const CharacterController = () => {
    const isForwardPressed = useKeyboardControls((state) => state[Controls.forward])
    const isBackPressed = useKeyboardControls((state) => state[Controls.back])
    const isLeftPressed = useKeyboardControls((state) => state[Controls.left])
    const isRightPressed = useKeyboardControls((state) => state[Controls.right])
    const isJumpPressed = useKeyboardControls((state) => state[Controls.jump])


    const rb = useRef<RapierRigidBody>(null)
    const char = useRef<Group>(null)
    const isGrounded = useRef(true)

    const [charState, setCharState] = useState<CharState>(CharState.IDLE)

    const onCollisionEnter = (): void => {
        isGrounded.current = true
    }

    const onCollisionExit = (): void => {
        isGrounded.current = false
        setCharState(CharState.JUMP)
    }

    const resetPlayer = (): void => {
        rb.current?.setTranslation(vec3({ x: 0, y: 0, z: 0 }), false)
        rb.current?.setLinvel(vec3({ x: 0, y: 0, z: 0 }), false)
    }

    const onIntersectionEnter = (collision: IntersectionEnterPayload): void => {
        if (collision.other.rigidBodyObject?.name === 'void') {
            resetPlayer()
        }
    }

    useFrame(() => {
        const impulse = new Vector3(0, 0, 0)
        if (isJumpPressed && isGrounded.current) {
            impulse.y += JUMP_FORCE
        }

        const linearVel = rb.current?.linvel()
        if (!linearVel) {
            return
        }
        let changeRot = false

        if (isRightPressed && linearVel.x < MAX_SPEED) {
            impulse.x += SPEED
            changeRot = true
        } else if (isLeftPressed && linearVel.x > -MAX_SPEED) {
            impulse.x -= SPEED
            changeRot = true
        }

        if (isForwardPressed && linearVel.z > -MAX_SPEED) {
            impulse.z -= SPEED
            changeRot = true
        } else if (isBackPressed && linearVel.z < MAX_SPEED) {
            impulse.z += SPEED
            changeRot = true
        }

        if (changeRot) {
            const angle = Math.atan2(linearVel.x, linearVel.z)
            if (char.current) {
                char.current.rotation.y = angle
            }
        }

        rb.current?.applyImpulse(impulse, true)

        if (Math.abs(linearVel.x) > RUN_SPEED || Math.abs(linearVel.z) > RUN_SPEED) {
            if (charState !== CharState.RUNNING && isGrounded.current) {
                setCharState(CharState.RUNNING)
            }
        } else {
            if (charState !== CharState.IDLE && isGrounded.current) {
                setCharState(CharState.IDLE)
            }
        }
    })

    useEffect(() => useGameStore.subscribe((state) => state.currentStage, resetPlayer), [])
    useEffect(() => useGameStore.subscribe((state) => state.wrongAnswers, resetPlayer), [])

    return (
        <group>
            <RigidBody
                ref={rb}
                colliders={false}
                scale={[.5, .5, .5]}
                enabledRotations={[false, false, false]}
                onCollisionEnter={onCollisionEnter}
                onCollisionExit={onCollisionExit}
                onIntersectionEnter={onIntersectionEnter}>

                <CapsuleCollider args={[1.3, 0.5]} position={[0, 1.8, 0]} />
                <group ref={char}>
                    <Character state={charState} />
                </group>

            </RigidBody>
        </group>
    )
}