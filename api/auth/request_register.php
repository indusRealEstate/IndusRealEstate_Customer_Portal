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
    $stmt = $dbase->execute("INSERT INTO `create_ac_req`
    (
     `request_type`,
     `firstname`,
     `lastname`,
     `auth_type`,
     `nationality`,
     `email`,
     `passport_no`,
     `passport_exp`,
     `mobile_no`,
     `address`,
     `city`,
     `state`,
     `request_details_id`,
     `passport_pics`,
     `emirates_id_pics`,
     `ownership_doc`,
     `sales_deed_doc`,
     `approved`,
     `expired`,
     `declined`)
VALUES      (
     '{$decodedData["request_type"]}',
     '{$decodedData["firstname"]}',
     '{$decodedData["lastname"]}',
     '{$decodedData["auth_type"]}',
     '{$decodedData["nationality"]}',
     '{$decodedData["email"]}',
     '{$decodedData["passport_no"]}',
     '{$decodedData["passport_exp"]}',
     '{$decodedData["phone_number"]}',
     '{$decodedData["address"]}',
     '{$decodedData["city"]}',
     '{$decodedData["state"]}',
     '{$decodedData["request_details_id"]}',
     '{$decodedData["passport_pics"]}',
     '{$decodedData["emirates_id_pics"]}',
     '{$decodedData["ownership_doc"]}',
     '{$decodedData["sales_deed_doc"]}',
     '{$decodedData["approved"]}',
     '{$decodedData["expired"]}',
     '{$decodedData["declined"]}') ");
}
