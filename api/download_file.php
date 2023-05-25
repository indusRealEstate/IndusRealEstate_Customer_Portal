<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Content-type: application/pdf");

include "../dBase.php";
$dbase = new dBase();
$tcon = $dbase->con;

$postdata = file_get_contents("php://input");
$decodedData = json_decode($postdata, true);

if (isset($postdata) && !empty($postdata)) {


    // $raw_path = 'upload/doc/user-documents/' . $decodedData["path"];
    
    $url  = 'https://indusre.app/api/upload/doc/user-documents/'. $decodedData["path"];
    $path = '/upload/doc/user-documents/' . $decodedData["path"];

    $fp = fopen($path, 'w');

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_FILE, $fp);

    $data = curl_exec($ch);

    curl_close($ch);
    fclose($fp);

}


?>