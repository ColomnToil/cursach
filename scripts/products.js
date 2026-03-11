class Product {
  constructor(title, imgSrc, hunger, health, price, sleep, funny) {
    this._title = title;
    this._imgSrc = imgSrc;
    this._hunger = hunger;
    this._health = health;
    this._funny = funny;
    this._price = price;
    this._sleep = sleep;
  }
}

let products = {};

await fetch("scripts/get/products.php")
  .then((response) => response.json())
  .then((json) => {
    json.forEach((e) => {
      products[e["id"]] = new Product(
        e["title"],
        e["imgSrc"],
        e["hunger"],
        e["health"],
        e["price"],
        e["sleep"],
        e["funny"],
      );
    });
  });

// console.log(products);
