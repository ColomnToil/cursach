<?php
// buy_luxury.php
session_start();
header('Content-Type: application/json');

// Подключение к базе данных
require_once '../connect.php';

// Получение данных из POST-запроса
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['success' => false, 'error' => 'Invalid input']);
    exit;
}

$pet_id = (int) $input['pet_id'];
$luxury_id = (int) $input['lux_id'];

// Для отладки - запишем входящие данные
error_log("Buy request: pet_id=$pet_id, luxury_id=$luxury_id");

if ($pet_id <= 0 || $luxury_id <= 0) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

// Начинаем транзакцию
mysqli_begin_transaction($connect);

try {
    // 1. Получаем цену предмета из таблицы luxaries
    $price_query = "SELECT price, shop_id, title FROM luxaries WHERE `id` = ?";
    $price_stmt = mysqli_prepare($connect, $price_query);
    mysqli_stmt_bind_param($price_stmt, "i", $luxury_id);
    mysqli_stmt_execute($price_stmt);
    mysqli_stmt_bind_result($price_stmt, $price, $shop_id, $title);

    if (!mysqli_stmt_fetch($price_stmt)) {
        mysqli_rollback($connect);
        error_log("Item not found: luxury_id=$luxury_id");
        echo json_encode(['success' => false, 'error' => 'Item not found']);
        exit;
    }
    mysqli_stmt_close($price_stmt);

    // Для отладки
    error_log("Item found: $title, price=$price, shop_id=$shop_id");

    // Проверяем, доступен ли предмет для покупки
    if ($shop_id != 0) {
        mysqli_rollback($connect);
        error_log("Item not available: shop_id=$shop_id");
        echo json_encode(['success' => false, 'error' => 'Item not available for purchase']);
        exit;
    }

    // 2. Проверяем, не куплен ли уже этот предмет
    $check_query = "SELECT luxary_id FROM luxaries_pets WHERE pet_id = ? AND luxary_id = ?";
    $check_stmt = mysqli_prepare($connect, $check_query);
    mysqli_stmt_bind_param($check_stmt, "ii", $pet_id, $luxury_id);
    mysqli_stmt_execute($check_stmt);
    mysqli_stmt_store_result($check_stmt);

    if (mysqli_stmt_num_rows($check_stmt) > 0) {
        mysqli_rollback($connect);
        error_log("Item already owned: pet_id=$pet_id, luxury_id=$luxury_id");
        echo json_encode(['success' => false, 'error' => 'Item already owned']);
        exit;
    }
    mysqli_stmt_close($check_stmt);

    // 3. Проверяем баланс питомца
    $balance_query = "SELECT id, money FROM pets WHERE `id` = ?";
    $balance_stmt = mysqli_prepare($connect, $balance_query);
    mysqli_stmt_bind_param($balance_stmt, "i", $pet_id);
    mysqli_stmt_execute($balance_stmt);
    mysqli_stmt_bind_result($balance_stmt, $db_pet_id, $current_money);

    if (!mysqli_stmt_fetch($balance_stmt)) {
        mysqli_rollback($connect);
        error_log("Pet not found: pet_id=$pet_id");
        echo json_encode(['success' => false, 'error' => 'Pet not found']);
        exit;
    }
    mysqli_stmt_close($balance_stmt);

    // Для отладки
    error_log("Pet balance: has $current_money money, item price: $price");

    if ($current_money < $price) {
        mysqli_rollback($connect);
        error_log("Insufficient funds: has $current_money, needs $price");
        echo json_encode([
            'success' => false,
            'error' => 'Insufficient funds',
            'debug' => [
                'current_balance' => $current_money,
                'price' => $price,
                'pet_id' => $pet_id,
                'luxury_id' => $luxury_id
            ]
        ]);
        exit;
    }

    // 4. Списываем деньги
    $new_balance = $current_money - $price;
    $update_balance_query = "UPDATE pets SET money = ? WHERE `id` = ?";
    $update_balance_stmt = mysqli_prepare($connect, $update_balance_query);
    mysqli_stmt_bind_param($update_balance_stmt, "ii", $new_balance, $pet_id);

    if (!mysqli_stmt_execute($update_balance_stmt)) {
        throw new Exception("Failed to update balance: " . mysqli_error($connect));
    }
    mysqli_stmt_close($update_balance_stmt);

    // Проверяем, сколько строк обновлено
    if (mysqli_affected_rows($connect) == 0) {
        throw new Exception("No rows updated - pet may not exist");
    }

    // 5. Добавляем предмет в avaliable_luxaries
    $insert_query = "INSERT INTO luxaries_pets (pet_id, luxary_id) VALUES (?, ?)";
    $insert_stmt = mysqli_prepare($connect, $insert_query);
    mysqli_stmt_bind_param($insert_stmt, "ii", $pet_id, $luxury_id);

    if (!mysqli_stmt_execute($insert_stmt)) {
        throw new Exception("Failed to insert luxury: " . mysqli_error($connect));
    }
    mysqli_stmt_close($insert_stmt);

    // 6. Логируем покупку
    // $log_query = "INSERT INTO purchase_log (pet_id, item_type, item_id, price, purchase_date) VALUES (?, 'luxury', ?, ?, NOW())";
    // $log_stmt = mysqli_prepare($connect, $log_query);
    // mysqli_stmt_bind_param($log_stmt, "iii", $pet_id, $luxury_id, $price);
    // mysqli_stmt_execute($log_stmt);
    // mysqli_stmt_close($log_stmt);

    // Подтверждаем транзакцию
    mysqli_commit($connect);

    error_log("Purchase successful: pet_id=$pet_id, luxury_id=$luxury_id, price=$price, new_balance=$new_balance");

    echo json_encode([
        'success' => true,
        'new_balance' => $new_balance,
        'message' => 'Purchase successful'
    ]);

} catch (Exception $e) {
    mysqli_rollback($connect);
    error_log("Purchase error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}

mysqli_close($connect);
?>