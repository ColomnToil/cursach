<?php
require_once('../connect.php');
$pet_id = $_GET['pet_id'];
// echo json_encode('qwe');
$petStats = $connect->query("select is_sleep from pets where `id` = '$pet_id'")->fetch_assoc();

echo json_encode($petStats);
