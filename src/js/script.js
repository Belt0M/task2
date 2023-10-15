import { GUI } from 'dat.gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import fragmentShader from '../shaders/fragment.glsl'
import fragmentBoxShader from '../shaders/fragmentBox.glsl'
import vertexShader from '../shaders/vertex.glsl'
import vertexBoxShader from '../shaders/vertexBox.glsl'

const docParams = {
	color: 0xffffff,
	transmission: 1,
	roughness: 0,
	ior: 1.7,
	thickness: 0.5,
	specularIntensity: 1,
	clearcoat: 1,
	wireframe: false,
}

const boxParams = {
	speed: 1,
}

const directionalLightParams = {
	x: 15,
	y: 20,
	z: -20,
	color: 0xffffff,
}

const spotLightParams = {
	color: 0xffffff,
	angle: 0.15,
	intensity: 5000,
}

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
spotLight.angle = 0.12
spotLight.penumbra = 0.6
spotLight.target.position.set(10, 2, 10)
const spotLightHelper = new THREE.SpotLightHelper(spotLight)
// scene.add(spotLight, spotLightHelper)
scene.add(spotLight)

//Texture loader
const loader = new THREE.TextureLoader()
const envTexture = loader.load('../assets/chinese_garden.jpg')
envTexture.mapping = THREE.EquirectangularReflectionMapping

//Shapes
const boxGeometry = new THREE.BoxGeometry(5, 5, 5)
const boxMaterial = new THREE.ShaderMaterial({
	vertexShader: vertexBoxShader,
	fragmentShader: fragmentBoxShader,
})
const box = new THREE.Mesh(boxGeometry, boxMaterial)
box.position.set(0, 3, 0)
scene.add(
	box,
	ambientLight,
	directionalLight
	// axesHelper,
	// gridHelper,
	// dLightHelper,
	// dLightShadowHelper,
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

const wall1 = new THREE.Mesh(new THREE.PlaneGeometry(20, 15), planeMaterial)
const wall2 = new THREE.Mesh(new THREE.PlaneGeometry(20, 15), planeMaterial)
scene.add(wall1, wall2)
wall1.position.set(5, 5, 15)
wall2.position.set(15, 5, 5)
wall2.rotation.y = Math.PI / 2
wall1.receiveShadow = true
wall2.receiveShadow = true

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
const docMaterial = new THREE.MeshPhysicalMaterial({
	color: 0xffffff,
	transmission: 1,
	roughness: 0,
	ior: 1.7,
	thickness: 0.5,
	specularIntensity: 1,
	clearcoat: 1,
})
const doc = new THREE.Mesh(docGeometry, docMaterial)
scene.add(doc)
doc.position.set(10, 3, 10)
doc.castShadow = true
docMaterial.envMap = envTexture

sphereMaterial.uniforms.uTime = { value: 0 }

//Dat.gui Controllers
const gui = new GUI()
const docFolder = gui.addFolder('Dodecahedron')

docFolder.addColor(docParams, 'color').onChange(e => docMaterial.color.set(e))
docFolder
	.add(docParams, 'transmission', 0.0, 1.0)
	.onChange(e => (docMaterial.transmission = e))
docFolder
	.add(docParams, 'roughness', 0.0, 1.0)
	.onChange(e => (docMaterial.roughness = e))
docFolder.add(docParams, 'ior', 1.0, 2.333).onChange(e => (docMaterial.ior = e))
docFolder
	.add(docParams, 'thickness', 0.0, 1.0)
	.onChange(e => (docMaterial.thickness = e))
docFolder
	.add(docParams, 'specularIntensity', 0.0, 1.0)
	.onChange(e => (docMaterial.specularIntensity = e))
docFolder
	.add(docParams, 'clearcoat', 0.0, 1.0)
	.onChange(e => (docMaterial.clearcoat = e))
docFolder.add(docParams, 'wireframe').onChange(e => (docMaterial.wireframe = e))
docFolder.open()

const boxFolder = gui.addFolder('Box')
boxFolder.add(boxParams, 'speed', 0.1, 2)
boxFolder.open()

const directionLightFolder = gui.addFolder('Direction Light')
directionLightFolder.add(directionalLightParams, 'x', -50, 50)
directionLightFolder.add(directionalLightParams, 'y', 0, 50)
directionLightFolder.add(directionalLightParams, 'z', -50, 50)
directionLightFolder
	.addColor(directionalLightParams, 'color')
	.onChange(e => directionalLight.color.set(e))
directionLightFolder.open()

const spotLightFolder = gui.addFolder('Spot Light')
spotLightFolder
	.addColor(spotLightParams, 'color')
	.onChange(e => spotLight.color.set(e))
spotLightFolder
	.add(spotLightParams, 'angle', 0.0, 1.0)
	.onChange(e => (spotLight.angle = e))
spotLightFolder
	.add(spotLightParams, 'intensity', 1, 20000)
	.onChange(e => (spotLight.intensity = e))
spotLightFolder.open()

//Loop render animation
function animate(time) {
	const timeValue = time / 10000
	sphereMaterial.uniforms.uTime.value = timeValue
	doc.rotation.x = timeValue * 10
	doc.rotation.y = timeValue * 5
	box.position.y =
		2.5 + 3 * Math.abs(Math.sin(timeValue * 15 * boxParams.speed))
	const { x, y, z } = directionalLightParams
	directionalLight.position.set(x, y, z)
	renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)
