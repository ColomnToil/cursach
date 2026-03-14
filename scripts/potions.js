class Potion {
  constructor(id, title, imgSrc, hunger, health, price, sleep, funny, count) {
    this._id = id;
    this._title = title;
    this._imgSrc = imgSrc;
    this._hunger = hunger;
    this._health = health;
    this._funny = funny;
    this._price = price;
    this._sleep = sleep;
    this._count = count;
  }
}

export let potions = {};

await fetch("scripts/get/potions.php")
  .then((response) => response.json())
  .then((json) => {
    json.forEach((e) => {
      potions[e["id"]] = new Potion(
        e["id"],
        e["title"],
        e["imgSrc"],
        e["hunger"],
        e["health"],
        e["price"],
        e["sleep"],
        e["funny"],
        1,
      );
    });
  });

export let avaliablePotions = false;
let countProduct = 0;
// function getAvaliablePotions() {

export const potionFetch = fetch("scripts/get/minePotions.php?pet_id=1")
  .then((response) => response.json())
  .then((json) => {
    json.length ? (avaliablePotions = {}) : false;
    json.forEach((e) => {
      avaliablePotions[countProduct] = new Potion(
        potions[e["potion_id"]]["_id"],
        potions[e["potion_id"]]["_title"],
        potions[e["potion_id"]]["_imgSrc"],
        potions[e["potion_id"]]["_hunger"],
        potions[e["potion_id"]]["_health"],
        potions[e["potion_id"]]["_price"],
        potions[e["potion_id"]]["_sleep"],
        potions[e["potion_id"]]["_funny"],
        e["count"],
      );
      countProduct++;
    });
  });
// }

// console.log(minePotions);
