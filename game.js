
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
function spawnBoulder(x, y) {
    const radius = 40;
    const boulder = Bodies.circle(x, y, radius, {
        restitution: 0.8,
        friction: 0.1,
        frictionAir: 0.01,
        render: {
            sprite: {
                texture: chrome.runtime.getURL('/textures/boulder.png'),
                xScale: (radius * 2) / 128, // Assuming texture is 128x128
                yScale: (radius * 2) / 128
            }
        }
    });
    World.add(engine.world, boulder);
}

// Spawn boulder on click
render.canvas.addEventListener('mousedown', (event) => {
    const rect = render.canvas.getBoundingClientRect();
    spawnBoulder(
        event.clientX - rect.left,
        event.clientY - rect.top
    );
});

// Handle window resize
window.addEventListener('resize', () => {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
});