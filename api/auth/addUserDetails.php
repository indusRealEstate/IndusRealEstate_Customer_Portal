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

if ($postdata != null) {
    $stmt = $dbase->execute("INSERT INTO `user_details`
    (`user_id`,
     `email`,
     `nationality`,
     `passport_no`,
     `passport_exp`,
     `phone_number`,
     `address`,
     `profile_photo`,
     `joined_date`)
VALUES      ('{$decodedData["user_id"]}',
     '{$decodedData["email"]}',
     '{$decodedData["nationality"]}',
     '{$decodedData["passport_no"]}',
     '{$decodedData["passport_exp"]}',
     '{$decodedData["phone_number"]}',
     '{$decodedData["address"]}',
     '{$decodedData["profile_photo"]}',
     '{$decodedData["joined_date"]}') ");
}
