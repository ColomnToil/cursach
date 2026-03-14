<?php
require_once('../connect.php');
$data = json_decode(file_get_contents('php://input'), true);
$pet_id = $data['pet_id'];
$lux_id = $data['lux_id'];
$room = $data['roomBg'];
$connect->query("UPDATE `pets` SET `$room`='$lux_id' WHERE `id` = '$pet_id'");
