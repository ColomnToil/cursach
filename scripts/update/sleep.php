<?php
require_once('../connect.php');
$pet_id = $_GET['pet_id'];
$sleep = $_GET['is'];
$connect->query("UPDATE `pets` SET `is_sleep`='$sleep' WHERE `id` = '$pet_id'");
