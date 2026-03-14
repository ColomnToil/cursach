<?php
require_once('../connect.php');
$pet_id = $_GET['pet_id'];
$luxaries = $connect->query("select * from luxaries_pets where `pet_id` = '$pet_id'")->fetch_all(MYSQLI_ASSOC);

echo json_encode($luxaries);
