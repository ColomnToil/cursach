-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Мар 10 2026 г., 19:32
-- Версия сервера: 8.0.30
-- Версия PHP: 8.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `pou`
--

-- --------------------------------------------------------

--
-- Структура таблицы `pets`
--

CREATE TABLE `pets` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `hunger` tinyint NOT NULL DEFAULT '50',
  `funny` tinyint NOT NULL DEFAULT '25',
  `health` tinyint NOT NULL DEFAULT '75',
  `sleep` tinyint NOT NULL DEFAULT '100',
  `money` bigint NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `pets`
--

INSERT INTO `pets` (`id`, `user_id`, `hunger`, `funny`, `health`, `sleep`, `money`) VALUES
(1, 3, 50, 25, 75, 100, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `potions`
--

CREATE TABLE `potions` (
  `id` int NOT NULL,
  `title` varchar(80) NOT NULL,
  `hunger` tinyint NOT NULL,
  `health` tinyint NOT NULL,
  `funny` tinyint NOT NULL,
  `sleep` tinyint NOT NULL,
  `price` int NOT NULL,
  `imgSrc` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `potions`
--

INSERT INTO `potions` (`id`, `title`, `hunger`, `health`, `funny`, `sleep`, `price`, `imgSrc`) VALUES
(1, 'Лечебная микстура', 0, 25, -10, -3, 125, 'potions/1.png'),
(2, 'Энергетик', 5, -20, 10, 40, 89, 'potions/4.png'),
(3, 'Блювин', -50, -10, -10, 0, 75, 'food/5.png');

-- --------------------------------------------------------

--
-- Структура таблицы `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `title` varchar(80) NOT NULL,
  `hunger` tinyint NOT NULL,
  `health` tinyint NOT NULL,
  `funny` tinyint NOT NULL,
  `sleep` tinyint NOT NULL,
  `price` int NOT NULL,
  `imgSrc` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `products`
--

INSERT INTO `products` (`id`, `title`, `hunger`, `health`, `funny`, `sleep`, `price`, `imgSrc`) VALUES
(1, 'Яблоко', 15, 2, 0, 0, 25, 'food/apple.png'),
(2, 'Яишница', 30, 1, 0, 0, 45, 'food/egg.png'),
(3, 'Молоко', 15, 2, 1, -2, 25, 'food/milk.png');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `pets`
--
ALTER TABLE `pets`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `potions`
--
ALTER TABLE `potions`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `pets`
--
ALTER TABLE `pets`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT для таблицы `potions`
--
ALTER TABLE `potions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
