<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");


$folderPathDoc = "upload/doc/user/";

$postdata = file_get_contents("php://input");
if (!empty($postdata)) {
    $request = json_decode($postdata);

    $doc_parts = explode(";base64,", $request->doc);
    $doc_type_aux = explode("/", $doc_parts[0]);
    $doc_base64 = base64_decode($doc_parts[1]);
    $docFile = $folderPathDoc.$request->docName .'.'. $doc_type_aux[1];
    if (file_put_contents($docFile, $doc_base64)) {
        $response[] = array('sts'=>true,'msg'=>'Successfully uploaded');
    }
    echo json_encode($response);
}
