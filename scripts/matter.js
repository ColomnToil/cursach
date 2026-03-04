let main = document.querySelector("main");
let globalScale = 0.7;
// console.log()
var Example = Example || {};

Example.constraints = function () {
  var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    Common = Matter.Common,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Composite = Matter.Composite,
    Bodies = Matter.Bodies;

  // create engine
  var engine = Engine.create(),
    world = engine.world;

  // create renderer
  var render = Render.create({
    element: main,
    engine: engine,
    options: {
      width: main.offsetWidth,
      height: main.offsetHeight,
      showAngleIndicator: true,
      wireframes: false,
      background: "#ffffff",
    },
  });

  Render.run(render);

  // create runner
  // var runner = Runner.create();
  var runner = Runner.create({
    // 600Hz delta = 1.666ms = 10upf @ 60fps (i.e. 10x default precision)
    delta: 1,
    // 50fps minimum performance target (i.e. budget allows up to ~20ms execution per frame)
    maxFrameTime: 10,
  });
  Runner.run(runner, engine);

  const petCategory = 0x0001,
    wallCategory = 0x0002;

  // Добавление гуманоида
  let bodyMain = Bodies.rectangle(
    400,
    300,
    globalScale * 70,
    globalScale * 240,
    {
      render: {
        lineWidth: 0,
        fillStyle: "black",
        strokeStyle: "black",
        sprite: {
          // texture: "7883895576.jpg",
        },
      },
    },
  );

  var head = Bodies.circle(400, 190, globalScale * 35, {
    render: {
      lineWidth: 0,
      fillStyle: "black",
      strokeStyle: "black",
      sprite: {
        // texture: "7883895576.jpg",
      },
    },
  });

  var armLeft = Bodies.rectangle(350, 250, globalScale * 30, globalScale * 80, {
    render: {
      lineWidth: 0,
      fillStyle: "black",
      strokeStyle: "black",
      sprite: {
        // texture: "7883895576.jpg",
      },
    },
  });

  var armRight = Bodies.rectangle(
    450,
    250,
    globalScale * 30,
    globalScale * 80,
    {
      render: {
        lineWidth: 0,
        fillStyle: "black",
        strokeStyle: "black",
        sprite: {
          // texture: "7883895576.jpg",
        },
      },
    },
  );

  var armLeftB = Bodies.rectangle(
    350,
    260,
    globalScale * 30,
    globalScale * 80,
    {
      render: {
        lineWidth: 0,
        fillStyle: "black",
        strokeStyle: "black",
        sprite: {
          // texture: "7883895576.jpg",
        },
      },
    },
  );

  var armRightB = Bodies.rectangle(
    450,
    260,
    globalScale * 30,
    globalScale * 80,
    {
      render: {
        lineWidth: 0,
        fillStyle: "black",
        strokeStyle: "black",
        sprite: {
          // texture: "7883895576.jpg",
        },
      },
    },
  );

  var constraintArmLeftToMain = Constraint.create({
    bodyA: armLeft,
    pointA: { x: globalScale * 0, y: globalScale * -40 },
    bodyB: bodyMain,
    pointB: { x: globalScale * -30, y: globalScale * -90 },
    length: 20,
    damping: 0.5,
    stiffness: 0.1,
    render: {
      visible: false,
    },
  });

  var constraintArmRightToMain = Constraint.create({
    bodyA: bodyMain,
    pointA: { x: globalScale * 30, y: globalScale * -90 },
    bodyB: armRight,
    pointB: { x: globalScale * 0, y: globalScale * -40 },
    length: 20,
    damping: 0.5,
    stiffness: 0.1,
    render: {
      visible: false,
    },
  });

  var constraintArmRightB = Constraint.create({
    bodyA: armRightB,
    pointA: { x: globalScale * 0, y: globalScale * -40 },
    bodyB: armRight,
    pointB: { x: globalScale * 0, y: globalScale * 40 },
    length: 10,
    damping: 0.5,
    stiffness: 0.1,
    render: {
      visible: false,
    },
  });

  var constraintArmLeftB = Constraint.create({
    bodyA: armLeftB,
    pointA: { x: globalScale * 0, y: globalScale * -40 },
    bodyB: armLeft,
    pointB: { x: globalScale * 0, y: globalScale * 40 },
    length: 10,
    damping: 0.5,
    stiffness: 0.1,
    render: {
      visible: false,
    },
  });

  var constraintHeadToBodyMain = Constraint.create({
    bodyA: head,
    pointA: { x: globalScale * 0, y: globalScale * 0 },
    bodyB: bodyMain,
    pointB: { x: globalScale * 0, y: globalScale * -110 },
    length: 40,
    damping: 0.8,
    stiffness: 0.1,
    render: {
      visible: false,
    },
  });

  Composite.add(world, [
    bodyMain,
    armLeft,
    armRight,
    armLeftB,
    armRightB,
    head,
    constraintArmLeftToMain,
    constraintArmRightToMain,
    constraintArmRightB,
    constraintArmLeftB,
    constraintHeadToBodyMain,
  ]);

  // let circle1 = Bodies.circle(400, 100, globalScale * 60, {
  //   collisionFilter: {
  //     category: petCategory,
  //     mask: wallCategory,
  //   },
  //   render: {
  //     lineWidth: 0,
  //     fillStyle: "yellow",
  //     strokeStyle: "black",
  //     sprite: {
  //       // texture: "7883895576.jpg",
  //     },
  //   },
  // });

  // let circle2 = Bodies.circle(400, 160, globalScale * 60, {
  //   collisionFilter: {
  //     category: petCategory,
  //     mask: wallCategory,
  //   },
  //   render: {
  //     lineWidth: 0,
  //     fillStyle: "green",
  //     strokeStyle: "black",
  //     sprite: {
  //       // texture: "7883895576.jpg",
  //     },
  //   },
  // });

  // let circle3 = Bodies.circle(400, 220, globalScale * 60, {
  //   collisionFilter: {
  //     category: petCategory,
  //     mask: wallCategory,
  //   },
  //   render: {
  //     lineWidth: 0,
  //     fillStyle: "pink",
  //     strokeStyle: "black",
  //     sprite: {
  //       // texture: "7883895576.jpg",
  //     },
  //   },
  // });
  // // console.log(wallCategory);
  // Composite.add(world, [circle1, circle2, circle3]);

  Composite.add(world, [
    // walls
    Bodies.rectangle(400, 0, 800, 1, {
      isStatic: true,
      collisionFilter: {
        category: wallCategory,
      },
    }),
    Bodies.rectangle(400, 600, 800, 1, {
      isStatic: true,
      collisionFilter: {
        category: wallCategory,
      },
    }),
    Bodies.rectangle(800, 300, 1, 600, {
      isStatic: true,
      collisionFilter: {
        category: wallCategory,
      },
    }),
    Bodies.rectangle(0, 300, 1, 600, {
      isStatic: true,
      collisionFilter: {
        category: wallCategory,
      },
    }),
  ]);

  // add mouse control
  var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      collisionFilter: {
        // mask: wallCategory,
      },
      constraint: {
        // allow bodies on mouse to rotate
        angularStiffness: 0,
        render: {
          visible: false,
        },
      },
    });

  Composite.add(world, mouseConstraint);

  // keep the mouse in sync with rendering
  render.mouse = mouse;

  // mouseConstraint.collisionFilter.mask = wallCategory;

  // fit the render viewport to the scene
  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800, y: 600 },
  });

  // context for MatterTools.Demo
  console.log(
    (render.bounds.max.x + render.bounds.min.x) / 2,
    render.bounds.max.y / 2,
  );
  return {
    engine: engine,
    runner: runner,
    render: render,
    canvas: render.canvas,
    stop: function () {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
    },
  };
};

Example.constraints.title = "Constraints";
Example.constraints.for = ">=0.14.2";

if (typeof module !== "undefined") {
  module.exports = Example.constraints;
}

Example.constraints();

// .bodyMain.fillStyle = "green";

// console.log(Render)

// main.querySelector("canvas").style.background = "none";
