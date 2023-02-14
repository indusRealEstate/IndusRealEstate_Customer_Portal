<?php

header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Content-Type: application/json; charset=UTF-8");

include "../dBase.php";
$dbase = new dBase();
$tcon = $dbase->con;

$postdata = file_get_contents("php://input");
$decodedData = json_decode($postdata, true);

if (isset($postdata) && !empty($postdata)) {
    $stmt = $dbase->execute("INSERT INTO user
                                          (`id`,
                                           `auth_type`,
                                           `username`,
                                           `password`,
                                           `firstname`,
                                           `lastname`,
                                           `token`)
                             VALUES      ('{$decodedData["id"]}',
                                           '{$decodedData["auth_type"]}',
                                           '{$decodedData["username"]}',
                                           '{$decodedData["password"]}',
                                           '{$decodedData["firstname"]}',
                                           '{$decodedData["lastname"]}',
                                           '{$decodedData["token"]}')");
}
