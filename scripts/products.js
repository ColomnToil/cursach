class Product {
  constructor(title, imgSrc, hunger, health, price, purpose_id) {
    this._title = title;
    this._imgSrc = imgSrc;
    this._hunger = hunger;
    this._health = health;
    this._price = price;
    this._purpose_id = purpose_id;
  }
}

let products = {};

await fetch("scripts/getProducts.php")
  .then((response) => response.json())
  .then((json) => {
    json.forEach((e) => {
      //   products;
      products[e["id"]] = new Product(
        e["title"],
        e["imgSrc"],
        e["hunger"],
        e["health"],
        e["price"],
        e["purpose_id"],
      );
    });
  });

console.log(products);
