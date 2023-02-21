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

    $result1 = $dbase->execute("SELECT * FROM `create_ac_req` WHERE `request_details_id` = '{$decodedData["unique_id"]}'");
    $result2 = $dbase->execute("SELECT * FROM `add_property_req` WHERE `unique_id` = '{$decodedData["unique_id"]}'");

    if ($result1->num_rows != 0 && $result2->num_rows != 0) {
        $rows = array();
        while ($row1 = mysqli_fetch_assoc($result1)) {
            $rows[] = $row1;
        }
        while ($row2 = mysqli_fetch_assoc($result2)) {
            $rows[] = $row2;
        }
        echo json_encode($rows);
    } else {
        http_response_code(404);
    }
}

// echo json_encode($res);

?>