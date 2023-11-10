import { Bone, MeshStandardMaterial, SkinnedMesh } from 'three'
import { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { CharState } from '../shared/types'

type GLTFResult = GLTF & {
    nodes: {
        Cube004: SkinnedMesh
        Cube004_1: SkinnedMesh
        Cube004_2: SkinnedMesh
        Cube004_3: SkinnedMesh
        Cube004_4: SkinnedMesh
        Cube004_5: SkinnedMesh
        Bone: Bone
    }
    materials: {
        Skin: MeshStandardMaterial
        Shirt: MeshStandardMaterial
        Pants: MeshStandardMaterial
        Belt: MeshStandardMaterial
        Face: MeshStandardMaterial
        Hair: MeshStandardMaterial
    }
}

//type ActionName = 'Idle' | 'Jump' | 'Run'
//type GLTFActions = Record<ActionName, AnimationAction>

export function Character(props: JSX.IntrinsicElements['group'] & { state: CharState }) {
    const group = useRef(null)
    const { nodes, materials, animations } = useGLTF('./models/male/model.gltf') as GLTFResult
    const { actions } = useAnimations(animations, group)

    useEffect(() => {
        actions[props.state]?.reset().fadeIn(.1).play()
        return () => {
            actions[props.state]?.fadeOut(.2)
        }
    }, [props.state])

    return (
        <group ref={group} {...props} dispose={null}>
            <group name="Scene">
                <group name="CharacterArmature">
                    <primitive object={nodes.Bone} />
                    <group name="Body_1">
                        <skinnedMesh name="Cube004" geometry={nodes.Cube004.geometry} material={materials.Skin} skeleton={nodes.Cube004.skeleton} />
                        <skinnedMesh name="Cube004_1" geometry={nodes.Cube004_1.geometry} material={materials.Shirt} skeleton={nodes.Cube004_1.skeleton} />
                        <skinnedMesh name="Cube004_2" geometry={nodes.Cube004_2.geometry} material={materials.Pants} skeleton={nodes.Cube004_2.skeleton} />
                        <skinnedMesh name="Cube004_3" geometry={nodes.Cube004_3.geometry} material={materials.Belt} skeleton={nodes.Cube004_3.skeleton} />
                        <skinnedMesh name="Cube004_4" geometry={nodes.Cube004_4.geometry} material={materials.Face} skeleton={nodes.Cube004_4.skeleton} />
                        <skinnedMesh name="Cube004_5" geometry={nodes.Cube004_5.geometry} material={materials.Hair} skeleton={nodes.Cube004_5.skeleton} />
                    </group>
                </group>
            </group>
        </group>
    )
}

useGLTF.preload('./models/male/model.gltf')
