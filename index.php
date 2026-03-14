<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
  <!-- <script src="https://telegram.org/js/telegram-web-app.js"></script> -->
  <link rel="stylesheet" href="style/style.css">
</head>

<body>
  <header>
    <section class="buttons everywhere">
      <button class="button first"><img src="images/coin/coin_big.png" alt="Деньги"><span id="money"></span></button>
      <div class="middle">
        <button class="left" type="button"><img src="images/icons/prev.png" alt=""></button>
        <span class="title"></span>
        <button class="right" type="button"><img src="images/icons/next.png" alt=""></button>
      </div>
      <button class="button second">
        <!-- <img src="images/icons/settings.png" alt="Настройки"> -->
      </button>
    </section>
  </header>
  <section class="shop">
    <div class="grid"></div>
  </section>
  <main>
  </main>
  <footer>
    <section class="buttons in-room">
      <button class="button first"><img src="" alt=""></button>
      <div class="middle-down">
        <button class="left-prod" type="button"><img src="images/icons/prev_naked.png" alt=""></button>
        <span class="product-lot"></span>
        <button class="right-prod" type="button"><img src="images/icons/next_naked.png" alt=""></button>
      </div>
      <button class="button second">
        <img src="" alt="">
      </button>
      <!-- <button class="button third"><img src="" alt=""></button> -->
    </section>
  </footer>
  <script src="matter-js-0.20.0/build/matter.js" type="text/javascript"></script>

  <!-- <script type="module" src="scripts/tg.js"></script> -->

  <script type="module" src="scripts/rooms.js"></script>
  <script type="module" src="scripts/products.js"></script>
  <script type="module" src="scripts/luxaries.js"></script>
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