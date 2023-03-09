import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { DocUploadDialogRegister } from "app/components/dialog/dialog";

@Component({
  selector: "stepper-three-tenant-reg",
  styleUrls: ["./stepper_third_reg_tenant.scss"],
  templateUrl: "./stepper_third_reg_tenant.html",
})
export class StepperTenantRegisterThird {
  form: FormGroup;

  original_tenancy_contract: any = "";
  security_Deposit_reciept: any = "";
  copy_of_valid_power_of_attorney_document: any = "";
  tenants_Visa_Copy: any = "";
  title_Deed_doc: any = "";
  
  tenant_emiratesIDPics: any[] = [];
  landlord_passPortPics: any[] = [];
  tenant_passPortPics: any[] = [];

  

  constructor(private formBuilder: FormBuilder, private dialog?: MatDialog) {}

  ngOnInit(): void {}

  openDialog(upload: any) {
    this.dialog
      .open(DocUploadDialogRegister, {
        width: "700px",
        height: "450px",
        data: { upload: upload, auth: "tenant" },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res["doc"] == "tenant_passport") {
          for (let e of res["data"]) {
            this.tenant_passPortPics.push(e);
          }
        } else if (res["doc"] == "landlord_passport") {
          for (let e of res["data"]) {
            this.landlord_passPortPics.push(e);
          }
        } else if (res["doc"] == "tenant_emirates_id") {
          for (let e of res["data"]) {
            this.tenant_emiratesIDPics.push(e);
          }
        } else if (res["doc"] == "tenant_visa") {
          this.tenants_Visa_Copy = res["data"];
        } else if (res["doc"] == "title_deed_doc") {
          this.title_Deed_doc = res["data"];
        } else if (res["doc"] == "power_of_attorney") {
          this.copy_of_valid_power_of_attorney_document = res["data"];
        } else if (res["doc"] == "security_deposit") {
          this.security_Deposit_reciept = res["data"];
        } else if (res["doc"] == "tenancy_contract") {
          this.original_tenancy_contract = res["data"];
        }
      });
  }

  clearDocs(docName) {
    if (docName == "landlord_passport") {
      this.landlord_passPortPics.length = 0;
    } else if (docName == "tenant_passport") {
      this.tenant_passPortPics.length = 0;
    } else if (docName == "tenant_emirates_id") {
      this.tenant_emiratesIDPics.length = 0;
    } else if (docName == "tenant_visa") {
      this.tenants_Visa_Copy = "";
    } else if (docName == "title_deed_doc") {
      this.title_Deed_doc = "";
    } else if (docName == "power_of_attorney") {
      this.copy_of_valid_power_of_attorney_document = "";
    } else if (docName == "security_deposit") {
      this.security_Deposit_reciept = "";
    } else if (docName == "tenancy_contract") {
      this.original_tenancy_contract = "";
    }
  }
}
