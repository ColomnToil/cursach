// import Matter from "matter-js.js";
import { pet } from "./pet.js";
import { avaliablePotions, potionFetch } from "./potions.js";
import {
  // getAvaliableProducts,
  // productResponse,
  // products,
  avaliableProducts,
  productFetch,
} from "./products.js";
import { roomIndex, rooms } from "./rooms.js";

export let main = document.querySelector("main");
let globalScale = 0.7;
// console.log()
var Example = Example || {};

const Engine = Matter.Engine,
  Runner = Matter.Runner,
  Composites = Matter.Composites,
  Common = Matter.Common,
  Constraint = Matter.Constraint,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Composite = Matter.Composite,
  Body = Matter.Body,
  Events = Matter.Events,
  Query = Matter.Query;

export const Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies;

let currentMood = "normal";
let isEating = false;
let eatAnimationTimer = 0;
let lastMouthState = "normal";
let productCount = 0;
let potionCount = 0;
let currentFood = false;
let currentPotion = false;
export let productGeted = false;
export let potionGeted = false;
let isDragging = false;

// Example.constraints = function () {
// create engine
export let engine = Engine.create(),
  world = engine.world;

// create renderer
export let render = Render.create({
  element: main,
  engine: engine,
  options: {
    width: main.offsetWidth,
    height: main.offsetHeight,
    showAngleIndicator: false,
    wireframes: false,
    background: "none",
  },
});

// create runner
// var runner = Runner.create();
export let runner = Runner.create({
  // 600Hz delta = 1.666ms = 10upf @ 60fps (i.e. 10x default precision)
  // delta: 1,
  // 50fps minimum performance target (i.e. budget allows up to ~20ms execution per frame)
  // maxFrameTime: 10,
});
Runner.run(runner, engine);

const petCategory = 0x0001,
  wallCategory = 0x0002,
  itemInRoomCategory = 0x0003;

Composite.add(world, [
  // walls
  Bodies.rectangle(main.offsetWidth / 2, -10, main.offsetWidth, 100, {
    isStatic: true,
    collisionFilter: {
      category: wallCategory,
    },
    render: {
      visible: false,
    },
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
      render: {
        visible: false,
      },
    },
  ),
  Bodies.rectangle(
    main.offsetWidth + 10,
    main.offsetHeight / 2,
    100,
    main.offsetHeight,
    {
      isStatic: true,
      collisionFilter: {
        category: wallCategory,
      },
      render: {
        visible: false,
      },
    },
  ),
  Bodies.rectangle(0 - 10, main.offsetHeight / 2, 100, main.offsetHeight, {
    isStatic: true,
    collisionFilter: {
      category: wallCategory,
    },
    render: {
      visible: false,
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

render.mouse = mouse;

Render.lookAt(render, {
  min: { x: 0, y: 0 },
  max: { x: main.offsetWidth, y: main.offsetHeight },
});

let pouBody, leftEye, rightEye, leftPupil, rightPupil, mouth, leftEar, rightEar;
let mouthJoints = [];

// Создаем интерактивного Pou
class Pou {
  constructor(x, y) {
    // Основное тело (голова/тело Pou)
    this.body = Bodies.polygon(
      x,
      y,
      5,
      // Math.round(Math.random() * 6),
      main.offsetWidth / 10,
      {
        chamfer: 1,
        collisionFilter: {
          category: petCategory,
          mask: [petCategory, itemInRoomCategory],
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
        mask: [petCategory, itemInRoomCategory],
      },
      render: { fillStyle: "#FFFFFF", strokeStyle: "#000000", lineWidth: 2 },
    });

    this.rightEye = Bodies.circle(x + 25, y - 20, 12, {
      isStatic: false,
      restitution: 0.3,
      collisionFilter: {
        category: petCategory,
        mask: [petCategory, itemInRoomCategory],
      },
      render: { fillStyle: "#FFFFFF", strokeStyle: "#000000", lineWidth: 2 },
    });

    // Зрачки
    this.leftPupil = Bodies.circle(x - 100, y - 20, 5, {
      isStatic: false,
      restitution: 0.1,
      collisionFilter: {
        category: [petCategory, itemInRoomCategory],
      },
      render: { fillStyle: "#000000" },
    });

    this.rightPupil = Bodies.circle(x + 100, y - 20, 5, {
      isStatic: false,
      restitution: 0.1,
      collisionFilter: {
        category: [petCategory, itemInRoomCategory],
      },
      render: { fillStyle: "#000000" },
    });

    this.mouth = this.createMouth(x, y, "normal");

    pouBody = this.body;
    leftEye = this.leftEye;
    rightEye = this.rightEye;
    leftPupil = this.leftPupil;
    rightPupil = this.rightPupil;
    mouth = this.mouth;
    leftEar = this.leftEar;
    rightEar = this.rightEar;

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

  createMouth(x, y, type) {
    switch (type) {
      case "happy":
        return Bodies.fromVertices(
          x,
          y,
          [
            { x: -15, y: -5 },
            { x: 0, y: 10 },
            { x: 15, y: -5 },
          ],
          {
            isStatic: false,
            restitution: 0.3,
            collisionFilter: {
              category: petCategory,
              mask: [petCategory, itemInRoomCategory],
            },
            render: {
              fillStyle: "#FF69B4",
              strokeStyle: "#FF1493",
              lineWidth: 2,
            },
          },
          true,
        );

      case "sad":
        return Bodies.fromVertices(
          x,
          y,
          [
            { x: -15, y: 5 },
            { x: 0, y: -10 },
            { x: 15, y: 5 },
          ],
          {
            isStatic: false,
            restitution: 0.3,
            collisionFilter: {
              category: petCategory,
              mask: [petCategory, itemInRoomCategory],
            },
            render: {
              fillStyle: "#FF69B4",
              strokeStyle: "#FF1493",
              lineWidth: 2,
            },
          },
          true,
        );

      case "eating":
        return Bodies.fromVertices(
          x,
          y,
          [
            { x: -20, y: 0 },
            { x: 0, y: 15 },
            { x: 20, y: 0 },
            { x: 0, y: -5 },
          ],
          {
            isStatic: false,
            restitution: 0.3,
            collisionFilter: {
              category: petCategory,
              mask: [petCategory, itemInRoomCategory],
            },
            render: {
              fillStyle: "#FF69B4",
              strokeStyle: "#FF1493",
              lineWidth: 2,
            },
          },
          true,
        );

      default: // normal
        return Bodies.circle(x, y, 8, {
          isStatic: false,
          restitution: 0.3,
          collisionFilter: {
            category: petCategory,
            mask: [petCategory, itemInRoomCategory],
          },
          render: { fillStyle: "#FF69B4" },
        });
    }
  }
  async changeMouth(type, force, respawn) {
    if (type === currentMood && !force) return;

    currentMood = type;
    // document.getElementById("current-mood").textContent =
    //   type === "normal"
    //     ? "Обычное"
    //     : type === "happy"
    //       ? "Веселье"
    //       : type === "sad"
    //         ? "Грусть"
    //         : "Ест";

    // Сохраняем текущую позицию
    const pos = this.mouth.position;

    // Удаляем старый рот
    World.remove(world, this.mouth);

    // Создаем новый рот
    this.mouth = this.createMouth(pos.x, pos.y, type);
    mouth = this.mouth;

    // Добавляем новый рот в мир
    World.add(world, this.mouth);

    // Обновляем соединение
    const newJoint = Constraint.create({
      bodyA: this.body,
      bodyB: this.mouth,
      pointA: { x: 0, y: 0 },
      stiffness: 0.6,
      render: { visible: false },
    });

    // console.log("change mouth");

    World.add(world, newJoint);

    if (respawn) {
      createFood(main.offsetWidth / 2, main.offsetHeight / 1.2, true);
      createPotion(main.offsetWidth / 2, main.offsetHeight / 1.2, true);
      return;
    }
    if ((productGeted || potionGeted) && currentMood == "eating") {
      createFood(main.offsetWidth / 2, main.offsetHeight / 1.2, false);
      createPotion(main.offsetWidth / 2, main.offsetHeight / 1.2, false);
    } else if ((productGeted || potionGeted) && currentMood != "eating") {
      createFood(main.offsetWidth / 2, main.offsetHeight / 1.2, true);
      createPotion(main.offsetWidth / 2, main.offsetHeight / 1.2, true);
    }
  }

  eat() {
    if (isEating) return;

    isEating = true;
    this.changeMouth("eating", false, false);

    // Анимация жевания
    let chewCount = 0;
    const chewInterval = setInterval(() => {
      if (chewCount >= 6) {
        // 3 раза прожевал
        clearInterval(chewInterval);
        isEating = false;
        this.changeMouth("normal", false, true);
        return;
      }

      // Двигаем рот вверх-вниз
      if (chewCount % 2 === 0) {
        this.changeMouth("normal", false, true);
        // Body.setPosition(this.mouth, {
        //   x: this.mouth.position.x,
        //   y: this.mouth.position.y - 5,
        // });
      } else {
        this.changeMouth("eating", false, true);
        // Body.setPosition(this.mouth, {
        //   x: this.mouth.position.x,
        //   y: this.mouth.position.y + 5,
        // });
      }

      chewCount++;
    }, 200);
  }
}

// Создаем нашего Pou по центру экрана
export const pou = new Pou(main.offsetWidth / 2, main.offsetHeight / 2);

// allBodies.sort((a, b) => {
//   const zIndexA =
//     a.render && typeof a.render.zIndex !== "undefined" ? a.render.zIndex : 0;
//   const zIndexB =
//     b.render && typeof b.render.zIndex !== "undefined" ? b.render.zIndex : 0;
//   return zIndexA - zIndexB;
// });

export function pouMood() {
  pou.leftEye.scale = 1.0;
  // console.log(pou);
  Events.on(engine, "afterUpdate", function () {
    // Постепенно уменьшаем счастье

    // Если счастье низкое, добавляем грустную анимацию
    let happiness = parseInt(pet._funny);
    let fullness = parseInt(pet._hunger);
    if (fullness > 40) {
      // Делаем глаза немного меньше (грустные)
      if (pou.leftEye.scale > 1) {
        pou.leftEye.scale -= 0.01;
        Body.scale(pou.leftPupil, 0.99, 0.99);
        Body.scale(pou.rightPupil, 0.99, 0.99);
      }
    } else {
      // Возвращаем нормальный размер
      if (pou.leftEye.scale < 1.5) {
        pou.leftEye.scale += 0.01;
        Body.scale(pou.leftPupil, 1.01, 1.01);
        Body.scale(pou.rightPupil, 1.01, 1.01);
      }
    }

    // if (fullness < 80 && currentMood !== "eating" && currentMood !== "sad") {
    //   pou.changeMouth("sad", false, true);
    // } else if (
    //   fullness > 70 &&
    //   happiness > 70 &&
    //   currentMood === "normal" &&
    //   Math.random() < 0.001
    // ) {
    //   // Иногда улыбаемся от счастья
    //   pou.changeMouth("happy", false, true);
    //   setTimeout(() => {
    //     if (currentMood !== "eating" && fullness > 20) {
    //       pou.changeMouth("normal", false, true);
    //     }
    //   }, 2000);
    // }
    if (mouse.position) {
      // const eyeFollow = 0.1;
      const dx = mouse.position.x - pouBody.position.x;
      const dy = mouse.position.y - pouBody.position.y;

      // Ограничиваем движение зрачков
      const maxDist = 5;
      // const pupilDX = Math.min(maxDist, Math.max(-maxDist, dx * 0.05));
      // const pupilDY = Math.min(maxDist, Math.max(-maxDist, dy * 0.05));

      if (leftPupil && rightPupil) {
        Body.setPosition(leftPupil, {
          //leftEye.position.x + pupilDX,
          x:
            leftEye.position.x > mouse.position.x
              ? leftEye.position.x +
                Math.min(maxDist, Math.max(-maxDist, dx * 0.05))
              : leftEye.position.x +
                Math.min(maxDist, Math.max(-maxDist, dx * 0.05 + 2)),
          y:
            leftEye.position.y < mouse.position.y
              ? leftEye.position.y +
                Math.min(maxDist, Math.max(-maxDist, dy * 0.05 + 2))
              : leftEye.position.y +
                Math.min(maxDist, Math.max(-maxDist, dy * 0.05)),
        });

        Body.setPosition(rightPupil, {
          x:
            rightEye.position.x > mouse.position.x
              ? rightEye.position.x +
                Math.min(maxDist, Math.max(-maxDist, dx * 0.05 - 2))
              : rightEye.position.x +
                Math.min(maxDist, Math.max(-maxDist, dx * 0.05)),
          y:
            rightEye.position.y < mouse.position.y
              ? rightEye.position.y +
                Math.min(maxDist, Math.max(-maxDist, dy * 0.05 + 2))
              : rightEye.position.y +
                Math.min(maxDist, Math.max(-maxDist, dy * 0.05)),
        });
      }
    }

    if (mouseConstraint.body === currentFood && !isDragging) {
      // console.log("Объект поднят (начало перетаскивания)");
      isDragging = true;
    }

    if (mouseConstraint.body !== currentFood && isDragging) {
      // console.log("Объект отпущен!");
      isDragging = false;
    }

    if (rooms[roomIndex]["_shop_id"] == 2 && currentFood === false) {
      createFood(main.offsetWidth / 2, main.offsetHeight / 1.2, false);
    }
    if (rooms[roomIndex]["_shop_id"] == 4 && currentPotion === false) {
      createPotion(main.offsetWidth / 2, main.offsetHeight / 1.2, false);
    }

    if (rooms[roomIndex]["_shop_id"] != 2 && currentFood !== false) {
      World.remove(world, currentFood);
      currentFood = false;
    }

    if (rooms[roomIndex]["_shop_id"] != 4 && currentPotion !== false) {
      World.remove(world, currentPotion);
      currentPotion = false;
    }

    if (
      rooms[roomIndex]["_shop_id"] == 2 &&
      Object.values(avaliableProducts)[0] !== undefined
    ) {
      const collisions = Query.collides(mouth, [currentFood]);
      // console.log(collisions);
      if (collisions.length > 0) {
        collisions.forEach((collision) => {
          const food =
            collision.bodyA.label === "food"
              ? collision.bodyA
              : collision.bodyB;
          if (!isDragging) {
            World.remove(world, food);
            currentFood = false;
            // console.log(avaliableProducts);
            pet.use(avaliableProducts[productCount], "product");

            if (avaliableProducts[productCount]["_count"] > 1) {
              avaliableProducts[productCount]["_count"] =
                Number(avaliableProducts[productCount]["_count"]) - 1;
            } else if (avaliableProducts[productCount]["_count"] == 1) {
              delete avaliableProducts[productCount];
              productCount++;
              // console.log(avaliableProducts);
            }
            pou.eat();
          }
        });
      }
    }

    if (
      rooms[roomIndex]["_shop_id"] == 4 &&
      Object.values(avaliablePotions)[0] !== undefined
    ) {
      const collisions = Query.collides(mouth, [currentPotion]);
      // console.log(collisions);
      if (collisions.length > 0) {
        collisions.forEach((collision) => {
          const potion =
            collision.bodyA.label === "potion"
              ? collision.bodyA
              : collision.bodyB;
          if (!isDragging) {
            World.remove(world, potion);
            currentPotion = false;
            pet.use(avaliablePotions[potionCount], "potion");
            if (avaliablePotions[potionCount]["_count"] > 1) {
              avaliablePotions[potionCount]["_count"] =
                Number(avaliablePotions[potionCount]["_count"]) - 1;
            } else if (avaliablePotions[potionCount]["_count"] == 1) {
              delete avaliablePotions[potionCount];
              potionCount++;
              // console.log(avaliableProducts);
            }
            pou.eat();
          }
        });
      }
    }
  });
}

export function createFood(x, y, respawn) {
  // console.log(Object.values(avaliableProducts)[0]);
  if (
    rooms[roomIndex]["_shop_id"] != 2 ||
    Object.values(avaliableProducts)[0] == undefined
  ) {
    return;
  }
  const foodImg = `images/${avaliableProducts[productCount]._imgSrc}`;
  // console.log(products);
  let positionX = x;
  let positionY = y;
  if (currentFood) {
    World.remove(world, currentFood);
    if (respawn) {
      positionX = currentFood.position.x;
      positionY = currentFood.position.y;
    }
  }
  const food = Bodies.circle(positionX, positionY, 28, {
    restitution: 0.3,
    friction: 0.1,
    density: 0.001,
    collisionFilter: {
      category: itemInRoomCategory,
    },
    render: {
      // fillStyle: "#FFD700",
      strokeStyle: "#000000",
      lineWidth: 10,
      sprite: {
        texture: foodImg,
      },
    },
  });

  currentFood = food;
  World.add(world, food);
  return food;
}

export function createPotion(x, y, respawn) {
  // console.log(currentPotion);
  if (
    rooms[roomIndex]["_shop_id"] != 4 ||
    Object.values(avaliablePotions)[0] == undefined
  ) {
    return;
  }
  const potionImg = `images/${avaliablePotions[potionCount]._imgSrc}`;
  // console.log(products);
  let positionX = x;
  let positionY = y;
  if (currentPotion) {
    World.remove(world, currentPotion);
    if (respawn) {
      positionX = currentPotion.position.x;
      positionY = currentPotion.position.y;
    }
  }
  const potion = Bodies.circle(positionX, positionY, 28, {
    restitution: 0.3,
    friction: 0.1,
    density: 0.001,
    collisionFilter: {
      category: itemInRoomCategory,
    },
    render: {
      // fillStyle: "#FFD700",
      strokeStyle: "#000000",
      lineWidth: 10,
      sprite: {
        texture: potionImg,
      },
    },
  });

  currentPotion = potion;
  World.add(world, potion);
  return potion;
}

productFetch.finally((e) => {
  if (avaliableProducts) {
    createFood(main.offsetWidth / 2, main.offsetHeight / 1.2, false);
    productGeted = true;
  }
});

potionFetch.finally((e) => {
  if (avaliablePotions) {
    createPotion(main.offsetWidth / 2, main.offsetHeight / 1.2, false);
    potionGeted = true;
  }
});

function getSleep() {
  fetch("scripts/get/isSleep.php?pet_id=1", {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((resp) => resp.json())
    .then((pars) => {
      // console.log(pars["is_sleep"]);
      if (pars["is_sleep"] != 0) {
        leftEye.render.fillStyle = "#FFFFFF";
        rightEye.render.fillStyle = "#FFFFFF";

        leftPupil.render.visible = true;
        rightPupil.render.visible = true;
        fetch(`scripts/update/sleep.php?is=0&pet_id=1`);
      } else {
        leftEye.render.fillStyle = "brown";
        rightEye.render.fillStyle = "brown";

        leftPupil.render.visible = false;
        rightPupil.render.visible = false;
        fetch(`scripts/update/sleep.php?is=1&pet_id=1`);
      }
      Render.world(render);
    });
}

const secondButton = document
  .querySelector("footer")
  .querySelector(".buttons")
  .querySelector(".second");

secondButton.addEventListener("click", function (event) {
  // console.log(rooms[roomIndex]);
  if (rooms[roomIndex]["_shop_id"] == 1) {
    getSleep();
  }
});

fetch("scripts/get/isSleep.php?pet_id=1", {
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((resp) => resp.json())
  .then((pars) => {
    // console.log(pars["is_sleep"]);
    if (pars["is_sleep"] == 0) {
      leftEye.render.fillStyle = "#FFFFFF";
      rightEye.render.fillStyle = "#FFFFFF";

      leftPupil.render.visible = true;
      rightPupil.render.visible = true;
    } else {
      leftEye.render.fillStyle = "brown";
      rightEye.render.fillStyle = "brown";

      leftPupil.render.visible = false;
      rightPupil.render.visible = false;
    }
  });
// sleep_true.finally((e) => {});

// sleep_false.finally((e) => {});

// window.feedPou = () => {
//   pou.eat();
//   // Создаем еду
//   createFood(
//     pou.body.position.x + (Math.random() - 0.5) * 50,
//     pou.body.position.y - 50,
//   );
// };

// Функция создания еды
