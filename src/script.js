import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import gsap from "gsap";
/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Galaxy

const parameters = {};
parameters.count = 100000;
parameters.size = 0.01;
parameters.radius = 3.92;
parameters.branches = 3;
parameters.spin = 5;
parameters.randomness = 5;
parameters.randomnessPower = 2.5;
parameters.insideColor = "#ffc6f9";
parameters.outsideColor = "#1a0c00";

let geometry = null;
let material = null;
let points = null;

let velocities = null;
let blackHoleActive = false;
const generateGalaxy = () => {
  // Destroy Old Galaxy
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }
  // Geometry
  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);

  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);

  velocities = new Float32Array(parameters.count * 3);
  for (let i = 0; i < parameters.count; i++) {
    // Position
    const i3 = i * 3;

    const radius = Math.random() * parameters.radius;
    const spinAngle = radius * parameters.spin;

    // To choose a different branch for each of the points
    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomY;

    //Color
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / parameters.radius);
    mixedColor.multiplyScalar(5);
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;

    velocities[i3] = 0;
    velocities[i3 + 1] = 0;
    velocities[i3 + 2] = 0;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  //Materials
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  //Points
  points = new THREE.Points(geometry, material);
  scene.add(points);
};

const jumpToBlackHole = () => {
  gsap.to(camera.position, {
    x: 0,
    y: 0,
    z: 0.5,
    duration: 3,
    ease: "power3.inOut",
  });
};

// Additions- Geometry in the center
const crystalMaterial = new THREE.MeshPhysicalMaterial({
  color: "black",
  transmission: 1, // transparency
  roughness: 0.05,
  metalness: 0,
  clearcoat: 1,
  envMapIntensity: 1,
  thickness: 0.5,
});

const crystal = new THREE.Mesh(
  new THREE.DodecahedronGeometry(0.15, 1),
  crystalMaterial
);
scene.add(crystal);

generateGalaxy();

// Gui Addition
// Folders
const galaxyFolder = gui.addFolder("🔭 Galaxy Settings");
const colorFolder = gui.addFolder("🌈 Colors");
const blackHoleFolder = gui.addFolder("🌀 Black Hole Controls");

// Galaxy settings
galaxyFolder
  .add(parameters, "count")
  .min(100)
  .max(1000000)
  .step(100)
  .onFinishChange(generateGalaxy);
galaxyFolder
  .add(parameters, "size")
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(generateGalaxy);
galaxyFolder
  .add(parameters, "radius")
  .min(1)
  .max(10)
  .step(0.01)
  .onFinishChange(generateGalaxy);
galaxyFolder
  .add(parameters, "branches")
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy);
galaxyFolder
  .add(parameters, "spin")
  .min(1)
  .max(5)
  .step(0.1)
  .onFinishChange(generateGalaxy);
galaxyFolder
  .add(parameters, "randomness")
  .min(0)
  .max(5)
  .step(0.001)
  .onFinishChange(generateGalaxy);
galaxyFolder
  .add(parameters, "randomnessPower")
  .min(0)
  .max(5)
  .step(0.001)
  .onFinishChange(generateGalaxy);

// Colors
colorFolder.add(parameters, "insideColor").onFinishChange(generateGalaxy);
colorFolder.add(parameters, "outsideColor").onFinishChange(generateGalaxy);

// Black hole controls
blackHoleFolder
  .add({ activate: () => (blackHoleActive = true) }, "activate")
  .name("Activate Black Hole");
blackHoleFolder
  .add({ reset: () => (blackHoleActive = false) }, "reset")
  .name("Reset Black Hole");
blackHoleFolder
  .add({ jumpToBlackHole }, "jumpToBlackHole")
  .name("View Black Hole");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 2;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// Bloom pass- applies a glow to bright areas of scene

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.2,
  0.4,
  0.85
);
composer.addPass(bloomPass);

scene.fog = new THREE.Fog(0x000000, 1, 5);

const binaryParticles = new THREE.Points(
  new THREE.BufferGeometry().setAttribute(
    "position",
    new THREE.Float32BufferAttribute([0, 1, 2], 3)
  ),
  new THREE.PointsMaterial({
    size: 0.05,
    color: 0x00ffcc,
    transparent: true,
    opacity: 0.8,
  })
);
scene.add(binaryParticles);
scene.background = new THREE.Color("#03020f");
/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  crystal.rotation.y += 0.01;

  const positions = geometry.attributes.position.array;

  if (blackHoleActive) {
    for (let i = 0; i < parameters.count; i++) {
      const i3 = i * 3;

      const x = positions[i3];
      const y = positions[i3 + 1];
      const z = positions[i3 + 2];

      const particlePos = new THREE.Vector3(x, y, z);
      const dir = new THREE.Vector3().copy(particlePos).normalize().negate();
      const distance = particlePos.length();

      const force = 0.002 * Math.exp(-distance); // or try inverse-square
      velocities[i3] += dir.x * force;
      velocities[i3 + 1] += dir.y * force;
      velocities[i3 + 2] += dir.z * force;

      // Optional damping for smoothness
      velocities[i3] *= 0.98;
      velocities[i3 + 1] *= 0.98;
      velocities[i3 + 2] *= 0.98;

      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];

      if (distance < 0.05) {
        // Respawn on a sphere
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = parameters.radius;

        positions[i3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = r * Math.cos(phi);

        velocities[i3] = velocities[i3 + 1] = velocities[i3 + 2] = 0;
      }
    }
  }

  geometry.attributes.position.needsUpdate = true;

  // Update controls
  controls.update();

  // Render
  composer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
