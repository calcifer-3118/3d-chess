import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'dat.gui';
import { EquirectangularReflectionMapping, Vector2, Vector3 } from 'three';
import gsap from 'gsap';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

//Debugging
// const gui = new dat.GUI();


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

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = 10;
controls.maxDistance = 12;

/**
 * Lights
 */
// const ambLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambLight)
// // const pointLight = new THREE.PointLight(0xffffff, 2);
// // scene.add(pointLight)
// var hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
// hemiLight.position.set( 0, 300, 0 );
// scene.add( hemiLight );

// var dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
// dirLight.position.set( 75, 300, -75 );
// scene.add( dirLight );

const envMapLoader = new RGBELoader();
envMapLoader.load('https://calcifer-3118.github.io/3d-chess/env.hdr', (env)=>{
    env.mapping = EquirectangularReflectionMapping;
    scene.background = env;
    scene.environment = env
})


/**
 * Loading Models
 */
//Table
const loader = new GLTFLoader();
loader.load('https://calcifer-3118.github.io/3d-chess/background/table/table.gltf', (table) => {
    table.scene.scale.set(18,18,18)
    table.scene.position.set(1.4455871319605489, -13.33, -1.155686279147055);
    scene.add(table.scene)

})
//Chess Board
const loadBoard = (url) => {
    loader.load(url,
        (model) => {
            model.scene.scale.set(2 * 20, 2 * 20, 2 * 20)
            model.scene.position.set(-0.202675053425, 0, -0.4186402896015)
            scene.add(model.scene)
        })
}
loadBoard('https://calcifer-3118.github.io/3d-chess/chess_board/untitled.glb')

//Chess_BasePlane => Required
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
plane.name = 'ground' //Required to check if raycaster hits a piece...



let pieces = [];
const loadModels = (url, scale, position, attr) => {
    loader.load(url,
        (model) => {
            model.scene.scale.set(scale.x, scale.y, scale.z)
            model.scene.position.set(position.x, position.y, position.z)
            
            pieces.push(model.scene);
           
            model.scene.traverse(o => {
                if (o.isMesh) {
                    //mark draggable
                    o.userData.draggable = true;

                    if (attr.color === 'white') {
                        o.material.color = new THREE.Color(0xCC9544)
                    }
                    else {
                        o.material.color = new THREE.Color(0x413F42)
                    }
                }
                // ...
              });

              model.scene.children[0].traverse((o)=>{
                if(typeof o == 'object'){
                    o.position.set(0,0,0)
                }
              })

            model.scene.userData.color = attr.color;

            document.getElementById('loader').style.display = 'none';    
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
    { url: 'https://calcifer-3118.github.io/3d-chess/chessPieces/rook.gltf' ,    1: { x: -3.5, y: 0, z: -3.5, }, 2: { x:  3.5, y: 0, z: -3.5} },
    { url: 'https://calcifer-3118.github.io/3d-chess/chessPieces/knight.gltf' ,  1: { x:  2.5, y: 0, z: -3.5, }, 2: { x: -2.5, y: 0, z: -3.5} },
    { url: 'https://calcifer-3118.github.io/3d-chess/chessPieces/bishop.gltf' ,  1: { x:  1.5, y: 0, z: -3.5, }, 2: { x: -1.5, y: 0, z: -3.5} },
    { url: 'https://calcifer-3118.github.io/3d-chess/chessPieces/king.gltf'   ,       x:  0.5, y: 0, z: -3.5  },
    { url: 'https://calcifer-3118.github.io/3d-chess/chessPieces/queen.gltf' ,        x: -0.5, y: 0, z: -3.5},
    { url: 'https://calcifer-3118.github.io/3d-chess/chessPieces/pawn.gltf', x: -3.5, y: 0, z: -2.5 },
    { color: 'white' }
)
    
loadPieces(
    { url: 'https://calcifer-3118.github.io/3d-chess/chessPieces/rook.gltf' ,    1: { x: -3.5, y: 0, z: 3.5, }, 2: { x: 3.5, y: 0,  z: 3.5} },
    { url: 'https://calcifer-3118.github.io/3d-chess/chessPieces/knight.gltf' ,  1: { x:  2.5, y: 0, z: 3.5, }, 2: { x:-2.5, y: 0, z: 3.5} },
    { url: 'https://calcifer-3118.github.io/3d-chess/chessPieces/bishop.gltf' ,  1: { x:  1.5, y: 0, z: 3.5, }, 2: { x:-1.5, y: 0, z: 3.5} },
    { url: 'https://calcifer-3118.github.io/3d-chess/chessPieces/king.gltf'   ,       x: -0.5, y: 0, z: 3.5  },
    { url: 'https://calcifer-3118.github.io/3d-chess/chessPieces/queen.gltf' ,        x:  0.5, y: 0, z: 3.5},
    { url: 'https://calcifer-3118.github.io/3d-chess/chessPieces/pawn.gltf', x: -3.5, y: 0, z: 2.5 },
    {color:'black'}
)


//Highlights piece position
const highlight = createPlane({ x: 0.96, y: 1 } ,1);
highlight.position.y = 0.001;
highlight.material.visible = false;
highlight.material.color = new THREE.Color(0x00ff00);




/**
 * Main Logic
 */
const mousePosition = new Vector2();
const mouseMove = new Vector2();
const raycaster = new THREE.Raycaster();

window.addEventListener('mousemove', (e) => {
    mouseMove.x = (e.clientX / window.innerWidth) * 2 -1;
    mouseMove.y = -(e.clientY / window.innerHeight) * 2 + 1;
})

//Changes view on pressing ctlr key (keycode == 17)
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
        // draggable.userData.position = draggable.position;
        pieces = pieces.filter(item => item !== draggable)
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
            highlight.position.set(position.x, highlight.position.y, position.z)
            highlight.material.visible = true;

            pieces.forEach((piece)=>{
                // console.log(`pos:${position} && piece_pos:${piece.position}`)
                
                    if(draggable.position.equals(piece.position)){
                        
                        highlight.material.color = new THREE.Color(0xff0000);
                        placeItems = false;

                    }
                    
                    else{
                       
                    draggable.position.z = highlight.position.z;
                    draggable.position.x = highlight.position.x;

                    tempDraggable = draggable;
                    placeItems = true;

                    highlight.material.color = new THREE.Color(0x00ff00);
                    }
                
                   
                
            })
                
            
              
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
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

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