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
            // $sample_array_2 = array();
            // $sample_array = array();
            $data_1 = $dbase->execute("SELECT * FROM create_ac_req_landlord cl, add_property_req_new_ac adrn WHERE cl.request_details_id = adrn.unique_id");
            $data_2 = $dbase->execute("SELECT * FROM create_ac_req_tenant");
            $data_3 = $dbase->execute("SELECT * FROM add_property_req_exist");


            if ($data_1->num_rows != 0 && $data_2->num_rows != 0 && $data_3->num_rows != 0) {
                $prRows_1 = array();
                $prRows_2 = array();
                $prRows_3 = array();

                while (
                    $row_1 = mysqli_fetch_assoc($data_1)
                ) {
                    $prRows_1[] = $row_1;
                }
                while (
                    $row_2 = mysqli_fetch_assoc($data_2)
                ) {
                    $prRows_2[] = $row_2;
                }
                while (
                    $row_3 = mysqli_fetch_assoc($data_3)
                ) {
                    $prRows_3[] = $row_3;
                }
                $final_array = array_merge($prRows_1, $prRows_2, $prRows_3);
                echo json_encode($final_array);
            } else {
                http_response_code(404);
            }
        }
    } else {
        http_response_code(404);
    }
}

// echo json_encode($res);