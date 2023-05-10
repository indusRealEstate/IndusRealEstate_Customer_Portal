<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header(
    "Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept"
);
header("Content-Type: application/json; charset=UTF-8");

include "../dBase.php";
$dbase = new dBase();
$tcon = $dbase->con;

$postdata = file_get_contents("php://input");
$decodedData = json_decode($postdata, true);

if ($postdata != null) {
    try {
        $stmt = $dbase->execute(
            "INSERT INTO `user`
         (`id`,
          `auth_type`,
          `username`,
          `password`,
          `firstname`,
          `lastname`,
          `plan`,
          `token`)
       VALUES      
         ('{$decodedData["user_data"]["unique_id"]}',
          '{$decodedData["user_data"]["auth_type"]}',
          '{$decodedData["user_data"]["username"]}',
          '{$decodedData["user_data"]["password"]}',
          '{$decodedData["user_data"]["firstname"]}',
          '{$decodedData["user_data"]["lastname"]}',
          '{$decodedData["user_data"]["plan"]}',
          '{$decodedData["user_data"]["token"]}')"
        );

        $stmt2 = $dbase->execute(
            "INSERT INTO `user_details`
         (`user_id`,
          `email`,
          `nationality`,
          `passport_no`,
          `passport_exp`,
          `phone_number`,
          `address`,
          `profile_photo`)
       VALUES      
         ('{$decodedData["user_details"]["unique_id"]}',
          '{$decodedData["user_details"]["email"]}',
          '{$decodedData["user_details"]["nationality"]}',
          '{$decodedData["user_details"]["passport_no"]}',
          '{$decodedData["user_details"]["passport_exp"]}',
          '{$decodedData["user_details"]["phone_number"]}',
          '{$decodedData["user_details"]["address"]}',
          '{$decodedData["user_details"]["profile_photo"]}')"
        );

        $stmt3 = $dbase->execute(
            "INSERT INTO `user_properties`
      (`user_id`,
       `property_id`,
       `property_name`,
       `property_address`,
       `property_state`,
       `image1`,
       `image2`,
       `image3`,
       `image4`,
       `image5`,
       `property_doc1`,
       `property_doc2`,
       `property_doc3`,
       `property_doc4`,
       `property_size`,
       `price_range`,
       `property_type`,
       `completion`,
       `furnish_details`,
       `furnish_type`,
       `community_name`,
       `project_name`,
       `ownership`,
       `title_deed_number`,
       `ref_no`,
       `purpose`,
       `developer`,
       `chart_data`,
       `map_data`,
       `social_media_marketing_info`,
       `board_marketing_info`,
       `others_marketing_info`,
       `bedroom_no`,
       `unit_no`,
       `parking_no`)
     VALUES       
     ('{$decodedData["property_data"]["unique_id"]}',
     '{$decodedData["property_data"]["property_id"]}',
     '{$decodedData["property_data"]["property_name"]}',
     '{$decodedData["property_data"]["property_address"]}',
     '{$decodedData["property_data"]["property_state"]}',
     '{$decodedData["property_data"]["image1"]}',
     '{$decodedData["property_data"]["image2"]}',
     '{$decodedData["property_data"]["image3"]}',
     '{$decodedData["property_data"]["image4"]}',
     '{$decodedData["property_data"]["image5"]}',
     '{$decodedData["property_data"]["property_doc1"]}',
     '{$decodedData["property_data"]["property_doc2"]}',
     '{$decodedData["property_data"]["property_doc3"]}',
     '{$decodedData["property_data"]["property_doc4"]}',
     '{$decodedData["property_data"]["property_size"]}',
     '{$decodedData["property_data"]["price_range"]}',
     '{$decodedData["property_data"]["property_type"]}',
     '{$decodedData["property_data"]["completion"]}',
     '{$decodedData["property_data"]["furnish_details"]}',
     '{$decodedData["property_data"]["furnish_type"]}',
     '{$decodedData["property_data"]["community_name"]}',
     '{$decodedData["property_data"]["project_name"]}',
     '{$decodedData["property_data"]["ownership"]}',
     '{$decodedData["property_data"]["title_deed_number"]}',
     '{$decodedData["property_data"]["ref_no"]}',
     '{$decodedData["property_data"]["purpose"]}',
     '{$decodedData["property_data"]["developer"]}',
     '{$decodedData["property_data"]["chart_data"]}',
     '{$decodedData["property_data"]["map_data"]}',
     '{$decodedData["property_data"]["social_media_marketing_info"]}',
     '{$decodedData["property_data"]["board_marketing_info"]}',
     '{$decodedData["property_data"]["others_marketing_info"]}',
     '{$decodedData["property_data"]["bedroom_no"]}',
     '{$decodedData["property_data"]["unit_no"]}',
     '{$decodedData["property_data"]["parking_no"]}') "
        );

        echo "success.";
    } catch (\Throwable $th) {
        echo "something went wrong. $th.";
    }
}

?>
