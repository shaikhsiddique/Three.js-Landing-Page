import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const loader = new GLTFLoader();

loader.load('/DamagedHelmet.gltf', (gltf) => {
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.material.envMapIntensity = 1;
      child.material.needsUpdate = true;
    }
  });
  console.log(gltf);
  scene.add(gltf.scene);
}, undefined, (error) => {
  console.error('Error loading GLTF model:', error);
});

const rgbeLoader = new RGBELoader();
rgbeLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/exr/4k/blue_photo_studio_4k.exr', (texture) => {
  scene.background = texture;
  scene.environment = texture;
  texture.mapping = THREE.EquirectangularReflectionMapping;
}, undefined, (error) => {
  console.error('Error loading HDR texture:', error);
});

const canvas = document.querySelector('#canvas');
if (!canvas) {
  console.error('Canvas element not found!');
} else {
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.LinearEncoding;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}
