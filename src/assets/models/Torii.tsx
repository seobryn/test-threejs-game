
import { useGLTF } from '@react-three/drei'
import { Mesh, MeshStandardMaterial } from 'three'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
    nodes: {
        ['Node-Mesh']: Mesh
        ['Node-Mesh_1']: Mesh
    }
    materials: {
        mat23: MeshStandardMaterial
        mat14: MeshStandardMaterial
    }
}

export function Torii(props: JSX.IntrinsicElements['group']) {
    const { nodes, materials } = useGLTF('./models/torii/model.glb') as GLTFResult
    return (
        <group {...props} dispose={null}>
            <mesh geometry={nodes['Node-Mesh'].geometry} material={materials.mat23} />
            <mesh geometry={nodes['Node-Mesh_1'].geometry} material={materials.mat14} />
        </group>
    )
}

useGLTF.preload('./models/torii/model.glb')
