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

if (isset($postdata) && !empty($postdata)) {
    $result = $dbase->execute(
        "SELECT * FROM `user` WHERE `id` = '{$decodedData["admin_id"]}'"
    );

    if ($result->num_rows != 0) {
        $rows = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $rows[] = $row;
        }

        $userEncoded = json_encode($rows);
        $userDecoded = json_decode($userEncoded);

        if ($userDecoded[0]->auth_type == "admin") {
            if ($decodedData["req_type_name"] == "create_ac_req") {
                $stmt = $dbase->execute("UPDATE `create_ac_req`
                                        SET `approved`='{$decodedData["approved"]}'
                                        WHERE `request_details_id` = '{$decodedData["unique_id"]}'");
                echo json_encode("success");
            } elseif ($decodedData["req_type_name"] == "payment_req") {
                $stmt = $dbase->execute("UPDATE `payment_req`
                                        SET `approved`='{$decodedData["approved"]}'
                                        WHERE `user_id` = '{$decodedData["user_id"]}'");
                echo json_encode("success");
            } elseif ($decodedData["req_type_name"] == "add_property_req") {
                $stmt = $dbase->execute("UPDATE `add_property_req`
                                        SET `approved`='{$decodedData["approved"]}'
                                        WHERE `user_id` = '{$decodedData["user_id"]}'");
                echo json_encode("success");
            }
        } else {
            echo "invalid access";
        }
    } else {
        http_response_code(404);
    }
}

?>
