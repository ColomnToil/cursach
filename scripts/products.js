class Product {
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

export let products = {};

export const productResponse = await fetch("scripts/get/products.php")
  .then((response) => response.json())
  .then((json) => {
    json.forEach((e) => {
      products[e["id"]] = new Product(
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

let countProduct = 0;
export let avaliableProducts = false;

// export async function getAvaliableProducts() {
export const productFetch = fetch("scripts/get/mineProducts.php?pet_id=1")
  .then((response) => response.json())
  .then((json) => {
    // console.log(json)
    json.length ? (avaliableProducts = {}) : false;
    json.forEach((e) => {
      avaliableProducts[countProduct] = new Product(
        products[e["product_id"]]["_id"],
        products[e["product_id"]]["_title"],
        products[e["product_id"]]["_imgSrc"],
        products[e["product_id"]]["_hunger"],
        products[e["product_id"]]["_health"],
        products[e["product_id"]]["_price"],
        products[e["product_id"]]["_sleep"],
        products[e["product_id"]]["_funny"],
        e["count"],
      );
      countProduct++;
    });
  });
// console.log(avaliableProducts)
// .finally((e) => {
// createFood(main.offsetWidth / 2, main.offsetHeight / 1.1, false);
// productGeted = true;
// });

// console.log(products);
