<?php

header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Content-Type: application/json; charset=UTF-8");

include "../dBase.php";
$dbase = new dBase();
$tcon = $dbase->con;

$postdata = file_get_contents("php://input");
$decodedData = json_decode($postdata, true);

if ($postdata != null) {
    $stmt = $dbase->execute("INSERT INTO `landlord_add_property_request`
    (`user_id`,
     `property_state`,
     `offer_validity`,
     `furnish_details`,
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
     `second_party_signature`)
VALUES      (
     '{$decodedData["user_id"]}',
     '{$decodedData["property_state"]}',
     '{$decodedData["offer_validity"]}',
     '{$decodedData["furnish_details"]}',
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
     '{$decodedData["second_party_signature_name"]}') ");
     
}
