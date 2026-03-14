<?php
require_once('../connect.php');
$pet_id = $_GET['pet_id'];
$products = $connect->query("select * from products_pets where `pet_id` = '$pet_id'")->fetch_all(MYSQLI_ASSOC);

echo json_encode($products);
