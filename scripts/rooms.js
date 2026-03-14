import { avaliableLuxaries, luxaries } from "./luxaries.js";
import { avaliableProducts, products } from "./products.js";
import { avaliablePotions, potions } from "./potions.js";

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

const buttonChangeRoomLeft = document.querySelector(".left");
const buttonChangeRoomRight = document.querySelector(".right");
const titleRoom = document.querySelector(".title");

// Текущая активная комната
let currentRoom = null;
// Текущий режим отображения (для обновления)
let currentDisplayMode = null;
let currentCategory = null;

// Функция для показа меню
function showMenu() {
  menu.style.display = "flex";
}

// Функция для скрытия меню
function hideMenu() {
  menu.style.display = "none";
  menuGrid.innerHTML = "";
}

// Функция для очистки и скрытия меню
function clearAndHideMenu() {
  menu.style.display = "none";
  menuGrid.innerHTML = "";
  currentDisplayMode = null;
  currentCategory = null;
}

// Функция для регистрации кликов по карточкам
function registerCardClick(cardElement, callback) {
  if (cardElement) {
    cardElement.addEventListener("click", (event) => {
      event.stopPropagation();
      callback(cardElement);
    });
  }
}

// Функция для создания карточки с автоматической регистрацией клика
function createCard(html, clickHandler) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  const card = tempDiv.firstElementChild;

  if (clickHandler) {
    registerCardClick(card, clickHandler);
  }

  return card;
}

// Функция для получения количества продукта
function getProductQuantity(productId) {
  // Здесь должен быть запрос к серверу
  return Math.floor(Math.random() * 5);
}

// Функция для получения количества зелья
function getPotionQuantity(potionId) {
  // Здесь должен быть запрос к серверу
  return Math.floor(Math.random() * 3);
}

// Функция для проверки, куплен ли предмет роскоши (находится ли в avaliableLuxaries)
function isLuxuryOwned(luxuryItem) {
  // Проверяем, есть ли предмет в avaliableLuxaries
  for (const key in avaliableLuxaries) {
    if (Object.prototype.hasOwnProperty.call(avaliableLuxaries, key)) {
      const element = avaliableLuxaries[key];
      // Сравниваем по ID
      if (element._id === luxuryItem._id) {
        return true;
      }
    }
  }
  return false;
}

// Функция для проверки, выбраны ли текущие обои
function isLuxurySelected(luxuryItem) {
  if (currentRoom) {
    return "images/" + luxuryItem._imgSrc === currentRoom._backgroundSrc;
  }
  return false;
}

// Функция для создания карточек обоев (для покупки в магазине)
function createWallpaperPurchaseCards() {
  currentCategory = 'wallpaper';
  currentDisplayMode = 'purchase';
  menuGrid.innerHTML = "";
  
  // Используем luxaries для магазина
  for (const key in luxaries) {
    if (Object.prototype.hasOwnProperty.call(luxaries, key)) {
      const element = luxaries[key];
      // Показываем только обои с shop_id == 0 (доступные для покупки)
      if (element._shop_id == 0) {
        // Проверяем, куплен ли уже этот предмет (есть ли в avaliableLuxaries)
        const isOwned = isLuxuryOwned(element);
        
        const cardHtml = `<div class="card ${isOwned ? 'owned' : ''}" data-lux-id="${element._id}">
          <img class="shop-item" src="images/${element._imgSrc}">
          <p>${element._title}</p>
          <div class="price-container">
            ${isOwned ? '<img class="owned-icon" src="images/dialog/owned_sm.png">' : ''}
            ${!isOwned ? `<span class="price"><img src='images/coin/coin_sm.png' class='coin-icon'> ${element._price}</span>` : ''}
          </div>
        </div>`;
        
        const card = createCard(cardHtml, (cardElement) => {
          if (!isOwned) {
            handlePurchaseLuxury(cardElement, element);
          }
        });
        
        menuGrid.appendChild(card);
      }
    }
  }
}

// Функция для создания карточек обоев (для выбора из已有)
function createWallpaperSelectCards() {
  currentCategory = "wallpaper";
  currentDisplayMode = "select";
  menuGrid.innerHTML = "";

  // Используем avaliableLuxaries для выбора已有 обоев
  for (const key in avaliableLuxaries) {
    if (Object.prototype.hasOwnProperty.call(avaliableLuxaries, key)) {
      const element = avaliableLuxaries[key];
      const isSelected = isLuxurySelected(element);

      const cardHtml = `<div class="card ${isSelected ? "selected" : ""}" data-lux-id="${element._id}">
        <img class="shop-item" src="images/${element._imgSrc}">
        <p>${element._title}</p>
        <div class="price-container">
          <img class="owned-icon" src="images/dialog/owned_sm.png">
        </div>
      </div>`;

      const card = createCard(cardHtml, (cardElement) => {
        handleSelectLuxury(cardElement, element);
      });

      menuGrid.appendChild(card);
    }
  }
}

// Функция для создания карточек продуктов (для покупки в магазине)
function createProductPurchaseCards() {
  currentCategory = "product";
  currentDisplayMode = "purchase";
  menuGrid.innerHTML = "";

  // Используем products для магазина
  for (const key in products) {
    if (Object.prototype.hasOwnProperty.call(products, key)) {
      const element = products[key];

      const cardHtml = `<div class="card" data-product-id="${element._id}">
        <img class="shop-item" src="images/${element._imgSrc}">
        <p>${element._title}</p>
        <div class="price-container">
          <span class="price"><img src='images/coin/coin_sm.png' class='coin-icon'> ${element._price}</span>
        </div>
      </div>`;

      const card = createCard(cardHtml, (cardElement) => {
        handlePurchaseProduct(cardElement, element);
      });

      menuGrid.appendChild(card);
    }
  }
}

// Функция для создания карточек продуктов (для выбора из已有)
function createProductSelectCards() {
  currentCategory = "product";
  currentDisplayMode = "select";
  menuGrid.innerHTML = "";

  // Используем avaliableProducts для выбора已有 продуктов
  for (const key in avaliableProducts) {
    if (Object.prototype.hasOwnProperty.call(avaliableProducts, key)) {
      const element = avaliableProducts[key];
      const quantity = element["_count"];
      const hasItems = quantity > 0;

      const cardHtml = `<div class="card" data-product-id="${element._id}">
        <img class="shop-item" src="images/${element._imgSrc}">
        <p>${element._title}</p>
        <div class="price-container">
          ${hasItems ? `<span class="quantity">${quantity} шт</span>` : ""}
        </div>
      </div>`;

      const card = createCard(cardHtml, (cardElement) => {
        if (hasItems) {
          handleSelectProduct(cardElement, element);
        }
      });

      menuGrid.appendChild(card);
    }
  }
}

// Функция для создания карточек зелий (для покупки в магазине)
function createPotionPurchaseCards() {
  currentCategory = "potion";
  currentDisplayMode = "purchase";
  menuGrid.innerHTML = "";

  // Используем potions для магазина
  for (const key in potions) {
    if (Object.prototype.hasOwnProperty.call(potions, key)) {
      const element = potions[key];

      const cardHtml = `<div class="card" data-potion-id="${element._id}">
        <img class="shop-item" src="images/${element._imgSrc}">
        <p>${element._title}</p>
        <div class="price-container">
          <span class="price"><img src='images/coin/coin_sm.png' class='coin-icon'> ${element._price}</span>
        </div>
      </div>`;

      const card = createCard(cardHtml, (cardElement) => {
        handlePurchasePotion(cardElement, element);
      });

      menuGrid.appendChild(card);
    }
  }
}

// Функция для создания карточек зелий (для выбора из已有)
function createPotionSelectCards() {
  currentCategory = "potion";
  currentDisplayMode = "select";
  menuGrid.innerHTML = "";

  // Используем avaliablePotions для выбора已有 зелий
  for (const key in avaliablePotions) {
    if (Object.prototype.hasOwnProperty.call(avaliablePotions, key)) {
      const element = avaliablePotions[key];
      const quantity = element["_count"];
      const hasItems = quantity > 0;

      const cardHtml = `<div class="card" data-potion-id="${element._id}">
        <img class="shop-item" src="images/${element._imgSrc}">
        <p>${element._title}</p>
        <div class="price-container">
          ${hasItems ? `<span class="quantity">${quantity} шт</span>` : ""}
        </div>
      </div>`;

      const card = createCard(cardHtml, (cardElement) => {
        if (hasItems) {
          handleSelectPotion(cardElement, element);
        }
      });

      menuGrid.appendChild(card);
    }
  }
}

// Функция для создания карточек игр
function createGamesCards() {
  currentCategory = "games";
  currentDisplayMode = "games";
  menuGrid.innerHTML = "";

  const games = [
    {
      id: 1,
      title: "Food Drop",
      src: "images/icons/games/Food Drop.png",
      link: "up_down_food.php",
    },
    {
      id: 2,
      title: "Memory Game",
      src: "images/icons/games/memory.png",
      link: "memory_game.php",
    },
    {
      id: 3,
      title: "Puzzle",
      src: "images/icons/games/puzzle.png",
      link: "puzzle.php",
    },
  ];

  games.forEach((game) => {
    const cardHtml = `<a href="${game.link}" class="card game-card">
      <img class="game-icon" src="${game.src}">
      <p>${game.title}</p>
    </a>`;

    const card = createCard(cardHtml, () => {});
    menuGrid.appendChild(card);
  });
}

// Обработчики для выбора предметов (firstButton)
function handleSelectLuxury(cardElement, luxuryItem) {
  // console.log("Выбраны обои:", luxuryItem);
  if (currentRoom) {
    // Обновляем фон комнаты
    currentRoom._backgroundSrc = "images/" + luxuryItem._imgSrc;
    changeRoom(currentRoom);

    // Обновляем отображение карточек обоев
    if (currentCategory === "wallpaper" && currentDisplayMode === "select") {
      createWallpaperSelectCards();
    }

    // Сохраняем выбор в БД через bg.php
    const data = {
      pet_id: 1,
      lux_id: luxuryItem._id,
      roomBg: currentRoom._tech_title,
    };

    fetch("scripts/update/bg.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          // console.log("Обои успешно применены");
        }
      });
  }
}

function handleSelectProduct(cardElement, productItem) {
  // console.log("Выбран продукт:", productItem);

  const data = {
    pet_id: 1,
    product_id: productItem._id,
    action: "use",
  };

  fetch("scripts/update/use_product.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        if (currentCategory === "product" && currentDisplayMode === "select") {
          createProductSelectCards();
        }
      }
    });
}

function handleSelectPotion(cardElement, potionItem) {
  // console.log("Выбрано зелье:", potionItem);

  const data = {
    pet_id: 1,
    potion_id: potionItem._id,
    action: "use",
  };

  fetch("scripts/update/use_potion.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        if (currentCategory === "potion" && currentDisplayMode === "select") {
          createPotionSelectCards();
        }
      }
    });
}

// Обработчики для покупки предметов (secondButton)
function handlePurchaseLuxury(cardElement, luxuryItem) {
  // console.log("Покупка обоев:", luxuryItem);

  const data = {
    pet_id: 1,
    lux_id: luxuryItem._id,
    price: luxuryItem._price,
    action: "buy",
  };

  fetch("scripts/update/buy_luxury.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        // console.log("Покупка успешна, обновляем карточку");

        // Добавляем предмет в avaliableLuxaries (локально)
        // Находим предмет в luxaries и добавляем его в avaliableLuxaries
        let itemAdded = false;
        for (const key in luxaries) {
          if (luxaries[key]._id === luxuryItem._id) {
            // Проверяем, нет ли уже такого предмета в avaliableLuxaries
            let alreadyExists = false;
            for (const availKey in avaliableLuxaries) {
              if (avaliableLuxaries[availKey]._id === luxuryItem._id) {
                alreadyExists = true;
                break;
              }
            }

            if (!alreadyExists) {
              // Создаем новый массив, если avaliableLuxaries - объект
              if (!Array.isArray(avaliableLuxaries)) {
                // Если это объект объектов, добавляем новое свойство
                const newKey = Object.keys(avaliableLuxaries).length;
                avaliableLuxaries[newKey] = { ...luxaries[key] };
              } else {
                // Если это массив, добавляем элемент
                avaliableLuxaries.push({ ...luxaries[key] });
              }
              itemAdded = true;
            }
            break;
          }
        }

        if (itemAdded) {
          // console.log("Предмет добавлен в avaliableLuxaries");
        }

        // Обновляем конкретную карточку
        updateCardAfterPurchase(cardElement, luxuryItem);
      } else {
        // alert(result.error || "Недостаточно средств");
      }
    })
    .catch((error) => {
      // console.error("Error:", error);
      // alert("Ошибка при покупке");
    });
}

// Функция для обновления карточки после покупки
function updateCardAfterPurchase(cardElement, luxuryItem) {
  // Находим карточку в DOM
  const card =
    cardElement ||
    document.querySelector(`.card[data-lux-id="${luxuryItem._id}"]`);

  if (card) {
    // Добавляем класс owned
    card.classList.add("owned");

    // Находим контейнер с ценой
    const priceContainer = card.querySelector(".price-container");
    if (priceContainer) {
      // Очищаем контейнер
      priceContainer.innerHTML = "";

      // Добавляем иконку owned
      const ownedIcon = document.createElement("img");
      ownedIcon.className = "owned-icon";
      ownedIcon.src = "images/dialog/owned_sm.png";
      ownedIcon.alt = "owned";
      priceContainer.appendChild(ownedIcon);
    }

    // Удаляем обработчик клика для покупки (или меняем его)
    // Так как карточка теперь owned, при клике не должно происходить покупки

    // Клонируем карточку, чтобы удалить все обработчики
    const newCard = card.cloneNode(true);
    card.parentNode.replaceChild(newCard, card);

    // Регистрируем новый обработчик (теперь не для покупки)
    registerCardClick(newCard, () => {
      // Для купленных обоев в магазине ничего не делаем при клике
      // console.log("Предмет уже куплен");
    });
  }
}

// Альтернативный вариант - обновить все карточки в магазине
// function refreshWallpaperShop() {
//   if (currentCategory === "wallpaper" && currentDisplayMode === "purchase") {
//     createWallpaperPurchaseCards();
//   }
// }

function handlePurchaseProduct(cardElement, productItem) {
  // console.log("Покупка продукта:", productItem);

  const data = {
    pet_id: 1,
    product_id: productItem._id,
    price: productItem._price,
    action: "buy",
  };

  fetch("scripts/update/buy_product.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        if (
          currentCategory === "product" &&
          currentDisplayMode === "purchase"
        ) {
          createProductPurchaseCards();
        }
      } else {
        // alert("Недостаточно средств");
      }
    });
}

function handlePurchasePotion(cardElement, potionItem) {
  // console.log("Покупка зелья:", potionItem);

  const data = {
    pet_id: 1,
    potion_id: potionItem._id,
    price: potionItem._price,
    action: "buy",
  };

  fetch("scripts/update/buy_potion.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        if (currentCategory === "potion" && currentDisplayMode === "purchase") {
          createPotionPurchaseCards();
        }
      } else {
        // alert("Недостаточно средств");
      }
    });
}

// Функция для создания карточек первой кнопки (выбор已有)
function createFirstButtonCards(room) {
  menuGrid.innerHTML = "";
  currentDisplayMode = "category";

  const wallpaperCard = createCard(
    `<div class="card category"><img src="images/icons/shops/wallpapers.png"></div>`,
    () => createWallpaperSelectCards(),
  );
  menuGrid.appendChild(wallpaperCard);

  switch (room._tech_title) {
    case "kitchenBg":
      const foodCard = createCard(
        `<div class="card category"><img src="images/icons/shops/food.png"></div>`,
        () => createProductSelectCards(),
      );
      menuGrid.appendChild(foodCard);
      break;

    case "laboratoryBg":
      const potionCard = createCard(
        `<div class="card category"><img src="images/icons/shops/potions.png"></div>`,
        () => createPotionSelectCards(),
      );
      menuGrid.appendChild(potionCard);
      break;

    case "playroomBg":
      const gamesCard = createCard(
        `<div class="card category"><img src="images/icons/shops/games.png"></div>`,
        () => createGamesCards(),
      );
      menuGrid.appendChild(gamesCard);
      break;
  }
}

// Функция для создания карточек второй кнопки (покупка в магазине)
function createSecondButtonCards(room) {
  menuGrid.innerHTML = "";
  currentDisplayMode = "category";

  if (room._tech_title === "bedroomBg") {
    return;
  }

  const wallpaperCard = createCard(
    `<div class="card category"><img src="images/icons/shops/wallpapers.png"></div>`,
    () => createWallpaperPurchaseCards(),
  );
  menuGrid.appendChild(wallpaperCard);

  switch (room._tech_title) {
    case "kitchenBg":
      const foodCard = createCard(
        `<div class="card category"><img src="images/icons/shops/food.png"></div>`,
        () => createProductPurchaseCards(),
      );
      menuGrid.appendChild(foodCard);
      break;

    case "laboratoryBg":
      const potionCard = createCard(
        `<div class="card category"><img src="images/icons/shops/potions.png"></div>`,
        () => createPotionPurchaseCards(),
      );
      menuGrid.appendChild(potionCard);
      break;
  }
}

// Функция для обработки кликов вне меню
function handleOutsideClick(event) {
  if (
    (main.contains(event.target) ||
      footer.contains(event.target) ||
      header.contains(event.target)) &&
    !secondButton.contains(event.target) &&
    !firstButton.contains(event.target) &&
    !menu.contains(event.target)
  ) {
    clearAndHideMenu();
  }
}

export function changeRoom(room) {
  currentRoom = room;

  document.body.style.backgroundImage = `url(${room._backgroundSrc})`;
  firstButton.querySelector("img").src = room._firstButtonSrc;
  firstButton.querySelector("img").alt = room._firstButtonAlt;
  titleRoom.innerHTML = room._title;
  secondButton.querySelector("img").src = room._secondButtonSrc;
  secondButton.querySelector("img").alt = room._secondButtonAlt;

  document.removeEventListener("click", handleOutsideClick);
  document.addEventListener("click", handleOutsideClick);

  firstButton.onclick = () => {
    showMenu();
    createFirstButtonCards(room);
  };

  secondButton.onclick = () => {
    if (room._tech_title === "bedroomBg") {
      return;
    }
    showMenu();
    createSecondButtonCards(room);
  };
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
  "bathroomBg",
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

// CSS стили
const style = document.createElement("style");
style.textContent = `
  .card {
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    border: 2px solid transparent;
    border-radius: 8px;
    padding: 10px;
    margin: 5px;
  }
  
  .card.owned {
    opacity: 0.9;
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  .card.selected {
    border-color: gold;
    background-color: rgba(255, 215, 0, 0.1);
  }
  
  .price-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
    min-height: 24px;
  }
  
  .coin-icon {
    width: 16px;
    height: 16px;
    margin-right: 4px;
    vertical-align: middle;
  }
  
  .price {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    color: #333;
  }
  
  .quantity {
    background-color: #4CAF50;
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: bold;
  }
  
  .owned-icon {
    width: 20px;
    height: 20px;
    display: inline-block;
  }
  
  .category {
    text-align: center;
    padding: 15px;
  }
  
  .category img {
    max-width: 100%;
    height: auto;
    max-height: 80px;
  }
  
  .game-card {
    text-decoration: none;
    color: inherit;
    display: block;
  }
  
  .game-icon {
    width: 64px;
    height: 64px;
  }
  
  .shop-item {
    max-width: 100%;
    height: auto;
    max-height: 100px;
  }
`;
document.head.appendChild(style);
