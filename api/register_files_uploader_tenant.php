<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header(
    "Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept"
);

$postdata = file_get_contents("php://input");
if (!empty($postdata)) {
    $request = json_decode($postdata);

    mkdir("upload/doc/user/" . $request->unique_id, 0777, true);

    if (count($request->tenant_passportFiles) != 0) {
        for ($i = 0; $i < count($request->tenant_passportFiles); ++$i) {
            $tenant_passport_parts = explode(
                ";base64,",
                $request->tenant_passportFiles[$i]->data
            );
            $tenant_passport_type_aux = explode("/", $tenant_passport_parts[0]);
            $tenant_passport_base64 = base64_decode($tenant_passport_parts[1]);

            $fileNumber = $i + 1;

            $imgFile =
                "upload/doc/user/$request->unique_id/" .
                "tenant_passport" .
                "_" .
                $fileNumber .
                "." .
                $tenant_passport_type_aux[1];
            if (file_put_contents($imgFile, $tenant_passport_base64)) {
                $response[] = ["sts" => true, "msg" => "Successfully uploaded"];
            }
            echo json_encode($response);
        }
    }

    if (count($request->landlord_passportFiles) != 0) {
        for ($i = 0; $i < count($request->landlord_passportFiles); ++$i) {
            $landlord_passport_parts = explode(
                ";base64,",
                $request->landlord_passportFiles[$i]->data
            );
            $landlord_passport_type_aux = explode(
                "/",
                $landlord_passport_parts[0]
            );
            $landlord_passport_base64 = base64_decode(
                $landlord_passport_parts[1]
            );

            $fileNumber = $i + 1;

            $imgFile =
                "upload/doc/user/$request->unique_id/" .
                "landlord_passport" .
                "_" .
                $fileNumber .
                "." .
                $landlord_passport_type_aux[1];
            if (file_put_contents($imgFile, $landlord_passport_base64)) {
                $response[] = ["sts" => true, "msg" => "Successfully uploaded"];
            }
            echo json_encode($response);
        }
    }

    if (count($request->tenant_emiratesIdFiles) != 0) {
        for ($i = 0; $i < count($request->tenant_emiratesIdFiles); ++$i) {
            $tenant_emirates_id_parts = explode(
                ";base64,",
                $request->tenant_emiratesIdFiles[$i]->data
            );
            $tenant_emirates_id_type_aux = explode(
                "/",
                $tenant_emirates_id_parts[0]
            );
            $tenant_emirates_id_base64 = base64_decode(
                $tenant_emirates_id_parts[1]
            );

            $fileNumber = $i + 1;

            $imgFile =
                "upload/doc/user/$request->unique_id/" .
                "tenant_emirates_id" .
                "_" .
                $fileNumber .
                "." .
                $tenant_emirates_id_type_aux[1];
            if (file_put_contents($imgFile, $tenant_emirates_id_base64)) {
                $response[] = ["sts" => true, "msg" => "Successfully uploaded"];
            }
            echo json_encode($response);
        }
    }

    if ($request->original_tenancy_contract != "") {
        $original_tenancy_contract_parts = explode(
            ";base64,",
            $request->original_tenancy_contract
        );
        $original_tenancy_contract_type_aux = explode(
            "/",
            $original_tenancy_contract_parts[0]
        );
        $original_tenancy_contract_base64 = base64_decode(
            $original_tenancy_contract_parts[1]
        );

        $imgFile =
            "upload/doc/user/$request->unique_id/" .
            "original_tenancy_contract" .
            "." .
            $original_tenancy_contract_type_aux[1];
        if (file_put_contents($imgFile, $original_tenancy_contract_base64)) {
            $response[] = ["sts" => true, "msg" => "Successfully uploaded"];
        }
        echo json_encode($response);
    }

    if ($request->security_Deposit_reciept != "") {
        $security_Deposit_reciept_parts = explode(
            ";base64,",
            $request->security_Deposit_reciept
        );
        $security_Deposit_reciept_type_aux = explode(
            "/",
            $security_Deposit_reciept_parts[0]
        );
        $security_Deposit_reciept_base64 = base64_decode(
            $security_Deposit_reciept_parts[1]
        );

        $imgFile =
            "upload/doc/user/$request->unique_id/" .
            "security_Deposit_reciept" .
            "." .
            $security_Deposit_reciept_type_aux[1];
        if (file_put_contents($imgFile, $security_Deposit_reciept_base64)) {
            $response[] = ["sts" => true, "msg" => "Successfully uploaded"];
        }
        echo json_encode($response);
    }

    if ($request->copy_of_valid_power_of_attorney_document != "") {
        $copy_of_valid_power_of_attorney_document_parts = explode(
            ";base64,",
            $request->copy_of_valid_power_of_attorney_document
        );
        $copy_of_valid_power_of_attorney_document_type_aux = explode(
            "/",
            $copy_of_valid_power_of_attorney_document_parts[0]
        );
        $copy_of_valid_power_of_attorney_document_base64 = base64_decode(
            $copy_of_valid_power_of_attorney_document_parts[1]
        );

        $imgFile =
            "upload/doc/user/$request->unique_id/" .
            "copy_of_valid_power_of_attorney_document" .
            "." .
            $copy_of_valid_power_of_attorney_document_type_aux[1];
        if (
            file_put_contents(
                $imgFile,
                $copy_of_valid_power_of_attorney_document_base64
            )
        ) {
            $response[] = ["sts" => true, "msg" => "Successfully uploaded"];
        }
        echo json_encode($response);
    }

    if ($request->title_Deed_doc != "") {
        $title_Deed_doc_parts = explode(";base64,", $request->title_Deed_doc);
        $title_Deed_doc_type_aux = explode("/", $title_Deed_doc_parts[0]);
        $title_Deed_doc_base64 = base64_decode($title_Deed_doc_parts[1]);

        $imgFile =
            "upload/doc/user/$request->unique_id/" .
            "title_Deed_doc" .
            "." .
            $title_Deed_doc_type_aux[1];
        if (file_put_contents($imgFile, $title_Deed_doc_base64)) {
            $response[] = ["sts" => true, "msg" => "Successfully uploaded"];
        }
        echo json_encode($response);
    }

    if ($request->tenants_Visa_Copy != "") {
        $tenants_Visa_Copy_parts = explode(
            ";base64,",
            $request->tenants_Visa_Copy
        );
        $tenants_Visa_Copy_type_aux = explode("/", $tenants_Visa_Copy_parts[0]);
        $tenants_Visa_Copy_base64 = base64_decode($tenants_Visa_Copy_parts[1]);

        $imgFile =
            "upload/doc/user/$request->unique_id/" .
            "tenants_Visa_Copy" .
            "." .
            $tenants_Visa_Copy_type_aux[1];
        if (file_put_contents($imgFile, $tenants_Visa_Copy_base64)) {
            $response[] = ["sts" => true, "msg" => "Successfully uploaded"];
        }
        echo json_encode($response);
    }
}
