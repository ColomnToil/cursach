<?php
require_once('../connect.php');
$money = $_GET['money'];
$connect->query("UPDATE `pets` SET `money`='$money' WHERE `id` = '$pet_id'");

