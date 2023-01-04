<?php 
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Content-Type: application/json; charset=UTF-8");

include "../dBase.php";
$dbase = new dBase();
$tcon = $dbase->con;


$stmt = $dbase->execute("SELECT * FROM `my_properties` WHERE 1");
$res = $stmt->fetch_all(MYSQLI_ASSOC);

echo json_encode($res);

?>