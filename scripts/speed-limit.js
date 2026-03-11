import { engine } from "./matter.js";
(function () {
  // Сохраняем ссылку на оригинальный Matter
  if (typeof Matter === "undefined") {
    console.error(
      "Matter.js не найден! Подключите библиотеку перед этим скриптом.",
    );
    return;
  }

  const OriginalMatter = Matter;

  // Конфигурация ограничителя
  const SpeedLimiterConfig = {
    maxSpeed: 15, // Максимальная скорость по умолчанию
    checkInterval: 16, // Интервал проверки (мс)
    enabled: true, // Включен ли ограничитель
    logViolations: false, // Логировать превышения скорости
    globalDamping: 0.98, // Глобальное демпфирование
    excludeSleeping: true, // Исключать спящие тела
    perBodyLimits: new WeakMap(), // Индивидуальные лимиты для тел
  };

  // Функция для поиска всех движков Matter на странице
  function findAllEngines() {
    const engines = engine;
    return engines;
    // Ищем в глобальном объекте Matter
    // if (OriginalMatter.Engine && OriginalMatter.Engine._engines) {
    //   engines.push(...Object.values(OriginalMatter.Engine._engines));
    // }

    // // Ищем в глобальной области видимости
    // for (let key in window) {
    //   try {
    //     if (
    //       window[key] &&
    //       window[key].world &&
    //       window[key].bodies &&
    //       typeof window[key].update === "function"
    //     ) {
    //       engines.push(window[key]);
    //     }
    //   } catch (e) {}
    // }

    // // Ищем по классам и ID
    // document
    //   .querySelectorAll("[data-matter-engine], .matter-engine")
    //   .forEach((el) => {
    //     if (el.matterEngine) {
    //       engines.push(el.matterEngine);
    //     }
    //   });

    // return [...new Set(engines)]; // Убираем дубликаты
  }

  // Функция для получения всех тел из всех движков
  function getAllBodies() {
    const bodies = [];
    const engine = findAllEngines();

    // engines.forEach((engine) => {
    if (engine && engine.world && engine.world.bodies) {
      bodies.push(...engine.world.bodies);
    }
    // });

    return bodies;
  }

  // Функция ограничения скорости для одного тела
  function limitBodySpeed(body) {
    if (
      !body ||
      body.isStatic ||
      (body.isSleeping && SpeedLimiterConfig.excludeSleeping)
    ) {
      return;
    }

    // Проверяем индивидуальный лимит
    let maxSpeed =
      SpeedLimiterConfig.perBodyLimits.get(body) || SpeedLimiterConfig.maxSpeed;

    const velocity = body.velocity;
    const currentSpeed = Math.sqrt(
      velocity.x * velocity.x + velocity.y * velocity.y,
    );

    if (currentSpeed > maxSpeed) {
      // Логируем если нужно
      if (SpeedLimiterConfig.logViolations) {
        console.log(
          `Скорость превышена: ${currentSpeed.toFixed(2)} > ${maxSpeed}`,
          body.label || "безымянное тело",
        );
      }

      // Плавное замедление
      const speedFactor = maxSpeed / currentSpeed;

      if (OriginalMatter.Body && OriginalMatter.Body.setVelocity) {
        OriginalMatter.Body.setVelocity(body, {
          x: velocity.x * speedFactor,
          y: velocity.y * speedFactor,
        });
      } else if (body.setVelocity) {
        body.setVelocity({
          x: velocity.x * speedFactor,
          y: velocity.y * speedFactor,
        });
      }

      // Ограничиваем угловую скорость
      if (Math.abs(body.angularVelocity) > 0.2) {
        if (OriginalMatter.Body && OriginalMatter.Body.setAngularVelocity) {
          OriginalMatter.Body.setAngularVelocity(
            body,
            body.angularVelocity * 0.95,
          );
        } else if (body.setAngularVelocity) {
          body.setAngularVelocity(body.angularVelocity * 0.95);
        }
      }
    } else {
      // Применяем демпфирование если скорость ниже лимита
      if (SpeedLimiterConfig.globalDamping < 1 && currentSpeed > 1) {
        if (OriginalMatter.Body && OriginalMatter.Body.setVelocity) {
          OriginalMatter.Body.setVelocity(body, {
            x: velocity.x * SpeedLimiterConfig.globalDamping,
            y: velocity.y * SpeedLimiterConfig.globalDamping,
          });
        }
      }
    }
  }

  // Функция для применения ограничителя ко всем телам
  function limitAllBodies() {
    if (!SpeedLimiterConfig.enabled) return;

    const bodies = getAllBodies();
    bodies.forEach((body) => limitBodySpeed(body));
  }

  // Создаем глобальный объект управления
  window.SpeedLimiter = {
    // Конфигурация
    config: SpeedLimiterConfig,

    // Установка максимальной скорости для всех
    setGlobalMaxSpeed: function (speed) {
      SpeedLimiterConfig.maxSpeed = speed;
      // console.log(`Глобальная максимальная скорость установлена на ${speed}`);
    },

    // Установка индивидуальной скорости для конкретного тела
    setBodySpeedLimit: function (body, speed) {
      if (body) {
        SpeedLimiterConfig.perBodyLimits.set(body, speed);
        // Добавляем метку для отладки
        body.speedLimit = speed;
      }
    },

    // Сброс индивидуального лимита для тела
    resetBodySpeedLimit: function (body) {
      if (body) {
        SpeedLimiterConfig.perBodyLimits.delete(body);
        delete body.speedLimit;
      }
    },

    // Включение/выключение
    enable: function () {
      SpeedLimiterConfig.enabled = true;
      console.log("Ограничитель скорости включен");
    },

    disable: function () {
      SpeedLimiterConfig.enabled = false;
      console.log("Ограничитель скорости отключен");
    },

    // Получение текущей скорости тела
    getBodySpeed: function (body) {
      if (!body || !body.velocity) return 0;
      return Math.sqrt(
        body.velocity.x * body.velocity.x + body.velocity.y * body.velocity.y,
      );
    },

    // Получение статистики
    getStats: function () {
      const bodies = getAllBodies();
      const speeds = bodies
        .map((b) => this.getBodySpeed(b))
        .filter((s) => s > 0);

      return {
        totalBodies: bodies.length,
        movingBodies: speeds.length,
        averageSpeed: speeds.length
          ? speeds.reduce((a, b) => a + b, 0) / speeds.length
          : 0,
        maxSpeed: speeds.length ? Math.max(...speeds) : 0,
        bodiesOverLimit: speeds.filter((s) => s > SpeedLimiterConfig.maxSpeed)
          .length,
      };
    },

    // Принудительное применение ограничителя
    applyNow: function () {
      limitAllBodies();
    },

    // Визуализация скоростей (опционально)
    visualizeSpeeds: function () {
      const bodies = getAllBodies();
      bodies.forEach((body) => {
        if (body.render) {
          const speed = this.getBodySpeed(body);
          if (speed > SpeedLimiterConfig.maxSpeed) {
            body.render.fillStyle = "#FF4444"; // Красный
          } else if (speed > SpeedLimiterConfig.maxSpeed * 0.8) {
            body.render.fillStyle = "#FFAA44"; // Оранжевый
          } else {
            body.render.fillStyle = "#44FF44"; // Зеленый
          }
        }
      });
    },
  };

  // Автоматический запуск
  function initSpeedLimiter() {
    // console.log("Универсальный ограничитель скорости Matter.js активирован");

    // Запускаем интервал проверки
    const intervalId = setInterval(() => {
      if (SpeedLimiterConfig.enabled) {
        limitAllBodies();
      }
    }, SpeedLimiterConfig.checkInterval);

    // Сохраняем ID интервала для возможности остановки
    SpeedLimiter.stop = function () {
      clearInterval(intervalId);
    };

    // Перехватываем создание новых движков
    const originalEngineCreate = OriginalMatter.Engine?.create;
    if (originalEngineCreate) {
      OriginalMatter.Engine.create = function (...args) {
        const engine = originalEngineCreate.apply(this, args);

        // Добавляем событие для проверки после каждого обновления
        if (OriginalMatter.Events) {
          OriginalMatter.Events.on(engine, "afterUpdate", () => {
            limitAllBodies();
          });
        }

        return engine;
      };
    }
  }

  // Запускаем после загрузки страницы
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSpeedLimiter);
  } else {
    initSpeedLimiter();
  }

  // Добавляем горячие клавиши для отладки (Ctrl+Shift+S)
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === "S") {
      e.preventDefault();
      const stats = window.SpeedLimiter.getStats();
      console.table(stats);
    }
  });
})();

window.SpeedLimiter.setGlobalMaxSpeed(50);
