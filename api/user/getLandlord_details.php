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

    $data_1 = $dbase->execute("SELECT * FROM tenants t, user u, user_details ud, user_properties usp WHERE t.landlord_id = u.id AND t.landlord_id = ud.user_id AND t.property_id = usp.property_id AND t.user_id = '{$decodedData["userId"]}'");
    $prRows_1 = array();
    while (
        $row_1 = mysqli_fetch_assoc($data_1)
    ) {
        $prRows_1[] = $row_1;
    }

    echo json_encode($prRows_1);

}

?>