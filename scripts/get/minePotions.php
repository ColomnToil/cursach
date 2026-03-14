<?php
require_once('../connect.php');
$pet_id = $_GET['pet_id'];
$potions = $connect->query("select * from potions_pets where `pet_id` = '$pet_id'")->fetch_all(MYSQLI_ASSOC);

echo json_encode($potions);
