import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import * as dat from 'dat.gui';
import { Vector2 } from 'three';
import gsap from 'gsap';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

//Debugging
const gui = new dat.GUI();


// Scene
const scene = new THREE.Scene()
// scene.background = new THREE.Color(0xE5E5E5)



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 5
camera.position.y = 6
camera.position.z = 5;
scene.add(camera)

let topView = false;
document.addEventListener('keydown', function (event) {
    if (event.keyCode == 17) {
        if (!topView) {
            // controls.enabled = false
            pieces.forEach((piece) => {
                gsap.to(piece.rotation, { x: Math.PI, duration: 3 })
                piece.position.y = 0.1;
            })

            camera.position.set(0, 8, 0)
        
            topView = true;
        }
        else { 
            pieces.forEach((piece) => {
                gsap.to(piece.rotation, { x: 0, duration: 3 })
                piece.position.y = 0;
            })

            camera.position.set(5, 4, 8)
            topView = false;
         }
    
    
        
    }
});

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Lights
 */
const ambLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambLight)
// const pointLight = new THREE.PointLight(0xffffff, 2);
// scene.add(pointLight)
var hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
hemiLight.position.set( 0, 300, 0 );
scene.add( hemiLight );

var dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
dirLight.position.set( 75, 300, -75 );
scene.add( dirLight );



const loader = new GLTFLoader();
const fbxLoader = new FBXLoader()
/**
 * Background
 */
// fbxLoader.load('/background/room/uploads_files_2421249_TV+Room+by+Deline.FBX', (room) => {
//     scene.add(room);
// })

loader.load('/background/table/table.gltf', (table) => {
    table.scene.scale.set(18,18,18)
    table.scene.position.set(1.4455871319605489, -13.33, -1.155686279147055);
    scene.add(table.scene)

})

const loadBoard = (url) => {
    loader.load(url,
        (model) => {
            model.scene.scale.set(2 * 20, 2 * 20, 2 * 20)
            model.scene.position.set(-0.202675053425, 0, -0.4186402896015)
            scene.add(model.scene)
        })
}
loadBoard('/chess_board__pieces/untitled.glb')

const createPlane = (dimensions) => {
    const plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(dimensions.x, dimensions.y),
        new THREE.MeshStandardMaterial({
            color: 0xffffff,
            visible: false
        })
    )
   
    plane.rotateX(-Math.PI / 2);
    scene.add(plane);

    return plane;
}

const plane = createPlane({ x: 8, y: 8 }, 1)
plane.position.y = 0.02;
plane.name = 'ground'




const pieces = [];
const loadModels = (url, scale, position, attr) => {
    loader.load(url,
        (model) => {
            model.scene.scale.set(scale.x, scale.y, scale.z)
            model.scene.position.set(position.x, position.y, position.z)
            
            pieces.push(model.scene);
           
            model.scene.traverse(o => {
                if (o.isMesh) {
                    if (attr.color === 'white') {
                        o.userData.draggable = true;
                        o.material.color = new THREE.Color(0xCC9544)
                    }
                    else {
                        o.userData.draggable = true;
                        o.material.color = new THREE.Color(0x413F42)
                    }
                }
                // ...
              });

            //mark draggable
            model.scene.userData.color = attr.color;
            model.scene.userData.draggable = true;

                
            scene.add(model.scene);
    })
}

const loadPieces = (rook, knight, bishop, king, queen, pawn , attr) => {
    /**
     * Rook
     */
    loadModels(rook.url,
        {
            x: 0.38,
            y: 0.38,
            z: 0.38
        },
        {
            x: rook[1].x,
            y: rook[1].y,
            z: rook[1].z,
        },

        attr
    );
    loadModels(rook.url,
        {
            x: 0.38,
            y: 0.38,
            z: 0.38
        },
        {
            x: rook[2].x,
            y: rook[2].y,         
            z: rook[2].z
        },

        attr
    );

    /**
     * Knight
     */
    loadModels(knight.url,
        {
            x: 0.38,
            y: 0.38,
            z: 0.38
        },
        {
            x: knight[1].x,
            y: knight[1].y,
            z: knight[1].z,
        },

        attr
    );
    loadModels(knight.url,
        {
            x: 0.38,
            y: 0.38,
            z: 0.38
        },
        {
            x: knight[2].x,
            y: knight[2].y,
            z: knight[2].z,
        },

        attr
    );

    /**
     * Bishop
     */
    loadModels(bishop.url,
        {
            x: 0.38,
            y: 0.38,
            z: 0.38
        },
        {
            x: bishop[1].x,
            y: bishop[1].y,
            z: bishop[1].z,
        },

        attr
    );
    loadModels(bishop.url,
        {
            x: 0.38,
            y: 0.38,
            z: 0.38
        },
        {
            x: bishop[2].x,
            y: bishop[2].y,
            z: bishop[2].z,
        },

        attr
    );

    /**
     * King
     */
    loadModels(king.url,
        {
            x: .38,
            y: .38,
            z: .38
        },
        {
            x: king.x,
            y: king.y,      
            z: king.z,
        },

        attr
    );
    /**
     * Queen
     */
    loadModels(queen.url,
        {
            x: 0.38,
            y: 0.38,
            z: 0.38
        },
        {
            x: queen.x,
            y: queen.y,
            z: queen.z,
        },

        attr
    );
    /**
     * Pawn
     */
    for (let i = 0; i < 8; i++) {
        loadModels(pawn.url,
            {
                x: 0.38,
                y: 0.38,
                z: 0.38
            },
            {
                x: pawn.x + i,
                y: pawn.y,        
                z: pawn.z,
            },

            attr
        );
    }
}
   
loadPieces(
    { url: '/chessPieces/rook.gltf' ,    1: { x: -3.5, y: 0, z: -3.5, }, 2: { x: 3.5, y: 0,  z: -3.5} },
    { url: '/chessPieces/knight.gltf' ,  1: { x:  2.5, y: 0, z: -3.5, }, 2: { x: -2.5, y: 0, z: -3.5} },
    { url: '/chessPieces/bishop.gltf' ,  1: { x:  1.5, y: 0,z:  -3.5, }, 2: { x: -1.5, y: 0, z: -3.5} },
    { url: '/chessPieces/king.gltf'   ,       x:  0.5, y: 0, z: -3.5  },
    { url: '/chessPieces/queen.gltf' ,        x: -0.5, y: 0, z: -3.5},
    { url: '/chessPieces/pawn.gltf', x: -3.5, y: 0, z: -2.5 },
    { color: 'white' }
)
    
loadPieces(
    { url: '/chessPieces/rook.gltf' ,    1: { x: -3.5, y: 0, z: 3.5, }, 2: { x: 3.5, y: 0,  z: 3.5} },
    { url: '/chessPieces/knight.gltf' ,  1: { x:  2.5, y: 0, z: 3.5, }, 2: { x: -2.5, y: 0, z: 3.5} },
    { url: '/chessPieces/bishop.gltf' ,  1: { x:  1.5, y: 0,z:  3.5, }, 2: { x: -1.5, y: 0, z: 3.5} },
    { url: '/chessPieces/king.gltf'   ,       x:  -0.5, y: 0, z: 3.5  },
    { url: '/chessPieces/queen.gltf' ,        x:   0.5, y: 0, z: 3.5},
    { url: '/chessPieces/pawn.gltf', x: -3.5, y: 0, z: 2.5 },
    {color:'black'}
)


    
const player = createPlane({ x: 0.96, y: 1 } ,1);
player.position.y = 0.001;
player.material.visible = false;
player.material.color = new THREE.Color(0xff0000);




const mousePosition = new Vector2();
const mouseMove = new Vector2();
const raycaster = new THREE.Raycaster();

window.addEventListener('mousemove', (e) => {
    mouseMove.x = (e.clientX / window.innerWidth) * 2 -1;
    mouseMove.y = -(e.clientY / window.innerHeight) * 2 + 1;
})

let draggable;
let tempDraggable;
let placeItems = false;
window.addEventListener('click', (e) => {

    if (draggable) draggable = null;

    mousePosition.x = (e.clientX / window.innerWidth) * 2 -1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mousePosition, camera);
    const found = raycaster.intersectObjects(scene.children, true)
    if (found.length > 0 && found[0].object.userData.draggable) {
        draggable = found[0].object.parent.parent;
        console.log(draggable)
    }
    if (placeItems) {
        draggable = null;

        
        if (!topView) {
            if (tempDraggable.userData.color === 'white') {
                gsap.to(camera.position, {
                    x: -0.006723210665970911,
                    y: 4.899999999999998,
                    z: 5.507278043031772,
                    duration: 4
                })
                pieces.forEach((piece) => {
                    gsap.to(piece.rotation, { y: 0, duration: 3 })
                })
            }
            else {
                gsap.to(camera.position, {
                    x: 0.07182235785221572,
                    y: 4.899999999999998,
                    z: -5.806641337477628,
                    duration: 4
                })
                pieces.forEach((piece) => {
                    gsap.to(piece.rotation, { y: Math.PI, duration: 3 })
                })
            }
        }
        else {
            if (tempDraggable.userData.color === 'white') {
                gsap.to(camera.position, {
                    x: -0.006723210665970911,
                    z: 2,
                    duration: 4
                })
                pieces.forEach((piece) => {
                    gsap.to(piece.rotation, { y: Math.PI, duration: 3 })
                })
            }
            else {
                gsap.to(camera.position, {
                    x: 0.07182235785221572,
                    z: -2,
                    duration: 4
                })
                pieces.forEach((piece) => {
                    gsap.to(piece.rotation, { y: 0, duration: 3 })
                })
            }

        }
        placeItems = false;
    }
})


const dragObj = () => {
    if (draggable) {
        raycaster.setFromCamera(mouseMove, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        
    intersects.forEach((intersect) => {
        if (intersect.object.name === 'ground') {
            const position = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5)
            player.position.set(position.x, player.position.y, position.z)
            player.material.visible = true;


            draggable.parent.userData.position = { x: position.x + 3.0, y: position.z - 2.6 }

                draggable.position.x = player.position.x;
                draggable.position.z = player.position.z;
                
            tempDraggable = draggable;
            
            placeItems = true;
              
        }
    })        
}
}

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.setClearColor(0xff0000)

/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    // Update controls
    controls.update()


    //Drag
    dragObj()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()