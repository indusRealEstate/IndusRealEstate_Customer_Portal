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

$result = $dbase->execute("SELECT * FROM `create_ac_req`");
$result2 = $dbase->execute("SELECT * FROM `create_ac_req_tenant`");

if ($result->num_rows != 0 && $result2->num_rows != 0) {
    $rows = [];
    $rows2 = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $rows[] = $row;
    }

    while ($row2 = mysqli_fetch_assoc($result2)) {
        $rows2[] = $row2;
    }

    $final_row = array_merge($rows, $rows2);

    echo json_encode($final_row);
} else {
    http_response_code(404);
}

?>
