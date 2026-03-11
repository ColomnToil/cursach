import { pet } from "./pet.js";

let main = document.querySelector("main");
let globalScale = 0.7;
// console.log()
var Example = Example || {};

var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Composites = Matter.Composites,
  Common = Matter.Common,
  Constraint = Matter.Constraint,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Composite = Matter.Composite,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  World = Matter.World,
  Events = Matter.Events;

// Example.constraints = function () {
// create engine
export let engine = Engine.create(),
  world = engine.world;

// create renderer
var render = Render.create({
  element: main,
  engine: engine,
  options: {
    width: main.offsetWidth,
    height: main.offsetHeight,
    showAngleIndicator: false,
    wireframes: false,
    background: "#ffffff",
  },
});

Render.run(render);

// create runner
// var runner = Runner.create();
var runner = Runner.create({
  // 600Hz delta = 1.666ms = 10upf @ 60fps (i.e. 10x default precision)
  // delta: 1,
  // 50fps minimum performance target (i.e. budget allows up to ~20ms execution per frame)
  // maxFrameTime: 10,
});
Runner.run(runner, engine);

const petCategory = 0x0001,
  wallCategory = 0x0002;

// Добавление гуманоида
// let bodyMain = Bodies.rectangle(
//   400,
//   300,
//   globalScale * 70,
//   globalScale * 240,
//   {
//     render: {
//       lineWidth: 0,
//       fillStyle: "black",
//       strokeStyle: "black",
//       sprite: {
//         // texture: "7883895576.jpg",
//       },
//     },
//   },
// );

// var head = Bodies.circle(400, 190, globalScale * 35, {
//   render: {
//     lineWidth: 0,
//     fillStyle: "black",
//     strokeStyle: "black",
//     sprite: {
//       // texture: "7883895576.jpg",
//     },
//   },
// });

// var armLeft = Bodies.rectangle(350, 250, globalScale * 30, globalScale * 80, {
//   render: {
//     lineWidth: 0,
//     fillStyle: "black",
//     strokeStyle: "black",
//     sprite: {
//       // texture: "7883895576.jpg",
//     },
//   },
// });

// var armRight = Bodies.rectangle(
//   450,
//   250,
//   globalScale * 30,
//   globalScale * 80,
//   {
//     render: {
//       lineWidth: 0,
//       fillStyle: "black",
//       strokeStyle: "black",
//       sprite: {
//         // texture: "7883895576.jpg",
//       },
//     },
//   },
// );

// var armLeftB = Bodies.rectangle(
//   350,
//   260,
//   globalScale * 30,
//   globalScale * 80,
//   {
//     render: {
//       lineWidth: 0,
//       fillStyle: "black",
//       strokeStyle: "black",
//       sprite: {
//         // texture: "7883895576.jpg",
//       },
//     },
//   },
// );

// var armRightB = Bodies.rectangle(
//   450,
//   260,
//   globalScale * 30,
//   globalScale * 80,
//   {
//     render: {
//       lineWidth: 0,
//       fillStyle: "black",
//       strokeStyle: "black",
//       sprite: {
//         // texture: "7883895576.jpg",
//       },
//     },
//   },
// );

// var constraintArmLeftToMain = Constraint.create({
//   bodyA: armLeft,
//   pointA: { x: globalScale * 0, y: globalScale * -40 },
//   bodyB: bodyMain,
//   pointB: { x: globalScale * -30, y: globalScale * -90 },
//   length: 20,
//   damping: 0.5,
//   stiffness: 0.1,
//   render: {
//     visible: false,
//   },
// });

// var constraintArmRightToMain = Constraint.create({
//   bodyA: bodyMain,
//   pointA: { x: globalScale * 30, y: globalScale * -90 },
//   bodyB: armRight,
//   pointB: { x: globalScale * 0, y: globalScale * -40 },
//   length: 20,
//   damping: 0.5,
//   stiffness: 0.1,
//   render: {
//     visible: false,
//   },
// });

// var constraintArmRightB = Constraint.create({
//   bodyA: armRightB,
//   pointA: { x: globalScale * 0, y: globalScale * -40 },
//   bodyB: armRight,
//   pointB: { x: globalScale * 0, y: globalScale * 40 },
//   length: 10,
//   damping: 0.5,
//   stiffness: 0.1,
//   render: {
//     visible: false,
//   },
// });

// var constraintArmLeftB = Constraint.create({
//   bodyA: armLeftB,
//   pointA: { x: globalScale * 0, y: globalScale * -40 },
//   bodyB: armLeft,
//   pointB: { x: globalScale * 0, y: globalScale * 40 },
//   length: 10,
//   damping: 0.5,
//   stiffness: 0.1,
//   render: {
//     visible: false,
//   },
// });

// var constraintHeadToBodyMain = Constraint.create({
//   bodyA: head,
//   pointA: { x: globalScale * 0, y: globalScale * 0 },
//   bodyB: bodyMain,
//   pointB: { x: globalScale * 0, y: globalScale * -110 },
//   length: 40,
//   damping: 0.8,
//   stiffness: 0.1,
//   render: {
//     visible: false,
//   },
// });

// Composite.add(world, [
//   bodyMain,
//   armLeft,
//   armRight,
//   armLeftB,
//   armRightB,
//   head,
//   constraintArmLeftToMain,
//   constraintArmRightToMain,
//   constraintArmRightB,
//   constraintArmLeftB,
//   constraintHeadToBodyMain,
// ]);

// let circle1 = Bodies.polygon (
//   main.offsetWidth / 2,
//   main.offsetHeight / 3,
//   3,
//   main.offsetWidth / 10,
//   {
//     chamfer: 1,
//     collisionFilter: {
//       category: petCategory,
//     },
//     // isStatic: true,
//     render: {
//       lineWidth: 0,
//       fillStyle: "brown",
//       strokeStyle: "black",
//       sprite: {
//         // texture: "7883895576.jpg",
//       },
//     },
//   },
// );

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
// console.log(wallCategory);

// Body.setVelocity(circle1, (0, 0));

// , circle2, circle3]);

Composite.add(world, [
  // walls
  Bodies.rectangle(main.offsetWidth / 2, 0, main.offsetWidth, 100, {
    isStatic: true,
    collisionFilter: {
      category: wallCategory,
    },
    // render: {
    //   visible: false,
    // },
  }),
  Bodies.rectangle(
    main.offsetWidth / 2,
    main.offsetHeight,
    main.offsetWidth,
    100,
    {
      isStatic: true,
      collisionFilter: {
        category: wallCategory,
      },
    },
  ),
  Bodies.rectangle(
    main.offsetWidth,
    main.offsetHeight / 2,
    100,
    main.offsetHeight,
    {
      isStatic: true,
      collisionFilter: {
        category: wallCategory,
      },
    },
  ),
  Bodies.rectangle(0, main.offsetHeight / 2, 100, main.offsetHeight, {
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
      mask: petCategory,
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
  max: { x: main.offsetWidth, y: main.offsetHeight },
});

// context for MatterTools.Demo
// console.log(
//   (render.bounds.max.x + render.bounds.min.x) / 2,
//   render.bounds.max.y / 2,
// );
// const limitMaxSpeed = (event) => {
//   event.source.world.bodies.forEach((body) => {
//     let maxSpeed = 10;
//     Matter.Body.setVelocity(body, {
//       x: Math.min(maxSpeed, Math.max(-maxSpeed, body.velocity.x)),
//       y: Math.min(maxSpeed, Math.max(-maxSpeed, body.velocity.y)),
//     });
//   });
// };
// Matter.Events.on(engine.current, "beforeUpdate", limitMaxSpeed);
// return {
//   engine: engine,
//   runner: runner,
//   render: render,
//   canvas: render.canvas,
//   stop: function () {
//     Matter.Render.stop(render);
//     Matter.Runner.stop(runner);
//   },
// };
// };

// Example.constraints.title = "Constraints";
// Example.constraints.for = ">=0.14.2";

// if (typeof module !== "undefined") {
//   module.exports = Example.constraints;
// }

// Example.constraints();

// .bodyMain.fillStyle = "green";

// console.log(main.offsetWidth, main.offsetLeft);

// main.querySelector("canvas").style.background = "none";

// Example.softBody = function (
//   xx,
//   yy,
//   columns,
//   rows,
//   columnGap,
//   rowGap,
//   crossBrace,
//   particleRadius,
//   particleOptions,
//   constraintOptions,
// ) {
//   var Common = Matter.Common,
//     Composites = Matter.Composites,
//     Bodies = Matter.Bodies;

//   particleOptions = Common.extend({ inertia: Infinity }, particleOptions);
//   constraintOptions = Common.extend(
//     {
//       stiffness: 1,
//       render: { type: "line", anchors: false, visible: false },
//     },
//     constraintOptions,
//   );

//   var softBody = Composites.stack(
//     xx,
//     yy,
//     columns,
//     rows,
//     columnGap,
//     rowGap,
//     function (x, y) {
//       return Bodies.rectangle(
//         x,
//         y,
//         particleRadius,
//         particleRadius,
//         particleOptions,
//       );
//     },
//   );

//   Composites.mesh(softBody, columns, rows, crossBrace, constraintOptions);

//   softBody.label = "Soft Body";

//   return softBody;
// };

// let pouBody = Example.softBody(
//   main.offsetWidth / 2,
//   main.offsetHeight / 3,
//   6,
//   6,
//   0,
//   0,
//   true,
//   20,
//   {
//     collisionFilter: {
//       category: petCategory,
//       mask: petCategory,
//     },
//     isStatic: true,
//     // gravity: 0,
//     render: {
//       wireframes: false,
//       lineWidth: 1,
//       fillStyle: "rgb(200, 100, 0)",
//       strokeStyle: "rgb(200, 100, 0)",

//       sprite: {
//         // texture: "7883895576.jpg",
//       },
//     },
//   },
// );

// console.log(pouBody);

// Создаем интерактивного Pou
class Pou {
  constructor(x, y) {
    // Основное тело (голова/тело Pou)
    this.body = Bodies.polygon(
      x,
      y,
      Math.round(Math.random() * 6),
      main.offsetWidth / 10,
      {
        chamfer: 1,
        collisionFilter: {
          category: petCategory,
          mask: petCategory,
        },
        isStatic: true,
        render: {
          lineWidth: 0,
          fillStyle: "brown",
          strokeStyle: "black",
          sprite: {
            // texture: "7883895576.jpg",
          },
        },
      },
    );

    Body.rotate(this.body, Math.PI / 2);

    // Глаза
    this.leftEye = Bodies.circle(x - 25, y - 20, 12, {
      isStatic: false,
      restitution: 0.3,
      collisionFilter: {
        category: petCategory,
        mask: wallCategory,
      },
      render: { fillStyle: "#FFFFFF", strokeStyle: "#000000", lineWidth: 2 },
    });

    this.rightEye = Bodies.circle(x + 25, y - 20, 12, {
      isStatic: false,
      restitution: 0.3,
      collisionFilter: {
        category: petCategory,
        mask: wallCategory,
      },
      render: { fillStyle: "#FFFFFF", strokeStyle: "#000000", lineWidth: 2 },
    });

    // Зрачки
    this.leftPupil = Bodies.circle(x - 28, y - 20, 5, {
      isStatic: false,
      restitution: 0.1,
      collisionFilter: {
        category: wallCategory,
      },
      render: { fillStyle: "#000000" },
    });

    this.rightPupil = Bodies.circle(x + 22, y - 20, 5, {
      isStatic: false,
      restitution: 0.1,
      collisionFilter: {
        category: wallCategory,
      },
      render: { fillStyle: "#000000" },
    });

    // Рот (маленький круг)
    this.mouth = Bodies.circle(x, y + 15, 8, {
      isStatic: false,
      restitution: 0.3,
      collisionFilter: {
        category: wallCategory,
      },
      render: { fillStyle: "#FF69B4" },
    });

    // Создаем соединения между частями тела
    this.joints = [];

    // Соединяем глаза с телом
    this.joints.push(
      Constraint.create({
        bodyA: this.body,
        bodyB: this.leftEye,
        pointA: { x: -25, y: -20 },
        stiffness: 0.5,
        render: { visible: false },
      }),
    );

    this.joints.push(
      Constraint.create({
        bodyA: this.body,
        bodyB: this.rightEye,
        pointA: { x: 25, y: -20 },
        stiffness: 0.5,
        render: { visible: false },
      }),
    );

    // Соединяем зрачки с глазами
    this.joints.push(
      Constraint.create({
        bodyA: this.leftEye,
        bodyB: this.leftPupil,
        pointA: { x: -3, y: 0 },
        stiffness: 0.8,
        render: { visible: false },
      }),
    );

    this.joints.push(
      Constraint.create({
        bodyA: this.rightEye,
        bodyB: this.rightPupil,
        pointA: { x: -3, y: 0 },
        stiffness: 0.8,
        render: { visible: false },
      }),
    );

    // Соединяем рот с телом
    this.joints.push(
      Constraint.create({
        bodyA: this.body,
        bodyB: this.mouth,
        pointA: { x: 0, y: 15 },
        stiffness: 0.3,
        render: { visible: false },
      }),
    );

    // Добавляем все части в мир
    World.add(world, [
      this.body,
      this.leftEye,
      this.rightEye,
      this.leftPupil,
      this.rightPupil,
      this.mouth,
      ...this.joints,
    ]);
  }

  // Метод для прыжка
  // jump() {
  //   Body.setVelocity(this.body, {
  //     x: (Math.random() - 0.5) * 5,
  //     y: -12,
  //   });

  //   // Добавляем немного вращения для веселья
  //   Body.setAngularVelocity(this.body, (Math.random() - 0.5) * 0.1);

  //   // Увеличиваем счастье при взаимодействии
  //   const happinessSpan = document.getElementById("happiness");
  //   let happiness = parseInt(happinessSpan.textContent);
  //   happiness = Math.min(100, happiness + 5);
  //   happinessSpan.textContent = happiness;
  // }
}

// Создаем нашего Pou по центру экрана
const pou = new Pou(main.offsetWidth / 2, main.offsetHeight / 2);

// allBodies.sort((a, b) => {
//   const zIndexA =
//     a.render && typeof a.render.zIndex !== "undefined" ? a.render.zIndex : 0;
//   const zIndexB =
//     b.render && typeof b.render.zIndex !== "undefined" ? b.render.zIndex : 0;
//   return zIndexA - zIndexB;
// });

export function pouSad() {
  pou.leftEye.scale = 1.0;
  console.log(pou);
  Events.on(engine, "afterUpdate", function () {
    // Постепенно уменьшаем счастье

    // Если счастье низкое, добавляем грустную анимацию
    const happiness = parseInt(pet._funny);
    if (happiness < 20) {
      // Делаем глаза немного меньше (грустные)
      if (pou.leftEye.scale > 1) {
        pou.leftEye.scale -= 0.01;
        Body.scale(pou.leftPupil, 0.99, 0.99);
        Body.scale(pou.rightPupil, 0.99, 0.99);
      }
    } else {
      // Возвращаем нормальный размер
      if (pou.leftEye.scale < 1.7) {
        pou.leftEye.scale += 0.01;
        Body.scale(pou.leftPupil, 1.01, 1.01);
        Body.scale(pou.rightPupil, 1.01, 1.01);
      }
    }
  });
}
