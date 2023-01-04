<?php 
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Content-Type: application/json; charset=UTF-8");

include "dBase.php";
$dbase = new dBase();
$tcon = $dbase->con;

$data = file_get_contents("php://input");

$stmt = $dbase->execute("INSERT INTO `my_properties`(`name`) VALUES ('{$data}')");

?>