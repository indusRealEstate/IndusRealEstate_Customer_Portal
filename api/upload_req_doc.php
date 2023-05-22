<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Cache-Control: post-check=0, pre-check=0', FALSE);
header('Pragma: no-cache');

$folderPathReqDoc = "upload/doc/payment-docs/";

$postdata = file_get_contents("php://input");
if (!empty($postdata)) {
    $request = json_decode($postdata);

    $req_parts = explode(";base64,", $request->req);
    $req_type_aux = explode("/", $req_parts[0]);
    $req_base64 = base64_decode($req_parts[1]);
    $reqFile = $folderPathReqDoc.$request->reqName;
    if (file_put_contents($reqFile, $req_base64)) {
        $response[] = array('sts'=>true,'msg'=>'Successfully uploaded');
    }
    echo json_encode($response);
}
