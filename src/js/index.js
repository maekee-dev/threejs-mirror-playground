import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js'
import { gsap } from "gsap";

const renderer = new THREE.WebGLRenderer({antialias: true})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    .1,
    1000
)

const orbit = new OrbitControls(camera, renderer.domElement)
orbit.enableZoom = false;

let imageIndex = 1
let hdrTextureURL = new URL('../img/img-1.hdr', import.meta.url)
const loader = new RGBELoader()
loader.load(hdrTextureURL, texture => {
    scene.background = texture,
    scene.environment = texture,
    texture.mapping = THREE.EquirectangularReflectionMapping,
    document.getElementById('loader').style.display = 'none'
})

let sphere = new THREE.Mesh(
    new THREE.SphereGeometry(4, 100, 100),
    new THREE.MeshPhysicalMaterial({
        roughness: 0,
        metalness: 0,
        color: 0xffffff,
        transmission: 1,
        ior: 2,
        reflectivity: 1
    })
)
scene.add(sphere)

camera.position.set(0, 0, 7)
orbit.update()

renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.5

const animate = () => {
    renderer.render(scene, camera)
}
renderer.setAnimationLoop(animate)

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

// FUNCTIONS 

const setTexture = async value => {
    switch(value){
        case 1:
            hdrTextureURL = new URL('../img/img-1.hdr', import.meta.url)
            break
        case 2:
            hdrTextureURL = new URL('../img/img-2.hdr', import.meta.url)
            break
        case 3:
            hdrTextureURL = new URL('../img/img-3.hdr', import.meta.url)
            break
        case 4:
            hdrTextureURL = new URL('../img/img-4.hdr', import.meta.url)
            break
        case 5:
            hdrTextureURL = new URL('../img/img-5.hdr', import.meta.url)
            break
        case 6:
            hdrTextureURL = new URL('../img/img-6.hdr', import.meta.url)
            break
        case 7:
            hdrTextureURL = new URL('../img/img-7.hdr', import.meta.url)
            break
    }
}

const setEnvironment = value => {
    document.getElementById('loader').style.display = 'flex'
    value = parseInt(value)
    setTexture(value)
    loader.load(hdrTextureURL, texture => {
        scene.background = texture,
        scene.environment = texture,
        texture.mapping = THREE.EquirectangularReflectionMapping,
        document.getElementById('loader').style.display = 'none'
    })
    imageIndex = value
}

const scaleObject = value => {
    gsap.to(sphere.scale, .5, { 
        x: value, 
        y: value, 
        z: value
    })
    document.getElementById('dimensionValue').innerHTML = 'x' + value
}

// PLAYGROUND SETUP

const hideButton = document.getElementById('removeBackground')
const showButton = document.getElementById('showBackground')
showButton.disabled = true

hideButton.addEventListener('click', () => {
    scene.background = null
    //gsap.to(sphere.scale, 1, { x: 1.2, y: 1.2, z: 1.2 })
    hideButton.disabled = true
    showButton.disabled = false
})

showButton.addEventListener('click', () => {
    setEnvironment(imageIndex)
    hideButton.disabled = false
    showButton.disabled = true
})

document.getElementById('changeBackground').addEventListener('change', event => {
    setEnvironment(event.target.value)
    hideButton.disabled = false
    showButton.disabled = true
})

document.getElementById('selectFov').addEventListener('change', (event) => {
    camera.fov = event.target.value
    camera.updateProjectionMatrix()
    document.getElementById('fovValue').innerHTML = event.target.value
})

document.getElementById('selectDimension').addEventListener('change', (event) => {
    let value = event.target.value / 100
    scaleObject(value)
})