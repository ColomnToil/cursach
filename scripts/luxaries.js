class Luxary {
  constructor(id, title, imgSrc, price, shop_id, category_id) {
    this._id = id;
    this._title = title;
    this._imgSrc = imgSrc;
    this._price = price;
    this._shop_id = shop_id;
    this._category_id = category_id;
  }
}

export let luxaries = {};
export const luxaryResponse = await fetch("scripts/get/luxaries.php")
  .then((response) => response.json())
  .then((json) => {
    json.forEach((e) => {
      luxaries[e["id"]] = new Luxary(
        e["id"],
        e["title"],
        e["imgSrc"],
        e["price"],
        e["shop_id"],
        e["category_id"],
      );
    });
  });

// export const mineLuxaryResponse = await fetch(
//   "scripts/get/mineLuxaries.php?pet_id=1",
// )
//   .then((response) => response.json())
//   .then((json) => {
//     json.forEach((e) => {
//       mineLuxaries[e["luxary_id"]] = e["created_at"];
//     });
//   });

export let avaliableLuxaries = {};

function getAvaliableLuxaries() {
  let countProduct = 1;
  const mineProductResponse = fetch("scripts/get/mineLuxaries.php?pet_id=1")
    .then((response) => response.json())
    .then((json) => {
      //   console.log(json);
      json.forEach((e) => {
        // console.log(luxaries[e["luxary_id"]]);
        avaliableLuxaries[countProduct] = new Luxary(
          luxaries[e["luxary_id"]]["_id"],
          luxaries[e["luxary_id"]]["_title"],
          luxaries[e["luxary_id"]]["_imgSrc"],
          luxaries[e["luxary_id"]]["_price"],
          luxaries[e["luxary_id"]]["_shop_id"],
          luxaries[e["luxary_id"]]["_category_id"],
        );
        countProduct++;
      });
    });
}

getAvaliableLuxaries();
// console.log(avaliableLuxaries);
// console.log(mineLuxaries);
