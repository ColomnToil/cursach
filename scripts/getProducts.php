<?php
require_once('connect.php');

$products = $connect->query("select * from products")->fetch_all(MYSQLI_ASSOC);

echo json_encode($products);
