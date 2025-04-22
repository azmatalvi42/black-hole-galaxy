# 🌌 Galaxy Generator + Black Hole Visualizer  
Built with Three.js, GSAP, and Postprocessing  

This started as a simple galaxy particle generator and evolved into a fully interactive, animated scene — complete with a glowing black hole that sucks in stars from all directions.

Everything is tweakable live through a GUI. It's like building a little sci-fi universe from scratch with sliders.

## ✨ Features

- Procedurally generated galaxy with adjustable:
  - Star count
  - Radius
  - Spin
  - Branches
  - Randomness
  - Inside and outside colors
- Black hole animation that simulates gravity using directional force
- Toggleable camera animation (warp jump into the black hole core)
- Glowing crystal core using physical material and bloom
- Organized GUI with separate folders for galaxy, colors, and black hole controls
- Fog, bloom, and tone mapping for that cinematic glow

## 🎮 Controls

Open the GUI and adjust values in real-time:
- `Galaxy Settings`: Particle count, shape, randomness
- `Colors`: Inside and outside color of the galaxy
- `Black Hole Controls`: Trigger warp jump or activate black hole gravity mode

## 📦 Stack

- [Three.js](https://threejs.org/)
- [GSAP](https://greensock.com/gsap/)
- [lil-gui](https://lil-gui.georgealways.com/)
- [EffectComposer + UnrealBloomPass](https://threejs.org/docs/#examples/en/postprocessing/UnrealBloomPass)

## 🧪 To Run

```bash
npm install
npm run dev
