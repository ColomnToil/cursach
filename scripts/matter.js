import { avaliablePotions, potionFetch } from "./potions.js";
import { avaliableProducts, productFetch } from "./products.js";
import { roomIndex, rooms } from "./rooms.js";
import { pet } from "./pet.js";

export let main = document.querySelector("main");
let globalScale = 0.7;

const Engine = Matter.Engine,
  Runner = Matter.Runner,
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
let productCount = 0;
let potionCount = 0;
let currentFood = false;
let currentPotion = false;
export let productGeted = false;
export let potionGeted = false;
let isDragging = false;

// Переменные для анимаций
let moodAnimation = {
  tears: [],
  sweat: [],
  sickness: [],
};

let sleepAnimation = {
  yawningTimer: 0,
  sleepZzz: [],
};

let hungerAnimation = {
  stomachRumble: 0,
  hungerLines: [],
};

// Класс для создания слез (грусть)
class TearEffect {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.opacity = 1;
    this.lifetime = 0;
    this.element = this.createTear();
    this.velocity = {
      x: (Math.random() - 0.5) * 2,
      y: Math.random() * 2 + 1,
    };
  }

  createTear() {
    const tear = document.createElement("div");
    tear.className = "tear-effect";
    tear.style.position = "absolute";
    tear.style.left = this.x + "px";
    tear.style.top = this.y + "px";
    tear.style.width = "6px";
    tear.style.height = "10px";
    tear.style.background = "linear-gradient(to bottom, #ADD8E6, #4169E1)";
    tear.style.borderRadius = "50% 50% 50% 50% / 60% 60% 40% 40%";
    tear.style.boxShadow = "0 0 5px rgba(65, 105, 225, 0.5)";
    tear.style.pointerEvents = "none";
    tear.style.zIndex = "1000";
    document.body.appendChild(tear);
    return tear;
  }

  update() {
    this.lifetime++;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.velocity.y += 0.2;
    this.opacity -= 0.01;

    if (this.element) {
      this.element.style.left = this.x + "px";
      this.element.style.top = this.y + "px";
      this.element.style.opacity = this.opacity;
    }

    return this.opacity > 0 && this.y < window.innerHeight;
  }

  remove() {
    if (this.element) this.element.remove();
  }
}

// Класс для создания Zzz (сон)
class SleepEffect {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.opacity = 1;
    this.scale = 0.5;
    this.lifetime = 0;
    this.element = this.createZzz();
    this.velocity = {
      x: (Math.random() - 0.5) * 0.5,
      y: -1,
    };
  }

  createZzz() {
    const zzz = document.createElement("div");
    zzz.className = "sleep-zzz";
    zzz.style.position = "absolute";
    zzz.style.left = this.x + "px";
    zzz.style.top = this.y + "px";
    zzz.style.color = "#FFFFFF";
    zzz.style.fontSize = "24px";
    zzz.style.fontWeight = "bold";
    zzz.style.textShadow = "2px 2px 4px rgba(0,0,0,0.5)";
    zzz.style.pointerEvents = "none";
    zzz.style.zIndex = "1000";

    const symbols = ["z"];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    zzz.innerHTML = symbol;

    document.body.appendChild(zzz);
    return zzz;
  }

  update() {
    this.lifetime++;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.opacity -= 0.005;
    this.scale += 0.01;

    if (this.element) {
      this.element.style.left = this.x + "px";
      this.element.style.top = this.y + "px";
      this.element.style.opacity = this.opacity;
      this.element.style.transform = `scale(${this.scale}) rotate(${Math.sin(this.lifetime * 0.1) * 10}deg)`;
    }

    return this.opacity > 0;
  }

  remove() {
    if (this.element) this.element.remove();
  }
}

// Класс для создания капель пота (болезнь)
class SweatEffect {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.opacity = 1;
    this.lifetime = 0;
    this.element = this.createSweat();
    this.velocity = {
      x: (Math.random() - 0.5) * 1,
      y: Math.random() * 1 + 0.5,
    };
  }

  createSweat() {
    const sweat = document.createElement("div");
    sweat.className = "sweat-effect";
    sweat.style.position = "absolute";
    sweat.style.left = this.x + "px";
    sweat.style.top = this.y + "px";
    sweat.style.width = "4px";
    sweat.style.height = "8px";
    sweat.style.background = "linear-gradient(to bottom, #FFFFFF, #ADD8E6)";
    sweat.style.borderRadius = "50%";
    sweat.style.boxShadow = "0 0 3px rgba(255,255,255,0.8)";
    sweat.style.pointerEvents = "none";
    sweat.style.zIndex = "1000";
    document.body.appendChild(sweat);
    return sweat;
  }

  update() {
    this.lifetime++;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.opacity -= 0.01;

    if (this.element) {
      this.element.style.left = this.x + "px";
      this.element.style.top = this.y + "px";
      this.element.style.opacity = this.opacity;
    }

    return this.opacity > 0;
  }

  remove() {
    if (this.element) this.element.remove();
  }
}

// Класс для создания линий голода
class HungerLineEffect {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.opacity = 1;
    this.lifetime = 0;
    this.element = this.createLine();
    this.angle = Math.random() * Math.PI * 2;
  }

  createLine() {
    const line = document.createElement("div");
    line.className = "hunger-line";
    line.style.position = "absolute";
    line.style.left = this.x + "px";
    line.style.top = this.y + "px";
    line.style.width = "20px";
    line.style.height = "2px";
    line.style.background = "rgba(255, 140, 0, 0.7)";
    line.style.boxShadow = "0 0 5px rgba(255, 140, 0, 0.5)";
    line.style.transform = `rotate(${this.angle}rad)`;
    line.style.pointerEvents = "none";
    line.style.zIndex = "1000";
    document.body.appendChild(line);
    return line;
  }

  update() {
    this.lifetime++;
    this.opacity -= 0.02;

    if (this.element) {
      this.element.style.opacity = this.opacity;
    }

    return this.opacity > 0;
  }

  remove() {
    if (this.element) this.element.remove();
  }
}

export let engine = Engine.create(),
  world = engine.world;

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

export let runner = Runner.create({});
Runner.run(runner, engine);

const petCategory = 0x0001,
  wallCategory = 0x0002,
  itemInRoomCategory = 0x0003;

Composite.add(world, [
  Bodies.rectangle(main.offsetWidth / 2, -10, main.offsetWidth, 100, {
    isStatic: true,
    collisionFilter: { category: wallCategory },
    render: { visible: false },
  }),
  Bodies.rectangle(
    main.offsetWidth / 2,
    main.offsetHeight,
    main.offsetWidth,
    100,
    {
      isStatic: true,
      collisionFilter: { category: wallCategory },
      render: { visible: false },
    },
  ),
  Bodies.rectangle(
    main.offsetWidth + 10,
    main.offsetHeight / 2,
    100,
    main.offsetHeight,
    {
      isStatic: true,
      collisionFilter: { category: wallCategory },
      render: { visible: false },
    },
  ),
  Bodies.rectangle(0 - 10, main.offsetHeight / 2, 100, main.offsetHeight, {
    isStatic: true,
    collisionFilter: { category: wallCategory },
    render: { visible: false },
  }),
]);

var mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    collisionFilter: { mask: petCategory },
    constraint: {
      angularStiffness: 0,
      render: { visible: false },
    },
  });

Composite.add(world, mouseConstraint);
render.mouse = mouse;

Render.lookAt(render, {
  min: { x: 0, y: 0 },
  max: { x: main.offsetWidth, y: main.offsetHeight },
});

let pouBody,
  leftEye,
  rightEye,
  leftPupil,
  rightPupil,
  mouth,
  leftEyeBag,
  rightEyeBag,
  leftEyebrow,
  rightEyebrow,
  blush;

// Добавляем CSS стили
const style = document.createElement("style");
style.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  .sleep-zzz { animation: float 2s infinite ease-in-out; user-select: none; }
  .tear-effect, .sweat-effect, .hunger-line { pointer-events: none; }
  .sick-pou { animation: shake 0.5s infinite; }
`;
document.head.appendChild(style);

// Класс Pou с анимациями
let polygon = 5;
// fetch("scripts/get/isSleep.php?pet_id=1")
//   .then((resp) => resp.json())
//   .then((pars) => {
//     polygon = pars;
//   });

class Pou {
  constructor(x, y) {
    // Основное тело
    this.body = Bodies.polygon(x, y, polygon, main.offsetWidth / 10, {
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
      },
    });

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
    this.leftPupil = Bodies.circle(x - 28, y - 20, 5, {
      isStatic: false,
      restitution: 0.1,
      collisionFilter: {
        category: petCategory,
        mask: [petCategory, itemInRoomCategory],
      },
      render: { fillStyle: "#000000" },
    });

    this.rightPupil = Bodies.circle(x + 22, y - 20, 5, {
      isStatic: false,
      restitution: 0.1,
      collisionFilter: {
        category: petCategory,
        mask: [petCategory, itemInRoomCategory],
      },
      render: { fillStyle: "#000000" },
    });

    this.mouth = this.createMouth(x, y, "normal");

    // Мешки под глазами (для усталости)
    this.leftEyeBag = Bodies.circle(x - 25, y - 8, 14, {
      isStatic: false,
      restitution: 0.1,
      collisionFilter: {
        category: petCategory,
        mask: [petCategory, itemInRoomCategory],
      },
      render: {
        fillStyle: "rgba(0,0,0,0)",
        visible: false,
      },
    });

    this.rightEyeBag = Bodies.circle(x + 25, y - 8, 14, {
      isStatic: false,
      restitution: 0.1,
      collisionFilter: {
        category: petCategory,
        mask: [petCategory, itemInRoomCategory],
      },
      render: {
        fillStyle: "rgba(0,0,0,0)",
        visible: false,
      },
    });

    // Брови
    this.leftEyebrow = Bodies.rectangle(x - 35, y - 45, 20, 4, {
      isStatic: false,
      restitution: 0.1,
      angle: 0,
      collisionFilter: {
        category: petCategory,
        mask: [petCategory, itemInRoomCategory],
      },
      render: {
        fillStyle: "#4A2C2A",
        strokeStyle: "#000000",
        lineWidth: 1,
      },
    });

    this.rightEyebrow = Bodies.rectangle(x + 35, y - 45, 20, 4, {
      isStatic: false,
      restitution: 0.1,
      angle: 0,
      collisionFilter: {
        category: petCategory,
        mask: [petCategory, itemInRoomCategory],
      },
      render: {
        fillStyle: "#4A2C2A",
        strokeStyle: "#000000",
        lineWidth: 1,
      },
    });

    // Румянец (для счастья)
    this.leftBlush = Bodies.circle(x - 35, y - 10, 8, {
      isStatic: false,
      restitution: 0.1,
      collisionFilter: {
        category: petCategory,
        mask: [petCategory, itemInRoomCategory],
      },
      render: {
        fillStyle: "rgba(255, 182, 193, 0)",
        visible: false,
      },
    });

    this.rightBlush = Bodies.circle(x + 35, y - 10, 8, {
      isStatic: false,
      restitution: 0.1,
      collisionFilter: {
        category: petCategory,
        mask: [petCategory, itemInRoomCategory],
      },
      render: {
        fillStyle: "rgba(255, 182, 193, 0)",
        visible: false,
      },
    });

    pouBody = this.body;
    leftEye = this.leftEye;
    rightEye = this.rightEye;
    leftPupil = this.leftPupil;
    rightPupil = this.rightPupil;
    mouth = this.mouth;

    // Создаем соединения
    this.joints = [
      // Глаза с телом
      Constraint.create({
        bodyA: this.body,
        bodyB: this.leftEye,
        pointA: { x: -25, y: -20 },
        stiffness: 0.5,
        render: { visible: false },
      }),
      Constraint.create({
        bodyA: this.body,
        bodyB: this.rightEye,
        pointA: { x: 25, y: -20 },
        stiffness: 0.5,
        render: { visible: false },
      }),
      // Зрачки с глазами
      Constraint.create({
        bodyA: this.leftEye,
        bodyB: this.leftPupil,
        pointA: { x: -3, y: 0 },
        stiffness: 0.8,
        render: { visible: false },
      }),
      Constraint.create({
        bodyA: this.rightEye,
        bodyB: this.rightPupil,
        pointA: { x: -3, y: 0 },
        stiffness: 0.8,
        render: { visible: false },
      }),
      // Рот с телом
      Constraint.create({
        bodyA: this.body,
        bodyB: this.mouth,
        pointA: { x: 0, y: 15 },
        stiffness: 0.3,
        render: { visible: false },
      }),
      // Мешки с глазами
      Constraint.create({
        bodyA: this.leftEye,
        bodyB: this.leftEyeBag,
        pointA: { x: 0, y: 12 },
        stiffness: 0.8,
        render: { visible: false },
      }),
      Constraint.create({
        bodyA: this.rightEye,
        bodyB: this.rightEyeBag,
        pointA: { x: 0, y: 12 },
        stiffness: 0.8,
        render: { visible: false },
      }),
      // Брови с телом
      Constraint.create({
        bodyA: this.body,
        bodyB: this.leftEyebrow,
        pointA: { x: -35, y: -45 },
        stiffness: 0.5,
        render: { visible: false },
      }),
      Constraint.create({
        bodyA: this.body,
        bodyB: this.rightEyebrow,
        pointA: { x: 35, y: -45 },
        stiffness: 0.5,
        render: { visible: false },
      }),
      // Румянец с телом
      Constraint.create({
        bodyA: this.body,
        bodyB: this.leftBlush,
        pointA: { x: -35, y: -10 },
        stiffness: 0.5,
        render: { visible: false },
      }),
      Constraint.create({
        bodyA: this.body,
        bodyB: this.rightBlush,
        pointA: { x: 35, y: -10 },
        stiffness: 0.5,
        render: { visible: false },
      }),
    ];

    World.add(world, [
      this.body,
      this.leftEye,
      this.rightEye,
      this.leftPupil,
      this.rightPupil,
      this.mouth,
      this.leftEyeBag,
      this.rightEyeBag,
      this.leftEyebrow,
      this.rightEyebrow,
      this.leftBlush,
      this.rightBlush,
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
      case "sick":
        return Bodies.fromVertices(
          x,
          y,
          [
            { x: -10, y: 0 },
            { x: 0, y: 5 },
            { x: 10, y: 0 },
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
              fillStyle: "#90EE90",
              strokeStyle: "#32CD32",
              lineWidth: 2,
            },
          },
          true,
        );
      case "hungry":
        return Bodies.fromVertices(
          x,
          y,
          [
            { x: -15, y: 0 },
            { x: 0, y: -5 },
            { x: 15, y: 0 },
          ],
          {
            isStatic: false,
            restitution: 0.3,
            collisionFilter: {
              category: petCategory,
              mask: [petCategory, itemInRoomCategory],
            },
            render: {
              fillStyle: "#FFA07A",
              strokeStyle: "#FF4500",
              lineWidth: 2,
            },
          },
          true,
        );
      default:
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

  async changeMouth(type, force) {
    if (type === currentMood && !force) return;
    currentMood = type;

    const pos = this.mouth.position;
    World.remove(world, this.mouth);

    this.mouth = this.createMouth(pos.x, pos.y, type);
    mouth = this.mouth;
    World.add(world, this.mouth);

    const newJoint = Constraint.create({
      bodyA: this.body,
      bodyB: this.mouth,
      pointA: { x: 0, y: 15 },
      stiffness: 0.6,
      render: { visible: false },
    });
    World.add(world, newJoint);
  }

  eat() {
    if (isEating) return;
    isEating = true;
    this.changeMouth("eating", true);

    let chewCount = 0;
    const chewInterval = setInterval(() => {
      if (chewCount >= 6) {
        clearInterval(chewInterval);
        isEating = false;
        this.updateMoodBasedOnStats();
        return;
      }
      this.changeMouth(chewCount % 2 === 0 ? "normal" : "eating", true);
      chewCount++;
    }, 200);
  }

  updateMoodBasedOnStats() {
    let happiness = parseInt(pet._funny);
    let hunger = parseInt(pet._hunger);
    let sleep = parseInt(pet._sleep);
    let health = parseInt(pet._health);

    // Болезнь - самый высокий приоритет
    if (health < 30) {
      this.changeMouth("sick", true);
      this.leftEyebrow.angle = -0.3;
      this.rightEyebrow.angle = 0.3;
      return;
    }

    // Голод
    if (hunger < 30) {
      this.changeMouth("hungry", true);
      this.leftEyebrow.angle = -0.2;
      this.rightEyebrow.angle = 0.2;
      return;
    }

    // Грусть
    if (happiness < 30) {
      this.changeMouth("sad", true);
      this.leftEyebrow.angle = -0.1;
      this.rightEyebrow.angle = 0.1;
      return;
    }

    // Счастье
    if (happiness > 70 && hunger > 50 && sleep > 50 && health > 70) {
      this.changeMouth("happy", true);
      this.leftEyebrow.angle = 0.1;
      this.rightEyebrow.angle = -0.1;
      return;
    }

    // Нормальное состояние
    this.changeMouth("normal", true);
    this.leftEyebrow.angle = 0;
    this.rightEyebrow.angle = 0;
  }

  // Анимация голода
  updateHunger(hungerValue) {
    if (hungerValue < 40) {
      if (Math.random() < 0.02 && hungerAnimation.hungerLines.length < 3) {
        const x = this.body.position.x + (Math.random() - 0.5) * 40;
        const y = this.body.position.y - 30;
        const line = new HungerLineEffect(x, y);
        hungerAnimation.hungerLines.push(line);

        setTimeout(() => {
          const index = hungerAnimation.hungerLines.indexOf(line);
          if (index > -1) {
            line.remove();
            hungerAnimation.hungerLines.splice(index, 1);
          }
        }, 1000);
      }
    }
  }

  // Анимация сна
  updateSleep(sleepValue) {
    const tirednessThreshold = 40;
    if (sleepValue < tirednessThreshold) {
      const bagOpacity = Math.min(0.5, (tirednessThreshold - sleepValue) / 100);
      this.leftEyeBag.render.fillStyle = `rgba(74, 44, 42, ${bagOpacity})`;
      this.rightEyeBag.render.fillStyle = `rgba(74, 44, 42, ${bagOpacity})`;
      this.leftEyeBag.render.visible = true;
      this.rightEyeBag.render.visible = true;

      if (Math.random() < 0.03) this.blink();

      if (sleepAnimation.yawningTimer <= 0 && Math.random() < 0.01) {
        this.yawn();
        sleepAnimation.yawningTimer = 180;
      }

      if (Math.random() < 0.02 && sleepAnimation.sleepZzz.length < 5) {
        this.createZzz();
      }
    } else {
      if (sleepValue > 70) {
        this.leftEyeBag.render.visible = false;
        this.rightEyeBag.render.visible = false;
      }
    }
    if (sleepAnimation.yawningTimer > 0) sleepAnimation.yawningTimer--;
  }

  // Анимация счастья
  updateHappiness(happinessValue) {
    if (happinessValue > 70) {
      this.leftBlush.render.fillStyle = "rgba(255, 182, 193, 0.5)";
      this.rightBlush.render.fillStyle = "rgba(255, 182, 193, 0.5)";
      this.leftBlush.render.visible = true;
      this.rightBlush.render.visible = true;
    } else {
      this.leftBlush.render.visible = false;
      this.rightBlush.render.visible = false;
    }
  }

  // Анимация грусти
  updateSadness(happinessValue) {
    if (happinessValue < 30) {
      if (Math.random() < 0.02 && moodAnimation.tears.length < 3) {
        this.createTear();
      }
    }
  }

  // Анимация болезни
  updateSickness(healthValue) {
    if (healthValue < 30) {
      // Добавляем эффект дрожания
      if (this.body.render.sprite) {
        this.body.render.sprite.xOffset = Math.sin(Date.now() * 0.02) * 2;
        this.body.render.sprite.yOffset = Math.cos(Date.now() * 0.03) * 2;
      }

      // Капли пота
      if (Math.random() < 0.03 && moodAnimation.sickness.length < 5) {
        this.createSweat();
      }
    } else {
      if (this.body.render.sprite) {
        this.body.render.sprite.xOffset = 0;
        this.body.render.sprite.yOffset = 0;
      }
    }
  }

  blink() {
    if (!this.leftEye || !this.rightEye || is_sleep) return;
    Body.scale(this.leftEye, 1, 0.5);
    Body.scale(this.rightEye, 1, 0.5);
    setTimeout(() => {
      Body.scale(this.leftEye, 1, 2);
      Body.scale(this.rightEye, 1, 2);
    }, 100);
  }

  yawn() {
    if (currentMood !== "eating") {
      this.changeMouth("eating", true);
      Body.scale(this.leftEye, 1, 1);
      Body.scale(this.rightEye, 1, 1);
      setTimeout(() => {
        this.updateMoodBasedOnStats();
        Body.scale(this.leftEye, 1, 1);
        Body.scale(this.rightEye, 1, 1);
      }, 1500);
    }
  }

  createZzz() {
    if (!this.body) return;
    const x = this.body.position.x + (Math.random() - 0.5) * 40;
    const y = this.body.position.y - 50;
    const zzz = new SleepEffect(x, y);
    sleepAnimation.sleepZzz.push(zzz);
    setTimeout(() => {
      const index = sleepAnimation.sleepZzz.indexOf(zzz);
      if (index > -1) {
        zzz.remove();
        sleepAnimation.sleepZzz.splice(index, 1);
      }
    }, 2000);
  }

  createTear() {
    if (!this.leftEye || !this.rightEye) return;
    const eye = Math.random() < 0.5 ? this.leftEye : this.rightEye;
    const tear = new TearEffect(eye.position.x, eye.position.y + 10);
    moodAnimation.tears.push(tear);
    setTimeout(() => {
      const index = moodAnimation.tears.indexOf(tear);
      if (index > -1) {
        tear.remove();
        moodAnimation.tears.splice(index, 1);
      }
    }, 3000);
  }

  createSweat() {
    if (!this.body) return;
    const x = this.body.position.x + (Math.random() - 0.5) * 40;
    const y = this.body.position.y - 20 + (Math.random() - 0.5) * 20;
    const sweat = new SweatEffect(x, y);
    moodAnimation.sickness.push(sweat);
    // setTimeout(() => {
    //   const index = moodAnimation.sickness.indexOf(sweat);
    //   if (index > -1) {
    //     sweat.remove();
    //     moodAnimation.sickness.splice(index, 1);
    //   }
    // }, 2000);
  }
}

// Создаем нашего Pou
export const pou = new Pou(main.offsetWidth / 2, main.offsetHeight / 2);

// Функции создания предметов
export function createFood(x, y, respawn = false) {
  if (
    rooms[roomIndex]["_shop_id"] != 2 ||
    !avaliableProducts ||
    Object.keys(avaliableProducts).length === 0
  ) {
    return;
  }

  if (currentFood && !respawn) return;

  const productKeys = Object.keys(avaliableProducts);
  if (!productKeys.length || !avaliableProducts[productKeys[productCount]])
    return;

  const currentProduct = avaliableProducts[productKeys[productCount]];
  const foodImg = `images/${currentProduct._imgSrc}`;

  let positionX = x,
    positionY = y;

  if (currentFood && respawn) {
    positionX = currentFood.position.x;
    positionY = currentFood.position.y;
    World.remove(world, currentFood);
  }

  const food = Bodies.circle(positionX, positionY, 28, {
    restitution: 0.3,
    friction: 0.1,
    density: 0.001,
    label: "food",
    collisionFilter: {
      category: itemInRoomCategory,
      mask: petCategory | itemInRoomCategory,
    },
    render: {
      strokeStyle: "#000000",
      lineWidth: 2,
      sprite: { texture: foodImg, xScale: 0.5, yScale: 0.5 },
    },
  });

  currentFood = food;
  World.add(world, food);
  return food;
}

export function createPotion(x, y, respawn = false) {
  if (
    rooms[roomIndex]["_shop_id"] != 4 ||
    !avaliablePotions ||
    Object.keys(avaliablePotions).length === 0
  ) {
    return;
  }

  if (currentPotion && !respawn) return;

  const potionKeys = Object.keys(avaliablePotions);
  if (!potionKeys.length || !avaliablePotions[potionKeys[potionCount]]) return;

  const currentPotionItem = avaliablePotions[potionKeys[potionCount]];
  const potionImg = `images/${currentPotionItem._imgSrc}`;

  let positionX = x,
    positionY = y;

  if (currentPotion && respawn) {
    positionX = currentPotion.position.x;
    positionY = currentPotion.position.y;
    World.remove(world, currentPotion);
  }

  const potion = Bodies.circle(positionX, positionY, 28, {
    restitution: 0.3,
    friction: 0.1,
    density: 0.001,
    label: "potion",
    collisionFilter: {
      category: itemInRoomCategory,
      mask: petCategory | itemInRoomCategory,
    },
    render: {
      strokeStyle: "#000000",
      lineWidth: 2,
      sprite: { texture: potionImg, xScale: 0.5, yScale: 0.5 },
    },
  });

  currentPotion = potion;
  World.add(world, potion);
  return potion;
}

// Основная функция анимации
export function pouMood() {
  let foodCreated = false;
  let potionCreated = false;

  Events.on(engine, "afterUpdate", function () {
    let happiness = parseInt(pet._funny);
    let hunger = parseInt(pet._hunger);
    let sleep = parseInt(pet._sleep);
    let health = parseInt(pet._health);

    // Обновляем все анимации
    pou.updateMoodBasedOnStats();
    pou.updateHunger(hunger);
    pou.updateSleep(sleep);
    pou.updateHappiness(happiness);
    pou.updateSadness(happiness);
    pou.updateSickness(health);

    // Обновляем эффекты
    sleepAnimation.sleepZzz = sleepAnimation.sleepZzz.filter((zzz) =>
      zzz.update(),
    );
    moodAnimation.tears = moodAnimation.tears.filter((tear) => tear.update());
    moodAnimation.sickness = moodAnimation.sickness.filter((sweat) =>
      sweat.update(),
    );
    hungerAnimation.hungerLines = hungerAnimation.hungerLines.filter((line) =>
      line.update(),
    );

    // Логика создания еды
    if (rooms[roomIndex]["_shop_id"] == 2) {
      if (
        !currentFood &&
        !foodCreated &&
        avaliableProducts &&
        Object.keys(avaliableProducts).length > 0
      ) {
        createFood(main.offsetWidth / 2, main.offsetHeight / 1.2);
        foodCreated = true;
      }
    } else {
      if (currentFood) {
        World.remove(world, currentFood);
        currentFood = false;
      }
      foodCreated = false;
    }

    // Логика создания зелья
    if (rooms[roomIndex]["_shop_id"] == 4) {
      if (
        !currentPotion &&
        !potionCreated &&
        avaliablePotions &&
        Object.keys(avaliablePotions).length > 0
      ) {
        createPotion(main.offsetWidth / 2, main.offsetHeight / 1.2);
        potionCreated = true;
      }
    } else {
      if (currentPotion) {
        World.remove(world, currentPotion);
        currentPotion = false;
      }
      potionCreated = false;
    }

    // Обработка столкновений с едой
    if (
      rooms[roomIndex]["_shop_id"] == 2 &&
      currentFood &&
      avaliableProducts &&
      Object.keys(avaliableProducts).length > 0
    ) {
      const collisions = Query.collides(mouth, [currentFood]);
      if (collisions.length > 0 && !isDragging) {
        World.remove(world, currentFood);
        currentFood = false;

        const productKeys = Object.keys(avaliableProducts);
        const currentProduct = avaliableProducts[productKeys[productCount]];
        pet.use(currentProduct, "product");

        if (currentProduct["_count"] > 1) {
          currentProduct["_count"] = Number(currentProduct["_count"]) - 1;
        } else {
          delete avaliableProducts[productKeys[productCount]];
          if (productCount < productKeys.length - 1) productCount++;
          else productCount = 0;
        }

        pou.eat();

        if (Object.keys(avaliableProducts).length > 0) {
          createFood(main.offsetWidth / 2, main.offsetHeight / 1.2);
        }
      }
    }

    // Обработка столкновений с зельем
    if (
      rooms[roomIndex]["_shop_id"] == 4 &&
      currentPotion &&
      avaliablePotions &&
      Object.keys(avaliablePotions).length > 0
    ) {
      const collisions = Query.collides(mouth, [currentPotion]);
      if (collisions.length > 0 && !isDragging) {
        World.remove(world, currentPotion);
        currentPotion = false;

        const potionKeys = Object.keys(avaliablePotions);
        const currentPotionItem = avaliablePotions[potionKeys[potionCount]];
        pet.use(currentPotionItem, "potion");

        if (currentPotionItem["_count"] > 1) {
          currentPotionItem["_count"] = Number(currentPotionItem["_count"]) - 1;
        } else {
          delete avaliablePotions[potionKeys[potionCount]];
          if (potionCount < potionKeys.length - 1) potionCount++;
          else potionCount = 0;
        }

        pou.eat();

        if (Object.keys(avaliablePotions).length > 0) {
          createPotion(main.offsetWidth / 2, main.offsetHeight / 1.2);
        }
      }
    }

    // Анимация зрачков (только если не больной и не очень грустный)
    if (
      mouse.position &&
      leftPupil &&
      rightPupil &&
      leftEye &&
      rightEye &&
      happiness > 30 &&
      health > 30
    ) {
      const dx = mouse.position.x - pouBody.position.x;
      const dy = mouse.position.y - pouBody.position.y;
      const maxDist = 5;

      if (sleep > 40) {
        Body.setPosition(leftPupil, {
          x:
            leftEye.position.x -
            3 +
            Math.min(maxDist, Math.max(-maxDist, dx * 0.05)),
          y:
            leftEye.position.y +
            Math.min(maxDist, Math.max(-maxDist, dy * 0.05)),
        });
        Body.setPosition(rightPupil, {
          x:
            rightEye.position.x -
            3 +
            Math.min(maxDist, Math.max(-maxDist, dx * 0.05)),
          y:
            rightEye.position.y +
            Math.min(maxDist, Math.max(-maxDist, dy * 0.05)),
        });
      }
    }

    // Отслеживание перетаскивания
    if (mouseConstraint.body === currentFood && !isDragging) isDragging = true;
    if (mouseConstraint.body !== currentFood && isDragging) isDragging = false;
  });
}

// Инициализация при загрузке
productFetch.finally(() => {
  if (avaliableProducts && Object.keys(avaliableProducts).length > 0) {
    productGeted = true;
  }
});

potionFetch.finally(() => {
  if (avaliablePotions && Object.keys(avaliablePotions).length > 0) {
    potionGeted = true;
  }
});

// Функция для сна
let is_sleep = fetch("scripts/get/isSleep.php?pet_id=1")
  .then((resp) => resp.json())
  .then((pars) => {
    return !pars["is_sleep"];
  });
function getSleep() {
  fetch("scripts/get/isSleep.php?pet_id=1")
    .then((resp) => resp.json())
    .then((pars) => {
      if (pars["is_sleep"] != 0) {
        leftEye.render.fillStyle = "#FFFFFF";
        rightEye.render.fillStyle = "#FFFFFF";
        leftPupil.render.visible = true;
        rightPupil.render.visible = true;
        is_sleep = false;
        fetch(`scripts/update/sleep.php?is=0&pet_id=1`);
      } else {
        leftEye.render.fillStyle = "brown";
        rightEye.render.fillStyle = "brown";
        leftPupil.render.visible = false;
        rightPupil.render.visible = false;
        is_sleep = true;
        fetch(`scripts/update/sleep.php?is=1&pet_id=1`);
      }
      Render.world(render);
    });
}

// Обработчик кнопки сна
const secondButton = document.querySelector("footer .buttons .second");
if (secondButton) {
  secondButton.addEventListener("click", function () {
    if (rooms[roomIndex]["_shop_id"] == 1) getSleep();
  });
}

// Инициализация состояния сна
fetch("scripts/get/isSleep.php?pet_id=1")
  .then((resp) => resp.json())
  .then((pars) => {
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
