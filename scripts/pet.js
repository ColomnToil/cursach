import { luxaries } from "./luxaries.js";
import { pouMood, pou, render, Render } from "./matter.js";
import { bedroom, changeRoom, kitchen, laboratory, playroom } from "./rooms.js";
// import { avaliableProducts } from "./products.js";

class Pet {
  constructor(
    hunger,
    funny,
    health,
    sleep,
    money,
    kitchenBg,
    bedroomBg,
    playroomBg,
    laboratoryBg,
  ) {
    this._hunger = hunger;
    this._funny = funny;
    this._health = health;
    this._sleep = sleep;
    this._money = money;
    this._kitchenBg = kitchenBg;
    this._bedroomBg = bedroomBg;
    this._playroomBg = playroomBg;
    this._laboratoryBg = laboratoryBg;
  }

  async use(product, categor) {
    this._hunger = Number(this._hunger) + Number(product._hunger);
    this._hunger > 100 ? (this._hunger = 100) : false;
    Number(this._hunger) < 0 ? (this._hunger = 0) : false;

    this._funny = Number(this._funny) + Number(product._funny);
    this._funny > 100 ? (this._funny = 100) : false;
    Number(this._funny) < 0 ? (this._funny = 0) : false;

    this._health = Number(this._health) + Number(product._health);
    this._health > 100 ? (this._health = 100) : false;
    Number(this._health) < 0 ? (this._health = 0) : false;

    this._sleep = Number(this._sleep) + Number(product._sleep);
    this._sleep > 100 ? (this._sleep = 100) : false;
    Number(this._sleep) < 0 ? (this._sleep = 0) : false;

    let data = {
      hunger: this._hunger,
      funny: this._funny,
      health: this._health,
      sleep: this._sleep,
      pet_id: 1,
    };
    fetch("scripts/update/petStats.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    // .then((e) => e.json())
    // .then((json) => {
    //   console.log(json);
    // });
    // console.log(product);
    if (categor === "product") {
      fetch("scripts/update/product_pet.php?pet_id=1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
    } else if (categor === "potion") {
      console.log(product["_health"]);
      fetch("scripts/update/potion_pet.php?pet_id=1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      // .then((e) => {
      //   e.json();
      // })
      // .then((par) => {
      //   console.log(par);
      // });
    }

    // console.log(avaliableProducts);
    // for (const key in avaliableProducts) {
    //   // if (Object.prototype.hasOwnProperty.call(object, key)) {
    //   const element = avaliableProducts[key];
    //   if (element["_id"] == product["_id"]) {
    //     if (product["_count"] - 1 > 0) {
    //       avaliableProducts[key]["_count"] =
    //         Number(avaliableProducts[key]["_count"]) - 1;
    //     } else {
    //       delete avaliableProducts[key];
    //     }
    //   }
    //   // }
    // }

    // .then((e) => e.json())
    // .then((json) => {
    //   console.log(json);
    // });
  }

  moneyUpdate(add) {
    this._money = Number(this._money) + add;

    fetch(`scripts/update/money.php?money=${this._money}`);

    document.querySelector("#money").innerText = this._money;
  }
}

export let petStats = await fetch(`scripts/get/petStats.php?user_id=3`, {
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((json) => {
    // console.log(json);
    if (json.length == 0) {
      json = fetch(`scripts/create/newPet.php?user_id=3`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((json) => {
          // console.log(json)
          return json;
        });
    }
    return json[0];
  });

export let pet = new Pet(
  petStats.hunger,
  petStats.funny,
  petStats.health,
  petStats.sleep,
  petStats.money,
  petStats.kitchenBg,
  petStats.bedroomBg,
  petStats.playroomBg,
  petStats.laboratoryBg,
);
// console.log(petStats);
bedroom._backgroundSrc = "images/" + luxaries[pet._bedroomBg]["_imgSrc"];
kitchen._backgroundSrc = "images/" + luxaries[pet._kitchenBg]["_imgSrc"];
laboratory._backgroundSrc = "images/" + luxaries[pet._laboratoryBg]["_imgSrc"];
playroom._backgroundSrc = "images/" + luxaries[pet._playroomBg]["_imgSrc"];

pet.moneyUpdate(0);

pouMood();
changeRoom(bedroom);

Render.run(render);

// console.log(pet);
