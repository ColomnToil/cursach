<?php
require_once('../connect.php');
$user_id = $_GET['user_id'];
$petStats = $connect->query("select * from pets where `user_id` = '$user_id'")->fetch_all(MYSQLI_ASSOC);

echo json_encode($petStats);
