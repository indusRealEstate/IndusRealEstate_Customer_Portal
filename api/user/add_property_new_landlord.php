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
    $stmt = $dbase->execute("INSERT INTO `add_property_req_new_ac`
    (`property_unique_id`,
     `property_state`,
     `property_offer_validity`,
     `property_furnish_details`,
     `property_type`,
     `property_title_deed_number`,
     `property_project_name`,
     `property_community`,
     `property_building_name`,
     `property_size_area`,
     `property_bedroom_no`,
     `property_unit_number`,
     `property_car_parking_no`,
     `property_additional_info`,
     `property_social_media_marketing_info`,
     `property_board_marketing_info`,
     `property_others_marketing_info`,
     `property_images`,
     `property_docs`,
     `property_valid_until`,
     `property_second_party_signature`,
     `property_issue_date`)
VALUES
    ('{$decodedData["unique_id"]}',
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
     '{$decodedData["social_media_marketing_info"]}',
     '{$decodedData["board_marketing_info"]}',
     '{$decodedData["others_marketing_info"]}',
     '{$decodedData["images"]}',
     '{$decodedData["docs"]}',
     '{$decodedData["valid_until"]}',
     '{$decodedData["second_party_signature_name"]}',
     '{$decodedData["issue_date"]}') ");
}
