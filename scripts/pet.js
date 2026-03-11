import { pouSad } from "./matter.js";

class Pet {
  constructor(hunger, funny, health, sleep) {
    this._hunger = hunger;
    this._funny = funny;
    this._health = health;
    this._sleep = sleep;
  }

  use(product) {
    this._hunger += product._hunger;
    this._hunger > 100 ? (this._hunger = 100) : false;

    this._funny += product._funny;
    this._funny > 100 ? (this._funny = 100) : false;

    this._health += product._health;
    this._health > 100 ? (this._health = 100) : false;

    this._sleep += product._sleep;
    this._sleep > 100 ? (this._sleep = 100) : false;

    data = {
      hunger: this._hunger,
      funny: this._funny,
      health: this._health,
      sleep: this._sleep,
      user_id: 3,
    };
    fetch("scripts/update/petStats.php", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
}

let petStats = await fetch(`scripts/get/petStats.php?user_id=3`, {
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((json) => {
    if (json.length == 0) {
      json = fetch(`scripts/create/newPet.php?user_id=3`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((json) => {
          return json;
        });
    }
    return json[0];
  });

export const pet = new Pet(
  petStats.hunger,
  petStats.funny,
  petStats.health,
  petStats.sleep,
);

pouSad();

console.log(pet);
