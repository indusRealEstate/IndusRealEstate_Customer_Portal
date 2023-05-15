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

    $data_1 = $dbase->execute("SELECT * FROM landlord_tenants WHERE user_id = '{$decodedData["userId"]}'");
    $prRows_1 = array();
    while (
        $row_1 = mysqli_fetch_assoc($data_1)
    ) {
        $prRows_1[] = $row_1;
    }

    $tenantIDS = json_decode($prRows_1[0]['tenant_ids']);

    $tenant_data = array();

    foreach ($tenantIDS->tenant_ids as $key => $value) {
        $result = $dbase->execute("SELECT * FROM user_documents udoc, user u, user_details ud WHERE udoc.user_id = '$value' AND u.id = '$value' AND ud.user_id = '$value'");
        while ($row = mysqli_fetch_assoc($result)) {
            $tenant_data[] = $row;
        }
    }

    echo json_encode($tenant_data);

}

?>