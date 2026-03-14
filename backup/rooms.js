import { avaliableLuxaries, luxaries } from "./luxaries.js";

// import { createFood, createPotion } from "./matter.js";
const menu = document.querySelector(".shop");
const main = document.querySelector("main");
const footer = document.querySelector("footer");
const header = document.querySelector("header");
const menuGrid = menu.querySelector(".grid");
const footerButtons = document
  .querySelector("footer")
  .querySelector(".buttons");
const firstButton = footerButtons.querySelector(".first");
const secondButton = footerButtons.querySelector(".second");
const thirdButton = footerButtons.querySelector(".third");

// export let sleep_false = ;
// export let sleep_true = ;

// export let sleep_false = fetch(`scripts/update/sleep.php?is=0&pet_id=1`);
// export let sleep_true = fetch(`scripts/update/sleep.php?is=1&pet_id=1`);

const buttonChangeRoomLeft = document.querySelector(".left");
const buttonChangeRoomRight = document.querySelector(".right");
const titleRoom = document.querySelector(".title");
export function changeRoom(room) {
  document.body.style.backgroundImage = `url(${room._backgroundSrc})`;
  firstButton.querySelector("img").src = room._firstButtonSrc;
  firstButton.querySelector("img").alt = room._firstButtonAlt;

  titleRoom.innerHTML = room._title;

  secondButton.querySelector("img").src = room._secondButtonSrc;
  secondButton.querySelector("img").alt = room._secondButtonAlt;

  // thirdButton.querySelector("img").src = room._thirdButtonSrc;
  // thirdButton.querySelector("img").alt = room._thirdButtonAlt;
  document.addEventListener("click", function (event) {
    // Проверяем, был ли клик по нашему элементу или внутри него
    // if (!menu.contains(event.target) && !firstButton.contains(event.target) && !menuGrid.contains(event.target)) {
    if (
      (main.contains(event.target) ||
        footer.contains(event.target) ||
        header.contains(event.target)) &&
      !secondButton.contains(event.target)
    ) {
      menu.style.display = "none";
      menuGrid.innerHTML = "";
      // console.log("Клик был НЕ по указанному объекту");
      // Здесь можно выполнить нужные действия
    } else {
      // console.log("Клик был по указанному объекту");
    }
  });

  secondButton.onclick = () => {
    if (room._shop_id !== 1) {
      menu.style.display = "flex";
      menuGrid.innerHTML = "";
      menuGrid.insertAdjacentHTML(
        "beforeend",
        `<div class="card"><img id="wallpaper" src="images/icons/shops/wallpapers.png"><p>Обои</p></div>`,
      );

      document.querySelector("#wallpaper").onclick = () => {
        menuGrid.innerHTML = "";
        for (const key in avaliableLuxaries) {
          if (Object.prototype.hasOwnProperty.call(avaliableLuxaries, key)) {
            const element = avaliableLuxaries[key];
            console.log(element);
            menuGrid.insertAdjacentHTML(
              "beforeend",
              `<div class="card"><img class="shop-item" id="i${element["_id"]}" src="images/${element["_imgSrc"]}"><p>${element["_title"]}</p><p>${element["_imgSrc"] == room["_backgroundSrc"].slice(7) ? "<img class='owned-sm' src='images/dialog/owned_sm.png'>" : ""}${element["_price"]}</p></div>`,
            );
            console.log(element["_imgSrc"], room["_backgroundSrc"].slice(7));
            document.querySelector(`#i${element["_id"]}`).onclick = () => {
              room["_backgroundSrc"] = "images/" + element["_imgSrc"];
              changeRoom(room);
              const data = {
                pet_id: 1,
                lux_id: element["_id"],
                roomBg: room["_tech_title"],
              };
              fetch("scripts/update/bg.php", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              });
            };
          }
        }
      };
      if (room._shop_id === 5) {
        menuGrid.insertAdjacentHTML(
          "beforeend",
          `<a href="up_down_food.php"><img class="food_drop" src="images/icons/games/Food Drop.png"></a>`,
        );
      }
    } else {
      fetch("scripts/get/isSleep.php?pet_id=1", {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((resp) => resp.json())
        .then((pars) => {
          console.log(pars["is_sleep"]);
          if (pars["is_sleep"] != 0) {
            fetch(`scripts/update/sleep.php?is=0&pet_id=1`);
          } else {
            fetch(`scripts/update/sleep.php?is=1&pet_id=1`);
          }
        });
    }
  };

  // room.trigger ? room.trigger() : false;
}

class Room {
  constructor(
    title,
    backgroundSrc,
    firstButtonSrc,
    firstButtonAlt,
    secondButtonSrc,
    secondButtonAlt,
    thirdButtonSrc,
    thirdButtonAlt,
    shop_id,
    tech_title,
  ) {
    this._title = title;
    this._backgroundSrc = backgroundSrc;
    this._firstButtonSrc = firstButtonSrc;
    this._firstButtonAlt = firstButtonAlt;
    this._secondButtonSrc = secondButtonSrc;
    this._secondButtonAlt = secondButtonAlt;
    this._thirdButtonSrc = thirdButtonSrc;
    this._thirdButtonAlt = thirdButtonAlt;
    this._shop_id = shop_id;
    this._tech_title = tech_title;
  }
}

export let bedroom = new Room(
  "Спальня",
  `images/`,
  `images/closets/closet.png`,
  "Шкаф",
  `images/lamps/100/light_on.png`,
  "Ночник",
  `images/shop/shop.png`,
  "Магазин",
  1,
  "bedroomBg",
);
export let kitchen = new Room(
  "Кухня",
  `images/`,
  `images/fridges/fridge.png`,
  "Холодильник",
  `images/shop/shop.png`,
  "Магазин",
  ``,
  "",
  2,
  "kitchenBg",
  // createFood,
);
export let bathroom = new Room(
  "Ванная",
  `images/`,
  `images/showers/100/white.png`,
  "Душ",
  `images/soaps/100/white.png`,
  "Мыло",
  "images/shop/shop.png",
  "Магазин",
  3,
);
export let laboratory = new Room(
  "Лаборатория",
  `images/`,
  `images/shelves/shelf.png`,
  "Аптечка",
  `images/shop/shop.png`,
  "Аптека",
  ``,
  "",
  4,
  "laboratoryBg",
  // createPotion,
);
export let playroom = new Room(
  "Игровая",
  `images/`,
  `images/room/joystick.png`,
  "Игры",
  `images/shop/shop.png`,
  "Магазин",
  ``,
  "",
  5,
  "playroomBg",
);

export const rooms = [bedroom, kitchen, laboratory, playroom];
export let roomIndex = 0;

buttonChangeRoomLeft.onclick = (e) => {
  if (roomIndex) {
    roomIndex--;
    changeRoom(rooms[roomIndex]);
  } else {
    roomIndex = rooms.length - 1;
    changeRoom(rooms[roomIndex]);
  }
};

buttonChangeRoomRight.onclick = (e) => {
  if (roomIndex == rooms.length - 1) {
    roomIndex = 0;
    changeRoom(rooms[roomIndex]);
  } else {
    roomIndex++;
    changeRoom(rooms[roomIndex]);
  }
};

// playroom._backgroundSrc = "imgs/test.jpg";

// changeRoom(rooms[roomIndex]);
