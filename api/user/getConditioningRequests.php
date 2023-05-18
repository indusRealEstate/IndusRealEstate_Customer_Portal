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

    $data_1 = $dbase->execute("SELECT * FROM user_requests usr, user u, user_details ud WHERE usr.user_id = u.id AND usr.user_id = ud.user_id AND usr.req_to_id = '{$decodedData["userId"]}' AND usr.request_type = 'CONDITIONING_REQ'");


    // if ($data_1->num_rows != 0 && $data_2->num_rows != 0 && $data_3->num_rows != 0) {
        $prRows_1 = array();

        while (
            $row_1 = mysqli_fetch_assoc($data_1)
        ) {
            $prRows_1[] = $row_1;
        }
        
        echo json_encode($prRows_1);
    // } else {
    //     http_response_code(404);
    // }
}

?>