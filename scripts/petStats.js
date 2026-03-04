class Pet {
  constructor(hunger, funny, health, happy) {
    this._hunger = hunger;
    this._funny = funny;
    this._health = health;
    this._happy = happy;
  }
}

fetch(`scripts/getPetStats.php`
//   headers: {
//     "Content-Type": "application/json",
//   },
)
//   .then((response) => response.json())
  .then((promise)=>promise)
//   .then((promise)=>)
  .then((json) => {
    console.log(json);
  });
