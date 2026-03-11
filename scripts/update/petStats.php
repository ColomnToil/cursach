<?php
require_once('../connect.php');
$data = json_decode(file_get_contents("storage.json"), true);
$user_id = $data['user_id'];
$hunger = $data['hunger'];
$funny = $data['funny'];
$health = $data['health'];
$happy = $data['happy'];
$connect->query("UPDATE `pets` SET `hunger`='$hunger',`funny`='$funny',`health`='$health',`happy`='$happy' WHERE `user_id` = '$user_id'");
