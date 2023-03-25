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

if (isset($postdata) && !empty($postdata)) {
    $stmt = $dbase->execute("INSERT INTO `create_ac_req_tenant`
    ( `request_type`,
     `firstname`,
     `lastname`,
     `auth_type`,
     `email`,
     `nationality`,
     `passport_no`,
     `passport_exp`,
     `phone_number`,
     `address`,
     `city`,
     `state`,
     `propertyusage`,
     `landlordname`,
     `buildingname`,
     `contract_to`,
     `contract_from`,
     `property_size`,
     `property_type`,
     `propertyno`,
     `location`,
     `premisesno`,
     `annualrent`,
     `contractvalue`,
     `security_deposit_amnt`,
     `mode_of_payment`,
     `request_details_id`,
     `tenant_passport_pics`,
     `landlord_passport_pics`,
     `tenant_emirates_id_pics`,
     `original_tenancy_contract`,
     `security_deposit_reciept`,
     `copy_of_valid_power_of_attorney_document`,
     `tenants_visa_copy`,
     `title_deed_doc`,
     `approved`,
     `expired`,
     `declined`,
     `issue_date`)
VALUES      ('{$decodedData["request_type"]}',
'{$decodedData["firstname"]}',
'{$decodedData["lastname"]}',
'{$decodedData["auth_type"]}',
'{$decodedData["email"]}',
'{$decodedData["nationality"]}',
'{$decodedData["passport_no"]}',
'{$decodedData["passport_exp"]}',
'{$decodedData["phone_number"]}',
'{$decodedData["address"]}',
'{$decodedData["city"]}',
'{$decodedData["state"]}',
'{$decodedData["propertyUsage"]}',
'{$decodedData["landlordName"]}',
'{$decodedData["buildingName"]}',
'{$decodedData["contract_to"]}',
'{$decodedData["contract_from"]}',
'{$decodedData["property_size"]}',
'{$decodedData["property_type"]}',
'{$decodedData["propertyNo"]}',
'{$decodedData["location"]}',
'{$decodedData["premisesNo"]}',
'{$decodedData["annualRent"]}',
'{$decodedData["contractValue"]}',
'{$decodedData["security_deposit_amnt"]}',
'{$decodedData["mode_of_payment"]}',
'{$decodedData["request_details_id"]}',
'{$decodedData["tenant_passport_pics"]}',
'{$decodedData["landlord_passport_pics"]}',
'{$decodedData["tenant_emirates_id_pics"]}',
'{$decodedData["original_tenancy_contract"]}',
'{$decodedData["security_Deposit_reciept"]}',
'{$decodedData["copy_of_valid_power_of_attorney_document"]}',
'{$decodedData["tenants_Visa_Copy"]}',
'{$decodedData["title_Deed_doc"]}',
'{$decodedData["approved"]}',
'{$decodedData["expired"]}',
'{$decodedData["declined"]}',
'{$decodedData["issue_date"]}') ");
}
