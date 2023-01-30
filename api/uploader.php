<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$folderPathImage = "upload/img/properties/";
$folderPathImageSign = "upload/img/sign/";
$folderPathDoc = "upload/doc/properties/";

$postdata = file_get_contents("php://input");
if (!empty($postdata)) {
    $request = json_decode($postdata);

    // image upload.

    for ($i = 0; $i < count($request->images); ++$i) {
        $image_parts = explode(";base64,", $request->images[$i]);
        $image_type_aux = explode("/", $image_parts[0]);
        $image_base64 = base64_decode($image_parts[1]);
        $imgFile = $folderPathImage.$request->imageNames[$i] .'.'. $image_type_aux[1];
        if (file_put_contents($imgFile, $image_base64)) {
            $response[] = array('sts'=>true,'msg'=>'Successfully uploaded');
        }
        echo json_encode($response);
    }

    // doc upload.

    for ($i = 0; $i < count($request->docs); ++$i) {
        $doc_parts = explode(";base64,", $request->docs[$i]);
        $doc_type_aux = explode("/", $doc_parts[0]);
        $doc_base64 = base64_decode($doc_parts[1]);
        $docFile = $folderPathDoc. $request->docsNames[$i] .'.'. $doc_type_aux[1];
        if (file_put_contents($docFile, $doc_base64)) {
            $response[] = array('sts'=>true,'msg'=>'Successfully uploaded');
        }
        echo json_encode($response);
    }


    // sign upload

    $sign_parts = explode(";base64,", $request->sign);
    $sign_type_aux = explode("/", $sign_parts[0]);
    $sign_base64 = base64_decode($sign_parts[1]);
    $signFile = $folderPathImageSign.$request->signName .'.'. $sign_type_aux[1];
    if (file_put_contents($signFile, $sign_base64)) {
        $response[] = array('sts'=>true,'msg'=>'Successfully uploaded');
    }
    echo json_encode($response);
}
