export const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();
console.log(tg.initDataUnsafe);
