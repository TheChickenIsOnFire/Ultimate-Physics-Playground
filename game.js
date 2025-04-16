
const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint;

const engine = Engine.create();
const render = Render.create({
    element: document.body,
    engine: engine,
    canvas: document.getElementById('gameCanvas'),
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: '#f0f0f0'
    }
});

// Create ground and walls
const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
const leftWall = Bodies.rectangle(-30, 300, 60, 600, { isStatic: true });
const rightWall = Bodies.rectangle(830, 300, 60, 600, { isStatic: true });

// Mouse control
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: { visible: false }
    }
});

// Add objects to world
World.add(engine.world, [ground, leftWall, rightWall, mouseConstraint]);
Matter.Runner.run(engine);
Render.run(render);

// Spawn circular boulder with texture
let spawnModeActive = false;
const preview = document.getElementById('preview');
const spawnBtn = document.getElementById('spawnBtn');

// Preprocess texture to circular mask
const preprocessTexture = (callback) => {
    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = Math.min(img.width, img.height);
        canvas.width = size;
        canvas.height = size;
        
        // Create circular mask
        ctx.beginPath();
        ctx.arc(size/2, size/2, size/2, 0, Math.PI*2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 0, 0);
        
        callback(canvas.toDataURL());
    };
    img.src = chrome.runtime.getURL('textures/boulder.png');
};

let processedTexture = null;
preprocessTexture((url) => {
    processedTexture = url;
    spawnBtn.disabled = false;
});

function spawnBoulder(x, y) {
    if (!processedTexture) return;
    
    const radius = 40;
    const boulder = Bodies.circle(x, y, radius, {
        restitution: 0.8,
        friction: 0.05,
        frictionAir: 0.001,
        render: {
            sprite: {
                texture: processedTexture,
                xScale: (radius * 2) / 128,
                yScale: (radius * 2) / 128
            }
        }
    });
    World.add(engine.world, boulder);
}

// Spawn mode controls
spawnBtn.addEventListener('click', () => {
    spawnModeActive = !spawnModeActive;
    spawnBtn.textContent = spawnModeActive ? 'Cancel (Esc)' : 'Spawn Boulder';
    preview.style.display = spawnModeActive ? 'block' : 'none';
});

// Preview circle follow mouse
render.canvas.addEventListener('mousemove', (event) => {
    if (spawnModeActive) {
        const rect = render.canvas.getBoundingClientRect();
        preview.style.left = `${event.clientX - rect.left - 40}px`;
        preview.style.top = `${event.clientY - rect.top - 40}px`;
    }
});

// Spawn on click when active
render.canvas.addEventListener('mousedown', (event) => {
    if (spawnModeActive) {
        const rect = render.canvas.getBoundingClientRect();
        spawnBoulder(
            event.clientX - rect.left,
            event.clientY - rect.top
        );
    }
});

// Escape key handler
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        spawnModeActive = false;
        spawnBtn.textContent = 'Spawn Boulder';
        preview.style.display = 'none';
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
});