import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import fragmentShader from '../shaders/fragment.glsl'
import vertexShader from '../shaders/vertex.glsl'

//Scene setup
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
	45,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
)
camera.position.set(-10, 20, -35)

//Helpers
const orbit = new OrbitControls(camera, renderer.domElement)
const axesHelper = new THREE.AxesHelper(5)
const gridHelper = new THREE.GridHelper(30)

//Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5)
directionalLight.position.set(-15, 20, -20)
directionalLight.castShadow = true
const dLightShadowHelper = new THREE.CameraHelper(
	directionalLight.shadow.camera
)
directionalLight.shadow.camera.bottom = -35
directionalLight.shadow.camera.top = 20

const spotLight = new THREE.SpotLight(0xffffff, 5000)
spotLight.position.set(-30, 40, -30)
spotLight.angle = 0.2
spotLight.penumbra = 0.5
spotLight.target.position.set(-10, 0, -10)
const spotLightHelper = new THREE.SpotLightHelper(spotLight)
// scene.add(spotLight, spotLightHelper)
scene.add(spotLight)

//Shapes
const boxGeometry = new THREE.BoxGeometry(5, 5, 5)
const boxMaterial = new THREE.MeshLambertMaterial({ color: 0x1ff5b0 })
const box = new THREE.Mesh(boxGeometry, boxMaterial)
box.position.set(0, 3, 0)
scene.add(
	box,
	// axesHelper,
	// gridHelper,
	ambientLight,
	directionalLight
	// dLightHelper
	// dLightShadowHelper
)
box.castShadow = true

const planeGeometry = new THREE.PlaneGeometry(30, 30)
const planeMaterial = new THREE.MeshLambertMaterial({
	color: 0xffffff,
	side: THREE.DoubleSide,
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
plane.rotation.x = -0.5 * Math.PI
plane.receiveShadow = true

const sphereGeometry = new THREE.IcosahedronGeometry(3, 100)
const sphereMaterial = new THREE.ShaderMaterial({
	vertexShader: vertexShader,
	fragmentShader: fragmentShader,
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere)
sphere.position.set(-10, 3.5, -10)
sphere.castShadow = true

const docGeometry = new THREE.DodecahedronGeometry(3)
const docMaterial = new THREE.MeshLambertMaterial({ color: 0x9348f3 })
const doc = new THREE.Mesh(docGeometry, docMaterial)
scene.add(doc)
doc.position.set(10, 3, 10)
doc.castShadow = true

sphereMaterial.uniforms.uTime = { value: 0 }

function animate(time) {
	const timeValue = time / 10000
	sphereMaterial.uniforms.uTime.value = timeValue
	renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)
