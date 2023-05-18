<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header(
    "Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept"
);
header("Content-Type: application/json; charset=UTF-8");

$postdata = file_get_contents("php://input");
if (!empty($postdata)) {
    $request = json_decode($postdata);

    $to = $request->mail;
    $from = "ireproperty@vps42733.inmotionhosting.com";
    $fromName = "Indus Real Estate";

    $subject = "Verify your Indus Real Estate customer portal account";

    $htmlContent = file_get_contents('html_templates/landlord_reg.html');

    $rawContent = print_processed_html($htmlContent, $request->name, $request->unique_id, $request->auth_type);

    $jsContent = json_decode($rawContent);


    // Set content-type header for sending HTML email
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

    // Additional headers
    $headers .= "From: " . $fromName . "<" . $from . ">" . "\r\n";
    $headers .= "Cc: welcome@example.com" . "\r\n";
    $headers .= "Bcc: welcome2@example.com" . "\r\n";

    // Send email
    if (mail($to, $subject, $jsContent->replacedString, $headers)) {
        echo $jsContent->enc;
    } else {
        echo "Email sending failed.";
    }
}

function print_processed_html($string, $name, $unique_id, $auth_type)
{ 
    $search  = "[name]";
    $replace = $name;

    $processed_string = str_replace($search, $replace , $string);

    $ciphering = "AES-128-CBC";
  
    // Use OpenSSl Encryption method
    $iv_length = openssl_cipher_iv_length($ciphering);
    $options = 0;
  
    // Non-NULL Initialization Vector for encryption
    $encryption_iv = 'Zq4t7w9z$C&F)J@N';
  
    // Store the encryption key
    $encryption_key = "McQfTjWnZr4u7x!A";

    $enc->unique_id = $unique_id;
    $enc->auth_type = $auth_type;
  
    // Use openssl_encrypt() function to encrypt the data
    $encryption = openssl_encrypt(json_encode($enc), $ciphering,
    $encryption_key, $options, $encryption_iv);

    $replacedEnc = replaceEncBase64($encryption);


    $search2  = "href='#'";
    $replace2 = "href='https://indusre.app/#/email-verification?token=$replacedEnc'";

    $processed_string2 = str_replace($search2, $replace2 , $processed_string);

    $myObj->enc = $encryption;
    $myObj->replacedString = $processed_string2;

    $myJSON = json_encode($myObj);

    return $myJSON;
 }

 function replaceEncBase64($enc){
   $search1 = "/";
   $replace1 = "-";
   
   $processed_string1 = str_replace($search1, $replace1 , $enc);

   $search2 = "+";
   $replace2 = "#";
   
   $processed_string2 = str_replace($search2, $replace2 , $processed_string1);

   $search3 = "=";
   $replace3 = "&";
   
   $processed_string3 = str_replace($search3, $replace3 , $processed_string2);

   return $processed_string3;

 }

?>
