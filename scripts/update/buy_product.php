<?php
// buy_product.php
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

$pet_id = isset($input['pet_id']) ? (int) $input['pet_id'] : 0;
$product_id = isset($input['product_id']) ? (int) $input['product_id'] : 0;

// Для отладки
error_log("Buy product request: pet_id=$pet_id, product_id=$product_id");

if ($pet_id <= 0 || $product_id <= 0) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

// Начинаем транзакцию
mysqli_begin_transaction($connect);

try {
    // 1. Получаем цену продукта из таблицы products
    $price_query = "SELECT price, title FROM products WHERE id = ?";
    $price_stmt = mysqli_prepare($connect, $price_query);
    mysqli_stmt_bind_param($price_stmt, "i", $product_id);
    mysqli_stmt_execute($price_stmt);
    mysqli_stmt_bind_result($price_stmt, $price, $title);

    if (!mysqli_stmt_fetch($price_stmt)) {
        mysqli_rollback($connect);
        error_log("Product not found: product_id=$product_id");
        echo json_encode(['success' => false, 'error' => 'Product not found']);
        exit;
    }
    mysqli_stmt_close($price_stmt);

    // Для отладки
    error_log("Product found: $title, price=$price");

    // 2. Проверяем баланс питомца
    $balance_query = "SELECT id, money FROM pets WHERE id = ?";
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
                'product_id' => $product_id
            ]
        ]);
        exit;
    }

    // 3. Списываем деньги
    $new_balance = $current_money - $price;
    $update_balance_query = "UPDATE pets SET money = ? WHERE id = ?";
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

    // 4. Проверяем, есть ли уже запись о продукте у питомца
    $check_query = "SELECT pet_id, count FROM products_pets WHERE pet_id = ? AND product_id = ?";
    $check_stmt = mysqli_prepare($connect, $check_query);
    mysqli_stmt_bind_param($check_stmt, "ii", $pet_id, $product_id);
    mysqli_stmt_execute($check_stmt);
    mysqli_stmt_store_result($check_stmt);

    if (mysqli_stmt_num_rows($check_stmt) > 0) {
        // Если запись есть - увеличиваем количество
        mysqli_stmt_bind_result($check_stmt, $avail_id, $current_quantity);
        mysqli_stmt_fetch($check_stmt);
        mysqli_stmt_close($check_stmt);

        $new_quantity = $current_quantity + 1;
        $update_query = "UPDATE products_pets SET count = ? WHERE pet_id = ? AND product_id = ?";
        $update_stmt = mysqli_prepare($connect, $update_query);
        mysqli_stmt_bind_param($update_stmt, "iii", $new_quantity, $pet_id, $product_id);

        if (!mysqli_stmt_execute($update_stmt)) {
            throw new Exception("Failed to update product quantity: " . mysqli_error($connect));
        }
        mysqli_stmt_close($update_stmt);

        error_log("Product quantity increased: product_id=$product_id, new_quantity=$new_quantity");
    } else {
        // Если записи нет - создаем новую с количеством 1
        mysqli_stmt_close($check_stmt);

        $insert_query = "INSERT INTO products_pets (pet_id, product_id, count) VALUES (?, ?, 1)";
        $insert_stmt = mysqli_prepare($connect, $insert_query);
        mysqli_stmt_bind_param($insert_stmt, "ii", $pet_id, $product_id);

        if (!mysqli_stmt_execute($insert_stmt)) {
            throw new Exception("Failed to insert product: " . mysqli_error($connect));
        }
        mysqli_stmt_close($insert_stmt);

        error_log("New product added: product_id=$product_id");
    }

    // 5. Логируем покупку
    // $log_query = "INSERT INTO purchase_log (pet_id, item_type, item_id, price, purchase_date) VALUES (?, 'product', ?, ?, NOW())";
    // $log_stmt = mysqli_prepare($connect, $log_query);
    // mysqli_stmt_bind_param($log_stmt, "iii", $pet_id, $product_id, $price);
    // mysqli_stmt_execute($log_stmt);
    // mysqli_stmt_close($log_stmt);

    // Подтверждаем транзакцию
    mysqli_commit($connect);

    error_log("Purchase successful: pet_id=$pet_id, product_id=$product_id, price=$price, new_balance=$new_balance");

    echo json_encode([
        'success' => true,
        'new_balance' => $new_balance,
        'product_id' => $product_id,
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