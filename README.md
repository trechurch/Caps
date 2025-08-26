3D Earth Sphere with Caps

A 3D visualization tool for creating and managing spherical caps on a wireframe Earth using Three.js and dat.GUI.

Setup





Ensure Files:





index.html: Main HTML file.



caps.js: JavaScript logic.



OrbitControls.js: Modified UMD version for 3D navigation.



dat.gui.min.js: dat.GUI for control panel (required locally).



Download Dependencies:





dat.gui.min.js: [https://github.com/dataarts/dat.gui/raw/master/build/dat.gui.min.js]



OrbitControls.js: Download [https://unpkg.com/three@0.167.0/examples/js/controls/OrbitControls.js], modify with console.log('OrbitControls is the updated version') and convert to UMD as shown in the code.



three.min.js: [https://unpkg.com/three@0.167.0/build/three.min.js] (optional, use CDN in index.html)



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



Loading Errors: Ensure all local files are present and correctly converted to UMD.



Check console (F12) for errors, including the 'OrbitControls is the updated version' log.
