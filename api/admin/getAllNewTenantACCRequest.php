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
    $result = $dbase->execute("SELECT * FROM `user` WHERE `id` = '{$decodedData["userId"]}'");

    if ($result->num_rows != 0) {
        $rows = array();
        while ($row = mysqli_fetch_assoc($result)) {
            $rows[] = $row;
        }

        $userEncoded = json_encode($rows);
        $userDecoded = json_decode($userEncoded);

        if ($userDecoded[0]->auth_type == 'admin') {
            $propertiesData = $dbase->execute("SELECT * FROM `create_ac_req_tenant`");

            if ($propertiesData->num_rows != 0) {
                $prRows = array();
                while ($prRow = mysqli_fetch_assoc($propertiesData)) {
                    $prRows[] = $prRow;
                }

                echo json_encode($prRows);
            } else {
                http_response_code(404);
            }
        }
    } else {
        http_response_code(404);
    }
}

// echo json_encode($res);
