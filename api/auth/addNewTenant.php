<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header(
    "Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept"
);
header("Content-Type: application/json; charset=UTF-8");

include "../dBase.php";
$dbase = new dBase();
$tcon = $dbase->con;

$postdata = file_get_contents("php://input");
$decodedData = json_decode($postdata, true);

if ($postdata != null) {
    try {
        $stmt = $dbase->execute(
            "INSERT INTO `user`
         (`id`,
          `auth_type`,
          `username`,
          `password`,
          `firstname`,
          `lastname`,
          `token`)
       VALUES      
         ('{$decodedData["user_data"]["unique_id"]}',
          '{$decodedData["user_data"]["auth_type"]}',
          '{$decodedData["user_data"]["username"]}',
          '{$decodedData["user_data"]["password"]}',
          '{$decodedData["user_data"]["firstname"]}',
          '{$decodedData["user_data"]["lastname"]}',
          '{$decodedData["user_data"]["token"]}')"
        );

        $stmt2 = $dbase->execute(
            "INSERT INTO `user_details`
         (`user_id`,
          `email`,
          `nationality`,
          `passport_no`,
          `passport_exp`,
          `phone_number`,
          `address`,
          `profile_photo`)
       VALUES      
         ('{$decodedData["user_details"]["unique_id"]}',
          '{$decodedData["user_details"]["email"]}',
          '{$decodedData["user_details"]["nationality"]}',
          '{$decodedData["user_details"]["passport_no"]}',
          '{$decodedData["user_details"]["passport_exp"]}',
          '{$decodedData["user_details"]["phone_number"]}',
          '{$decodedData["user_details"]["address"]}',
          '{$decodedData["user_details"]["profile_photo"]}')"
        );

        

        echo "success.";
    } catch (\Throwable $th) {
        echo "something went wrong. $th.";
    }
}

?>
