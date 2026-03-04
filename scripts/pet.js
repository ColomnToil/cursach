class Pet {
  constructor(hunger, funny, health, happy) {
    this._hunger = hunger;
    this._funny = funny;
    this._health = health;
    this._happy = happy;
  }

  use(product) {
    this._hunger += product._hunger;
    this._hunger > 100 ? (this._hunger = 100) : false;

    this._funny += product._funny;
    this._funny > 100 ? (this._funny = 100) : false;

    this._health += product._health;
    this._health > 100 ? (this._health = 100) : false;

    this._happy += product._happy;
    this._happy > 100 ? (this._happy = 100) : false;

    data = {
      hunger: this._hunger,
      funny: this._funny,
      health: this._health,
      happy: this._happy,
      user_id: 3,
    };
    fetch("scripts/updatePetStats.php", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
}

let petStats = await fetch(`scripts/getPetStats.php?user_id=3`, {
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((json) => {
    if (json.length == 0) {
      json = fetch(`scripts/createNewPet.php?user_id=3`, {
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

const pet = new Pet(
  petStats.hunger,
  petStats.funny,
  petStats.health,
  petStats.happy,
);

console.log(pet);
