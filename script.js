// --- Scene Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Sky blue
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- Lighting ---
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 10, 10);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// --- The Track ---
const trackGeometry = new THREE.BoxGeometry(12, 0.5, 1000);
const trackMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
const track = new THREE.Mesh(trackGeometry, trackMaterial);
track.position.z = -450;
scene.add(track);

// --- The Runner ---
const runnerGeometry = new THREE.BoxGeometry(1, 1, 1);
const runnerMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
const runner = new THREE.Mesh(runnerGeometry, runnerMaterial);
runner.position.y = 0.75; // Stay on top of track
scene.add(runner);

// Game Variables
let lane = 0; // -1: Left, 0: Center, 1: Right
const laneWidth = 3;
let score = 0;
let obstacles = [];

// --- Movement ---
window.addEventListener('keydown', (e) => {
    if (e.key === "ArrowLeft" && lane > -1) lane--;
    if (e.key === "ArrowRight" && lane < 1) lane++;
});

// --- Obstacle Logic ---
function spawnObstacle() {
    const objGeo = new THREE.BoxGeometry(2, 1.5, 1);
    const objMat = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const obstacle = new THREE.Mesh(objGeo, objMat);
    
    obstacle.position.z = -50;
    obstacle.position.x = (Math.floor(Math.random() * 3) - 1) * laneWidth;
    obstacle.position.y = 1;
    
    scene.add(obstacle);
    obstacles.push(obstacle);
}

// --- Game Loop ---
camera.position.z = 5;
camera.position.y = 3;
camera.lookAt(runner.position);

function animate() {
    requestAnimationFrame(animate);

    // Smooth lane movement
    runner.position.x = THREE.MathUtils.lerp(runner.position.x, lane * laneWidth, 0.1);

    // Move Obstacles
    obstacles.forEach((obj, index) => {
        obj.position.z += 0.5; // Speed

        // Collision Check
        if (obj.position.z > 4 && obj.position.z < 6 && Math.round(obj.position.x) === Math.round(runner.position.x)) {
            alert("Game Over! Score: " + score);
            location.reload();
        }

        // Remove old obstacles
        if (obj.position.z > 10) {
            scene.remove(obj);
            obstacles.splice(index, 1);
            score++;
            document.getElementById('score').innerText = "Score: " + score;
        }
    });

    if (Math.random() < 0.05) spawnObstacle();

    renderer.render(scene, camera);
}

animate();