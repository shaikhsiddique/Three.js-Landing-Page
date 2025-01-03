// Import necessary dependencies and modules
import "./style.css";  // Import the CSS file for styling
import * as THREE from "three";  // Import Three.js library
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";  // Import OrbitControls for camera manipulation
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";  // Import GLTFLoader for loading 3D models
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";  // Import RGBELoader for loading HDR environment maps

// Create a scene in Three.js
const scene = new THREE.Scene();

// Set up a camera with a field of view of 75 degrees, aspect ratio, and near/far planes for visibility
const camera = new THREE.PerspectiveCamera(
  75,  // Field of view
  window.innerWidth / window.innerHeight,  // Aspect ratio
  0.1,  // Near plane distance
  1000  // Far plane distance
);
camera.position.z = 5;  // Position the camera along the Z-axis

// Initialize GLTFLoader to load 3D models in the GLTF format
const loader = new GLTFLoader();

// Load the 3D model of a damaged helmet (GLTF file)
loader.load(
  "/DamagedHelmet.gltf",  // Path to the GLTF model
  (gltf) => {  // Callback function when the model is loaded successfully
    // Traverse all the child objects of the loaded model and set properties if they are meshes
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        // Set the environment map intensity and ensure the material is updated
        child.material.envMapIntensity = 1;
        child.material.needsUpdate = true;
      }
    });
    console.log(gltf);  // Log the loaded model for debugging
    scene.add(gltf.scene);  // Add the model to the scene
  },
  undefined,  // Optional progress callback (not used here)
  (error) => {  // Callback function in case of error
    console.error("Error loading GLTF model:", error);
  }
);

// Initialize RGBELoader to load HDR environment map (for realistic lighting)
const rgbeLoader = new RGBELoader();
rgbeLoader.load(
  "https://dl.polyhaven.org/file/ph-assets/HDRIs/exr/4k/blue_photo_studio_4k.exr",  // Path to the HDR texture
  (texture) => {  // Callback function when the HDR texture is loaded successfully
    scene.background = texture;  // Set the environment as the scene background
    scene.environment = texture;  // Apply the environment map for lighting
    texture.mapping = THREE.EquirectangularReflectionMapping;  // Set the mapping type for the environment texture
  },
  undefined,  // Optional progress callback (not used here)
  (error) => {  // Callback function in case of error
    console.error("Error loading HDR texture:", error);
  }
);

// Select the canvas element from the DOM (HTML)
const canvas = document.querySelector("#canvas");
if (!canvas) {
  console.error("Canvas element not found!");  // Log an error if the canvas is not found
} else {
  // Initialize the WebGL renderer with the canvas element
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,  // Attach the renderer to the canvas element
    antialias: true,  // Enable anti-aliasing for smoother edges
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));  // Set pixel ratio for better resolution on high-DPI screens
  renderer.setSize(window.innerWidth, window.innerHeight);  // Set the renderer size to match window dimensions
  renderer.outputEncoding = THREE.LinearEncoding;  // Set the color encoding

  // Initialize OrbitControls to allow camera manipulation via mouse or touch
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;  // Enable smooth camera movement

  // Update the camera and renderer size when the window is resized
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;  // Update camera aspect ratio
    camera.updateProjectionMatrix();  // Recalculate camera projection matrix
    renderer.setSize(window.innerWidth, window.innerHeight);  // Resize the renderer
  });

  // Animation loop to continuously render the scene and update controls
  function animate() {
    requestAnimationFrame(animate);  // Request the next frame
    controls.update();  // Update the controls (for smooth camera movement)
    renderer.render(scene, camera);  // Render the scene with the camera
  }
  animate();  // Start the animation loop
}
