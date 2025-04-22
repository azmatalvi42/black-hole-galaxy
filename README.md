# black-hole-galaxy

Galaxy Generator with Black Hole Gravity
Built with Three.js + GSAP + Unreal Bloom

This is a personal creative experiment where I built an interactive galaxy simulator in Three.js, and took it a step further with a black hole that pulls in stars dynamically. All of it is customizable through a live GUI.

I wanted something that felt alive and reactive — inspired by space games, data cores, and those trippy visuals you’d see in sci-fi UIs.

🔧 What You Can Do
Generate millions of particles that form spiraling galaxy arms

Adjust galaxy settings like spin, branches, randomness, and radius

Toggle a black hole that sucks in stars from all directions using force-based movement

Switch colors in real-time using GUI controls

Trigger a warp jump camera animation into the black hole’s core

Add cinematic vibes with UnrealBloomPass, fog, glow, and ACES tone mapping

🧠 Tech Stack
Three.js

GSAP for camera animations

lil-gui for live controls

Postprocessing (EffectComposer + UnrealBloomPass)

🚀 Getting Started
bash
Copy
Edit
npm install
npm run dev
Note: You’ll need to use a local server (like Vite or Live Server) to run this — WebGL needs it.
