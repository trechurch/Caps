3D Earth Sphere with Caps

A 3D visualization tool for creating and managing spherical caps on a wireframe Earth using Three.js and dat.GUI.

Setup





Ensure Files:





index.html: Main HTML file.



caps.js: JavaScript logic.



three.min.js: Three.js library.



OrbitControls.js: OrbitControls for 3D navigation.



dat.gui.min.js: dat.GUI for control panel.



Download Dependencies (if not present):





three.min.js



OrbitControls.js



dat.gui.min.js



Run Locally:





Place all files in the same directory.



Run: python -m http.server 8000



Open: http://localhost:8000/index.html in Chrome or Firefox.



Run via GitHub Pages:





Push to a GitHub repository.



Enable GitHub Pages in Settings > Pages > Source: main branch, / (root).



Visit the provided URL (e.g., https://username.github.io/repository-name/).

Expected Output





A 3D green wireframe Earth (icosahedron, radius 6371 km).



Red wireframe caps (Houston, LA) with yellow directional segments.



dat.GUI panel (top-right) for background/wireframe colors, rotation, and cap controls.



Interact: Orbit (left-click drag), zoom (scroll), pan (right-click drag).

Troubleshooting





Text Display: Use a local server (http://localhost:8000/index.html), not file://.



Three.js Error: Verify three.min.js and OrbitControls.js are in the root directory with exact names.



Check console (F12) for errors.
