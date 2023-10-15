import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import fragmentShader from '../shaders/fragment.glsl'
import vertexShader from '../shaders/vertex.glsl'

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
	45,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
)
camera.position.set(15, 15, 30)

const orbit = new OrbitControls(camera, renderer.domElement)

const axesHelper = new THREE.AxesHelper(5)
const gridHelper = new THREE.GridHelper(30)

const ambientLight = new THREE.AmbientLight(0xffffffaa)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5)
directionalLight.position.set(-30, 30, -10)

const boxGeometry = new THREE.BoxGeometry(5, 5, 5)
const boxMaterial = new THREE.MeshLambertMaterial({ color: 0x1ff5b0 })
const box = new THREE.Mesh(boxGeometry, boxMaterial)
box.position.set(0, 3, 0)
scene.add(
	box,
	axesHelper,
	gridHelper,
	ambientLight,
	directionalLight,
	dLightHelper
)

const planeGeometry = new THREE.PlaneGeometry(30, 30)
const planeMaterial = new THREE.MeshLambertMaterial({
	color: 0xffffff,
	side: THREE.DoubleSide,
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
plane.rotation.x = -0.5 * Math.PI

const sphereGeometry = new THREE.SphereGeometry(3)
const sphereMaterial = new THREE.ShaderMaterial({
	vertexShader: vertexShader,
	fragmentShader: fragmentShader,
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere)
sphere.position.set(-10, 3, -10)

const docGeometry = new THREE.DodecahedronGeometry(3)
const docMaterial = new THREE.MeshLambertMaterial({ color: 0x9348f3 })
const doc = new THREE.Mesh(docGeometry, docMaterial)
scene.add(doc)
doc.position.set(10, 3, 10)

function animate() {
	renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)
