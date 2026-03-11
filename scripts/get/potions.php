<?php
require_once('../connect.php');

$potions = $connect->query("select * from potions")->fetch_all(MYSQLI_ASSOC);

echo json_encode($potions);
