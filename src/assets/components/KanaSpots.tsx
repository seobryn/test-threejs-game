import { CylinderCollider, RigidBody } from "@react-three/rapier"
import { useGameStore } from "../Store"
import { Center, Cylinder, Text3D } from "@react-three/drei"

export const KanaSpots = () => {
    const { level, currentStage, mode, kanaTouched } = useGameStore((state) => ({
        level: state.level,
        currentStage: state.currentStage,
        mode: state.mode,
        kanaTouched: state.kanaTouched
    }))

    if (!level) {
        return null
    }

    return level[currentStage].map((kana, idx) => (
        <group key={kana.name} rotation-y={(idx / level[currentStage].length) * 2 * Math.PI}>
            <group position-x={3.5} position-z={-3.5}>
                <RigidBody colliders={false} type="fixed" onCollisionEnter={() => kanaTouched(kana)} >
                    <CylinderCollider args={[0.25 / 2, 1]} />
                    <Cylinder scale={[1, 0.25, 1]}>
                        <meshStandardMaterial color="white" />
                    </Cylinder>
                </RigidBody>
                <Center position-y={.8}>
                    <Text3D
                        font="./fonts/Noto Sans JP ExtraBold.json"
                        size={0.82}
                        rotation-y={-(idx / level[currentStage].length) * 2 * Math.PI}>
                        {kana.character[mode]}
                        <meshNormalMaterial />
                    </Text3D>
                </Center>
            </group>
        </group>
    ))
}