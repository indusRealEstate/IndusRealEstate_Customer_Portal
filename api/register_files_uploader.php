<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");



$postdata = file_get_contents("php://input");
if (!empty($postdata)) {
    $request = json_decode($postdata);

    mkdir('upload/doc/user/' . $request->unique_id, 0777, true);

    if(count($request->passportFiles) != 0){
        for ($i = 0; $i < count($request->passportFiles); ++$i) {
            $passport_parts = explode(";base64,", $request->passportFiles[$i]->data);
            $passport_type_aux = explode("/", $passport_parts[0]);
            $passport_base64 = base64_decode($passport_parts[1]);
            
            $fileNumber = $i + 1;
    
            $imgFile = "upload/doc/user/$request->unique_id/" . 'passport' .'_'. $fileNumber. '.' . $passport_type_aux[1];
            if (file_put_contents($imgFile, $passport_base64)) {
                $response[] = array('sts'=>true,'msg'=>'Successfully uploaded');
            }
            echo json_encode($response);
        }
    }

    
    if(count($request->emiratesIdFiles) != 0){
        for ($i = 0; $i < count($request->emiratesIdFiles); ++$i) {
            $emirates_id_parts = explode(";base64,", $request->emiratesIdFiles[$i]->data);
            $emirates_id_type_aux = explode("/", $emirates_id_parts[0]);
            $emirates_id_base64 = base64_decode($emirates_id_parts[1]);
            
            $fileNumber = $i + 1;
    
            $imgFile = "upload/doc/user/$request->unique_id/" . 'emirates_id' .'_'. $fileNumber. '.' . $emirates_id_type_aux[1];
            if (file_put_contents($imgFile, $emirates_id_base64)) {
                $response[] = array('sts'=>true,'msg'=>'Successfully uploaded');
            }
            echo json_encode($response);
        }
    }
    
    if($request->salesDeedDoc != ''){
        $sales_deed_parts = explode(";base64,", $request->salesDeedDoc);
        $sales_deed_type_aux = explode("/", $sales_deed_parts[0]);
        $sales_deed_base64 = base64_decode($sales_deed_parts[1]);

        $imgFile = "upload/doc/user/$request->unique_id/" . 'sales_deed' .'.' . $sales_deed_type_aux[1];
        if (file_put_contents($imgFile, $sales_deed_base64)) {
            $response[] = array('sts'=>true,'msg'=>'Successfully uploaded');
        }
        echo json_encode($response);
    }
    
    if($request->ownerShipDoc != ''){
        $ownership_parts = explode(";base64,", $request->ownerShipDoc);
        $ownership_type_aux = explode("/", $ownership_parts[0]);
        $ownership_base64 = base64_decode($ownership_parts[1]);

        $imgFile = "upload/doc/user/$request->unique_id/" . 'ownership' . '.' . $ownership_type_aux[1];
        if (file_put_contents($imgFile, $ownership_base64)) {
            $response[] = array('sts'=>true,'msg'=>'Successfully uploaded');
        }
        echo json_encode($response);
    }

    if($request->user_signature != ''){
        $signature_parts = explode(";base64,", $request->user_signature);
        $signature_type_aux = explode("/", $signature_parts[0]);
        $signature_base64 = base64_decode($signature_parts[1]);

        $imgFile = "upload/doc/user/$request->unique_id/" . 'user_signature' . '.' . $signature_type_aux[1];
        if (file_put_contents($imgFile, $signature_base64)) {
            $response[] = array('sts'=>true,'msg'=>'Successfully uploaded');
        }
        echo json_encode($response);
    }
   
}
