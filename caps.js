// Error handling
function showError(message) {
    document.getElementById('error').innerText = message;
    console.error(message);
}

// Debug script loading
console.log('Attempting to load Three.js...');
if (typeof THREE === 'undefined') {
    showError('Three.js failed to load. Ensure three.min.js is in the repository root. Download from https://github.com/mrdoob/three.js/raw/r167/build/three.min.js');
    throw new Error('Three.js not loaded');
}
console.log('Three.js loaded successfully');
if (typeof THREE.OrbitControls === 'undefined') {
    showError('OrbitControls failed to load. Ensure OrbitControls.js is in the repository root. Download from https://github.com/mrdoob/three.js/raw/r167/examples/jsm/controls/OrbitControls.js');
    throw new Error('OrbitControls not loaded');
}
console.log('OrbitControls loaded successfully');
if (typeof dat === 'undefined') {
    showError('dat.GUI failed to load. Ensure dat.gui.min.js is in the repository root. Download from https://github.com/dataarts/dat.gui/raw/master/build/dat.gui.min.js');
}
console.log('dat.GUI loaded successfully');

// Constants
const EARTH_RADIUS = 6371; // km
const SIZE_PRESETS = {
    'Neighborhood': 5,      // km²
    'Small Town': 50,
    'Small City': 250,
    'Large City': 1000,
    'State': 100000
};
const DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

// Calculate theta from area
function getThetaFromArea(area) {
    const totalArea = 2 * Math.PI * EARTH_RADIUS * EARTH_RADIUS;
    const cosTheta = 1 - area / totalArea;
    return Math.acos(cosTheta);
}

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, EARTH_RADIUS * 200);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
console.log('Renderer initialized:', window.innerWidth, 'x', window.innerHeight);

// Earth wireframe (icosahedron)
const earthGeometry = new THREE.IcosahedronGeometry(EARTH_RADIUS, 4);
const earthMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true, transparent: true, opacity: 0.5 });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);
console.log('Earth added to scene');

// Camera controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.minDistance = EARTH_RADIUS + 1;
controls.maxDistance = EARTH_RADIUS * 100;
camera.position.set(0, 0, EARTH_RADIUS * 2);
console.log('Camera and OrbitControls initialized');

// Caps array
let caps = [
    { lat: 29.749907, lon: -95.358421, altitude: 10, size: 'Large City', direction: 'N' }, // Houston
    { lat: 34.052235, lon: -118.243683, altitude: 20, size: 'Large City', direction: 'E' }  // LA
];

// GUI setup
let gui;
try {
    gui = new dat.GUI({ autoPlace: false });
    document.getElementById('gui').appendChild(gui.domElement);
    console.log('dat.GUI initialized');
} catch (e) {
    showError(`dat.GUI failed: ${e.message}. Ensure dat.gui.min.js is in the repository root. 3D canvas still renders.`);
}

// Global controls
const settings = {
    backgroundColor: '#000000',
    wireframeColor: '#00ff00',
    rotateSphere: false,
    addCap: function() {
        const newCap = {
            lat: 0,
            lon: 0,
            altitude: 10,
            size: 'Large City',
            direction: 'N'
        };
        caps.push(newCap);
        addCapToGUI(newCap, caps.length - 1);
        updateCaps();
    }
};

if (gui) {
    gui.addColor(settings, 'backgroundColor').onChange(val => scene.background = new THREE.Color(val));
    gui.addColor(settings, 'wireframeColor').onChange(val => earthMaterial.color.set(val));
    gui.add(settings, 'rotateSphere');
    gui.add(settings, 'addCap').name('Add New Cap');
}

// Add cap controls to GUI
function addCapToGUI(cap, index) {
    if (!gui) return;
    const folder = gui.addFolder(`Cap ${index + 1}`);
    folder.add(cap, 'lat', -90, 90, 0.01).name('Latitude').onChange(updateCaps);
    folder.add(cap, 'lon', -180, 180, 0.01).name('Longitude').onChange(updateCaps);
    folder.add(cap, 'altitude', 0, 10000, 1).name('Altitude (km)').onChange(updateCaps);
    folder.add(cap, 'size', Object.keys(SIZE_PRESETS)).name('Size Preset').onChange(updateCaps);
    folder.add(cap, 'direction', DIRECTIONS).name('Direction').onChange(updateCaps);
    folder.add({ remove: () => {
        caps.splice(index, 1);
        gui.removeFolder(folder);
        updateCaps();
    }}, 'remove').name('Remove Cap');
}

// Initialize GUI for example caps
caps.forEach((cap, index) => addCapToGUI(cap, index));

// Update caps
function updateCaps() {
    scene.children = scene.children.filter(child => !child.userData || !child.userData.isCap);
    caps.forEach(cap => {
        const area = SIZE_PRESETS[cap.size];
        const thetaLength = getThetaFromArea(area);
        const capRadius = EARTH_RADIUS + cap.altitude;

        // Full cap wireframe (red)
        const capGeometry = new THREE.SphereGeometry(capRadius, 32, 16, 0, Math.PI * 2, 0, thetaLength);
        const capEdges = new THREE.EdgesGeometry(capGeometry);
        const capMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const capLines = new THREE.LineSegments(capEdges, capMaterial);

        // Directional segment (yellow)
        const directionIndex = DIRECTIONS.indexOf(cap.direction);
        const startPhi = directionIndex * Math.PI / 4;
        const segmentWidth = Math.PI / 4;
        const dirGeometry = new THREE.SphereGeometry(capRadius, 32, 16, startPhi, segmentWidth, 0, thetaLength);
        const dirEdges = new THREE.EdgesGeometry(dirGeometry);
        const dirMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
        const dirLines = new THREE.LineSegments(dirEdges, dirMaterial);

        // Group for cap
        const capGroup = new THREE.Group();
        capGroup.add(capLines);
        capGroup.add(dirLines);
        capGroup.userData = { isCap: true };

        // Position and orient
        const phi = (90 - cap.lat) * Math.PI / 180;
        const theta = cap.lon * Math.PI / 180;
        const position = new THREE.Vector3().setFromSphericalCoords(capRadius, phi, theta);
        capGroup.position.copy(position);
        const radial = position.clone().normalize();
        capGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), radial);

        scene.add(capGroup);
        console.log(`Cap ${cap.lat}, ${cap.lon} added at position`, position);
    });
    console.log('Caps updated. Scene children:', scene.children.length);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    if (settings.rotateSphere) {
        earth.rotation.y += 0.001;
    }
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initial update
updateCaps();
console.log('Initial render complete');
