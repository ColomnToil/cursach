-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Мар 14 2026 г., 07:41
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
-- Структура таблицы `luxaries`
--

CREATE TABLE `luxaries` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `imgSrc` varchar(255) NOT NULL,
  `price` int NOT NULL,
  `shop_id` int NOT NULL,
  `category_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `luxaries`
--

INSERT INTO `luxaries` (`id`, `title`, `imgSrc`, `price`, `shop_id`, `category_id`) VALUES
(1, 'Обои 111', 'wallpapers/111.png', 300, 0, 0),
(2, 'Обои 112', 'wallpapers/112.png', 300, 0, 0),
(3, 'Обои 113', 'wallpapers/113.png', 300, 0, 0),
(4, 'Обои 114', 'wallpapers/114.png', 300, 0, 0),
(5, 'Обои 121', 'wallpapers/121.png', 315, 0, 0),
(6, 'Обои 122', 'wallpapers/122.png', 315, 0, 0),
(7, 'Обои 123', 'wallpapers/123.png', 315, 0, 0),
(8, 'Обои 124', 'wallpapers/124.png', 315, 0, 0),
(9, 'Обои 131', 'wallpapers/131.png', 340, 0, 0),
(10, 'Обои 132', 'wallpapers/132.png', 340, 0, 0),
(11, 'Обои 133', 'wallpapers/133.png', 340, 0, 0),
(12, 'Обои 134', 'wallpapers/134.png', 340, 0, 0),
(13, 'Обои 211', 'wallpapers/211.png', 400, 0, 0),
(14, 'Обои 221', 'wallpapers/221.png', 400, 0, 0),
(15, 'Обои 222', 'wallpapers/222.png', 400, 0, 0),
(16, 'Обои 223', 'wallpapers/223.png', 400, 0, 0),
(17, 'Обои 241', 'wallpapers/241.png', 450, 0, 0),
(18, 'Обои 242', 'wallpapers/242.png', 450, 0, 0),
(19, 'Обои 243', 'wallpapers/243.png', 450, 0, 0),
(20, 'Обои 251', 'wallpapers/251.png', 480, 0, 0),
(21, 'Обои 252', 'wallpapers/252.png', 450, 0, 0),
(22, 'Обои 253', 'wallpapers/253.png', 450, 0, 0),
(23, 'Обои 281', 'wallpapers/281.png', 530, 0, 0),
(24, 'Обои 282', 'wallpapers/282.png', 530, 0, 0),
(25, 'Обои 311', 'wallpapers/311.png', 550, 0, 0),
(26, 'Обои 312', 'wallpapers/312.png', 550, 0, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `luxaries_pets`
--

CREATE TABLE `luxaries_pets` (
  `luxary_id` int NOT NULL,
  `pet_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `luxaries_pets`
--

INSERT INTO `luxaries_pets` (`luxary_id`, `pet_id`, `created_at`) VALUES
(1, 1, '2026-03-13 09:02:26'),
(16, 1, '2026-03-13 09:02:26'),
(3, 1, '2026-03-14 03:04:10'),
(2, 1, '2026-03-14 03:04:38'),
(4, 1, '2026-03-14 03:04:57'),
(6, 1, '2026-03-14 03:05:06'),
(7, 1, '2026-03-14 03:08:18'),
(8, 1, '2026-03-14 03:11:13'),
(5, 1, '2026-03-14 03:11:16');

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
  `money` bigint NOT NULL DEFAULT '0',
  `is_sleep` tinyint(1) NOT NULL DEFAULT '0',
  `bedroomBg` int DEFAULT '1',
  `kitchenBg` int DEFAULT '2',
  `laboratoryBg` int DEFAULT '3',
  `playroomBg` int DEFAULT '4'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `pets`
--

INSERT INTO `pets` (`id`, `user_id`, `hunger`, `funny`, `health`, `sleep`, `money`, `is_sleep`, `bedroomBg`, `kitchenBg`, `laboratoryBg`, `playroomBg`) VALUES
(1, 3, 100, 100, 100, 0, 9997644, 0, 4, 1, 1, 1);

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
(3, 'Блювин', -50, -10, -10, 0, 75, 'potions/5.png');

-- --------------------------------------------------------

--
-- Структура таблицы `potions_pets`
--

CREATE TABLE `potions_pets` (
  `potion_id` int NOT NULL,
  `pet_id` int NOT NULL,
  `count` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `potions_pets`
--

INSERT INTO `potions_pets` (`potion_id`, `pet_id`, `count`) VALUES
(3, 1, 78);

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

-- --------------------------------------------------------

--
-- Структура таблицы `products_pets`
--

CREATE TABLE `products_pets` (
  `product_id` int NOT NULL,
  `pet_id` int NOT NULL,
  `count` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `products_pets`
--

INSERT INTO `products_pets` (`product_id`, `pet_id`, `count`) VALUES
(2, 1, 1),
(1, 1, 6);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `luxaries`
--
ALTER TABLE `luxaries`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `luxaries_pets`
--
ALTER TABLE `luxaries_pets`
  ADD KEY `pet_id` (`pet_id`),
  ADD KEY `luxary_id` (`luxary_id`);

--
-- Индексы таблицы `pets`
--
ALTER TABLE `pets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bedroomBg` (`bedroomBg`),
  ADD KEY `laboratoryBg` (`laboratoryBg`),
  ADD KEY `playroomBg` (`playroomBg`),
  ADD KEY `kitchenBg` (`kitchenBg`);

--
-- Индексы таблицы `potions`
--
ALTER TABLE `potions`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `potions_pets`
--
ALTER TABLE `potions_pets`
  ADD KEY `pet_id` (`pet_id`),
  ADD KEY `potion_id` (`potion_id`);

--
-- Индексы таблицы `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `products_pets`
--
ALTER TABLE `products_pets`
  ADD KEY `pet_id` (`pet_id`),
  ADD KEY `product_id` (`product_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `luxaries`
--
ALTER TABLE `luxaries`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

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

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `luxaries_pets`
--
ALTER TABLE `luxaries_pets`
  ADD CONSTRAINT `luxaries_pets_ibfk_1` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `luxaries_pets_ibfk_2` FOREIGN KEY (`luxary_id`) REFERENCES `luxaries` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Ограничения внешнего ключа таблицы `pets`
--
ALTER TABLE `pets`
  ADD CONSTRAINT `pets_ibfk_1` FOREIGN KEY (`bedroomBg`) REFERENCES `luxaries` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `pets_ibfk_2` FOREIGN KEY (`laboratoryBg`) REFERENCES `luxaries` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `pets_ibfk_3` FOREIGN KEY (`playroomBg`) REFERENCES `luxaries` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `pets_ibfk_4` FOREIGN KEY (`kitchenBg`) REFERENCES `luxaries` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Ограничения внешнего ключа таблицы `potions_pets`
--
ALTER TABLE `potions_pets`
  ADD CONSTRAINT `potions_pets_ibfk_1` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `potions_pets_ibfk_2` FOREIGN KEY (`potion_id`) REFERENCES `potions` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Ограничения внешнего ключа таблицы `products_pets`
--
ALTER TABLE `products_pets`
  ADD CONSTRAINT `products_pets_ibfk_1` FOREIGN KEY (`pet_id`) REFERENCES `pets` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `products_pets_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
