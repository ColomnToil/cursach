<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
  <link rel="stylesheet" href="style/style.css">
</head>

<body>
  <header>
    <section class="buttons everywhere">
      <button class="button first"><img src="" alt="Магазин"></button>
      <button class="button second"><img src="" alt="Настройки"></button>
    </section>
  </header>
  <main>
  </main>
  <footer>
    <section class="buttons in-room">
      <button class="button first"><img src="" alt=""></button>
      <div class="button second">
        <button class="left" type="button">←</button>
        <img src="" alt="">
        <button class="right" type="button">→</button>
      </div>
      <button class="button third"><img src="" alt=""></button>
    </section>
  </footer>
  <script src="matter-js-0.20.0/build/matter.js" type="text/javascript"></script>

  <script type="module" src="scripts/rooms.js"></script>
  <script type="module" src="scripts/products.js"></script>
  <script type="module" src="scripts/potions.js"></script>
  <script type="module" src="scripts/pet.js"></script>
  <script type="module" src="scripts/matter.js"></script>
  <script type="module" src="scripts/speed-limit.js"></script>
  <script>// Управляем ограничителем
    // console.log(window.SpeedLimiter.setGlobalMaxSpeed)
    ; // Устанавливаем глобальную скорость

    // Устанавливаем индивидуальный лимит для мяча
    // window.SpeedLimiter.setBodySpeedLimit(ball, 30); // Мяч может лететь быстрее

    // Получаем статистику
    // console.log(window.SpeedLimiter.getStats());

    // Включаем визуализацию
    // setInterval(() => {
    //   window.SpeedLimiter.visualizeSpeeds();
    // }, 100);
  </script>
</body>

</html>