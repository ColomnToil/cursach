<?php
require_once('../connect.php');
$data = json_decode(file_get_contents("php://input"), true);
// echo json_encode($data);
$pet_id = $_GET['pet_id'];
$count = intval($data['_count']) - 1;
$product_id = $data['_id'];

if ($count > 0) {
    $connect->query("UPDATE `products_pets` SET `count`='$count' where `pet_id` = '$pet_id' and `product_id` = '$product_id'");
} else {
    $connect->query("DELETE from `products_pets` where `pet_id` = '$pet_id' and `product_id` = '$product_id'");
}
