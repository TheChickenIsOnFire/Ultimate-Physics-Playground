// Matter.js module aliases
const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint,
      World = Matter.World,
      Body = Matter.Body;

// Load boulder texture
const boulderImg = new Image();
boulderImg.src = 'textures/boulder.png';
let boulders = [];

// Create engine
const engine = Engine.create();
const world = engine.world;
engine.gravity.y = 1; // Ensure gravity is enabled

// Get canvas element
const canvas = document.getElementById('gameCanvas');
const width = canvas.width = 600;
const height = canvas.height = 400;

// Create renderer
const render = Render.create({
  canvas: canvas,
  engine: engine,
  options: {
    width: width,
    height: height,
    wireframes: false,
    background: 'white',
    showAngleIndicator: false
  }
});

// Custom rendering for boulders
// Custom rendering for boulders
const ctx = canvas.getContext('2d');
function renderBoulders() {
  ctx.save();
  boulders.forEach(boulder => {
    if (!boulder.render.visible) return;
    
    const center = boulder.position;
    const radius = boulder.circleRadius;
    
    // Create circular clipping path
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();
    
    // Create pattern and fill circle
    const pattern = ctx.createPattern(boulderImg, 'repeat');
    ctx.fillStyle = pattern;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Reset clipping
    ctx.restore();
    
    // Add outline
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#654321';
    ctx.stroke();
  });
}

// Set up renderer
Render.run(render);
Matter.Events.on(render, 'afterRender', renderBoulders);

// Add ground and walls
const ground = Bodies.rectangle(width/2, height + 50, width, 100, { isStatic: true });
const leftWall = Bodies.rectangle(-50, height/2, 100, height, { isStatic: true });
const rightWall = Bodies.rectangle(width + 50, height/2, 100, height, { isStatic: true });

Composite.add(world, [ground, leftWall, rightWall]);

// Add mouse control
const mouse = Mouse.create(canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: {
      visible: false
    }
  }
});

Composite.add(world, mouseConstraint);

// Button event handlers
document.getElementById('addBox').addEventListener('click', () => {
  const box = Bodies.rectangle(
    Math.random() * width,
    50,
    50 + Math.random() * 50,
    50 + Math.random() * 50,
    { restitution: 0.8 }
  );
  World.add(world, box);
  console.log('Added box', box);
});

document.getElementById('addCircle').addEventListener('click', () => {
  const radius = 20 + Math.random() * 20;
  const boulder = Bodies.circle(
    Math.random() * width,
    50,
    radius,
    {
      restitution: 0.3,
      friction: 0.8,
      frictionStatic: 0.9,
      density: 0.005,
      render: {
        visible: true,
        fillStyle: 'transparent',
        strokeStyle: 'transparent'
      },
      chamfer: { radius: radius * 0.1 }
    }
  );
  boulders.push(boulder);
  World.add(world, boulder);
  console.log('Added boulder', boulder);
});

document.getElementById('clearAll').addEventListener('click', () => {
  // Remove all bodies except ground and walls
  Composite.allBodies(world).forEach(body => {
    if (!body.isStatic) {
      Composite.remove(world, body);
    }
  });
});

// Start the engine and renderer
const runner = Matter.Runner.create();
Matter.Runner.run(runner, engine);

// Clear boulders when clearing all
document.getElementById('clearAll').addEventListener('click', () => {
  boulders = [];
});