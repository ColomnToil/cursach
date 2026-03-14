<?php
require_once('../connect.php');
$data = json_decode(file_get_contents('php://input'), true);
// echo json_encode($data);
$pet_id = $data['pet_id'];
$hunger = $data['hunger'];
$funny = $data['funny'];
$health = $data['health'];
$sleep = $data['sleep'];
// $happy = $data['happy'];
$connect->query("UPDATE `pets` SET `hunger`='$hunger',`funny`='$funny',`health`='$health',`sleep`='$sleep' WHERE `id` = '$pet_id'");

