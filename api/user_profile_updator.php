<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$folderPathImage = "upload/img/user/";

$postdata = file_get_contents("php://input");
if (!empty($postdata)) {
    $request = json_decode($postdata);

    try {
        foreach (glob($folderPathImage . $request->user_id . '*') as $filename) {
            unlink(realpath($filename));
        }
        // echo json_encode('successfully deleted old file');
    } catch (\Throwable $th) {
        echo json_encode(($th));
    }

    $image_parts = explode(";base64,", $request->data);
    $image_type_aux = explode("/", $image_parts[0]);
    $image_base64 = base64_decode($image_parts[1]);
    $imgFile = $folderPathImage . $request->user_id . '.' . $image_type_aux[1];
    if (file_put_contents($imgFile, $image_base64)) {
        $response[] = array('sts' => true, 'msg' => 'Successfully uploaded');
    }
    echo json_encode($response);

}