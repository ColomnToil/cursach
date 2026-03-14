<?php
require_once('../connect.php');

$luxaries = $connect->query("select * from luxaries")->fetch_all(MYSQLI_ASSOC);

echo json_encode($luxaries);
