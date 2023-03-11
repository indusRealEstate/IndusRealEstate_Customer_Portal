<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header(
    "Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept"
);
header("Content-type: application/pdf");

$postdata = file_get_contents("php://input");
$decodedData = json_decode($postdata, true);

if (isset($postdata) && !empty($postdata)) {
    $raw_obj = $decodedData["doc_data"];

    $json = json_decode($raw_obj, true);

    if ($json["auth_type"] == "landlord") {
        $string = "upload/doc/landlord-documents/" . $json["file_path"];

        $b64Doc = chunk_split(base64_encode(file_get_contents($string)));
    } elseif ($json["auth_type"] == "tenant") {
        $string = "upload/doc/tenant-documents/" . $json["file_path"];

        $b64Doc = chunk_split(base64_encode(file_get_contents($string)));
    }

    echo json_encode($b64Doc);
}

?>
