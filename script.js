// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Composite = Matter.Composite;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: 'transparent'
    }
});

// Set gravity
engine.world.gravity.y = 0.5;

// create runner
var runner = Matter.Runner.create();

// Run the engine
Matter.Runner.run(runner, engine);

// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

World.add(engine.world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// Boulder texture
var boulderTexture = 'textures/boulder.png';

// Function to create a boulder
function createBoulder(x, y) {
    var circle = Bodies.circle(x, y, 20, {
        friction: 0.5,
        restitution: 0.5,
        render: {
            sprite: {
                texture: boulderTexture
            }
        }
    });
    World.add(engine.world, circle);
}

// Boulder Spawning
var spawnBoulderButton = document.getElementById('spawnBoulderButton');
var isSpawningBoulders = false;

spawnBoulderButton.addEventListener('click', function() {
    isSpawningBoulders = !isSpawningBoulders;
    spawnBoulderButton.textContent = isSpawningBoulders ? 'Stop Spawning' : 'Spawn Boulder';
});

render.canvas.addEventListener('mousedown', function(event) {
    if (isSpawningBoulders) {
        var x = event.offsetX || (event.pageX - render.canvas.offsetLeft);
        var y = event.offsetY || (event.pageY - render.canvas.offsetTop);
        createBoulder(x, y);
    }
});

// fit the render viewport to the scene
Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800, y: 600 }
});