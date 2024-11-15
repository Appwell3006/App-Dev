// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-115, 90, 1);  // Adjusted starting position

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);  // Set background to white
renderer.shadowMap.enabled = true;  // Enable shadow map
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);  // Soft white light
scene.add(ambientLight);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;  // Enable shadows for the light
scene.add(directionalLight);

// Create a ground plane to receive shadows
const planeGeometry = new THREE.PlaneGeometry(500, 500);
const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1;
plane.receiveShadow = true;  // Enable shadows for the plane
scene.add(plane);

// GLTF Loader
const loader = new THREE.GLTFLoader();
let model; // Variable to store the loaded model
loader.load('load.gltf', function(gltf) {
    model = gltf.scene;
    model.traverse(function(node) {
        if (node.isMesh) {
            node.castShadow = true;  // Enable shadows for the model
            node.receiveShadow = true;
        }
    });
    scene.add(model);
}, undefined, function(error) {
    console.error(error);
});

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    // Auto-rotate the model (Y-axis only)
    if (model) {
        model.rotation.y += 0.001;  // Rotate around Y-axis
    }

    controls.update();
    renderer.render(scene, camera);
}
animate();
