<?php

header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Content-Type: application/json; charset=UTF-8");
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('Cache-Control: post-check=0, pre-check=0', FALSE);
header('Pragma: no-cache');

include "../dBase.php";
$dbase = new dBase();
$tcon = $dbase->con;

$postdata = file_get_contents("php://input");
$decodedData = json_decode($postdata, true);

if ($postdata != null) {
    $stmt = $dbase->execute("INSERT INTO `add_property_req`
    (`user_id`,
     `request_type`,
     `unique_id`,
     `property_state`,
     `offer_validity`,
     `furnish_details`,
     `property_type`,
     `title_deed_number`,
     `project_name`,
     `community`,
     `building_name`,
     `size_area`,
     `bedroom_no`,
     `unit_number`,
     `car_parking_no`,
     `additional_info`,
     `property_image_1`,
     `property_image_2`,
     `property_image_3`,
     `property_image_4`,
     `property_image_5`,
     `property_doc_1`,
     `property_doc_2`,
     `property_doc_3`,
     `property_doc_4`,
     `social_media_marketing_info`,
     `board_marketing_info`,
     `others_marketing_info`,
     `valid_until`,
     `second_party_signature`,
     `approved`,
     `expired`,
     `declined`,
     `issue_date`)
VALUES
    ('{$decodedData["user_id"]}',
     '{$decodedData["request_type"]}',
     '{$decodedData["unique_id"]}',
     '{$decodedData["property_state"]}',
     '{$decodedData["offer_validity"]}',
     '{$decodedData["furnish_details"]}',
     '{$decodedData["property_type"]}',
     '{$decodedData["title_deed_number"]}',
     '{$decodedData["project_name"]}',
     '{$decodedData["community"]}',
     '{$decodedData["building_name"]}',
     '{$decodedData["size_area"]}',
     '{$decodedData["bedroom_no"]}',
     '{$decodedData["unit_number"]}',
     '{$decodedData["car_parking_no"]}',
     '{$decodedData["additional_info"]}',
     '{$decodedData["property_image_1_name"]}',
     '{$decodedData["property_image_2_name"]}',
     '{$decodedData["property_image_3_name"]}',
     '{$decodedData["property_image_4_name"]}',
     '{$decodedData["property_image_5_name"]}',
     '{$decodedData["property_doc_1_name"]}',
     '{$decodedData["property_doc_2_name"]}',
     '{$decodedData["property_doc_3_name"]}',
     '{$decodedData["property_doc_4_name"]}',
     '{$decodedData["social_media_marketing_info"]}',
     '{$decodedData["board_marketing_info"]}',
     '{$decodedData["others_marketing_info"]}',
     '{$decodedData["valid_until"]}',
     '{$decodedData["second_party_signature_name"]}',
     '{$decodedData["approved"]}',
     '{$decodedData["expired"]}',
     '{$decodedData["declined"]}',
     '{$decodedData["issue_date"]}') ");
}
