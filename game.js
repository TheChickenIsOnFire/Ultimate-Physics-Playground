// Matter.js module aliases
const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint;

// Create engine
const engine = Engine.create();
const world = engine.world;

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
    background: 'white'
  }
});

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
    50 + Math.random() * 50
  );
  Composite.add(world, box);
});

document.getElementById('addCircle').addEventListener('click', () => {
  const circle = Bodies.circle(
    Math.random() * width,
    50,
    20 + Math.random() * 20
  );
  Composite.add(world, circle);
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
Engine.run(engine);
Render.run(render);