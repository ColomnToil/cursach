const footerButtons = document
  .querySelector("footer")
  .querySelector(".buttons");
const firstButton = footerButtons.querySelector(".first");
const secondButton = footerButtons.querySelector(".second");
const thirdButton = footerButtons.querySelector(".third");

const buttonChangeRoomLeft = secondButton.querySelector(".left");
const buttonChangeRoomRight = secondButton.querySelector(".right");

function changeRoom(room) {
  document.body.style.backgroundImage = `url(${room._backgroundSrc})`;
  firstButton.querySelector("img").src = room._firstButtonSrc;
  firstButton.querySelector("img").alt = room._firstButtonAlt;

  secondButton.querySelector("img").src = room._secondButtonSrc;
  secondButton.querySelector("img").alt = room._secondButtonAlt;

  thirdButton.querySelector("img").src = room._thirdButtonSrc;
  thirdButton.querySelector("img").alt = room._thirdButtonAlt;
}

class Room {
  constructor(
    // title,
    backgroundSrc,
    firstButtonSrc,
    firstButtonAlt,
    secondButtonSrc,
    secondButtonAlt,
    thirdButtonSrc,
    thirdButtonAlt,
  ) {
    // this._title = title;
    this._backgroundSrc = backgroundSrc;
    this._firstButtonSrc = firstButtonSrc;
    this._firstButtonAlt = firstButtonAlt;
    this._secondButtonSrc = secondButtonSrc;
    this._secondButtonAlt = secondButtonAlt;
    this._thirdButtonSrc = thirdButtonSrc;
    this._thirdButtonAlt = thirdButtonAlt;
  }
}

const bedroom = new Room(
  `imgs/`,
  `imgs/`,
  "Шкаф",
  `imgs/`,
  "Ночник",
  `imgs/`,
  "Магазин",
);
const kitchen = new Room(
  `imgs/`,
  `imgs/`,
  "Холодильник",
  `imgs/`,
  "",
  `imgs/`,
  "Магазин",
);
const bathroom = new Room(
  `imgs/`,
  `imgs/`,
  "Душ",
  `imgs/`,
  "Мыло",
  "",
  "Магазин",
);
const laboratory = new Room(
  `imgs/`,
  `imgs/`,
  "Аптечка",
  `imgs/`,
  "",
  `imgs/`,
  "Аптека",
);
const playroom = new Room(
  `imgs/`,
  `imgs/`,
  "Комод",
  `imgs/`,
  "Мячик",
  `imgs/`,
  "Игры",
);

const rooms = [bedroom, kitchen, bathroom, laboratory, playroom];
let roomIndex = 0;

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

changeRoom(rooms[roomIndex]);
