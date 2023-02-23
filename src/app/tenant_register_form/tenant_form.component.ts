import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatStepper } from "@angular/material/stepper";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { SuccessDialogRegister } from "app/components/success-dialog/success_dialog";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { UserService } from "app/services/user.service";
import * as CryptoJS from "crypto-js";
import { first } from "rxjs";
import * as uuid from "uuid";
import { StepperTenantRegisterFirst } from "./components/stepper_01_reg_tenant/stepper_first_reg_tenant";
import { StepperTenantRegisterSecond } from "./components/stepper_02_reg_tenant/stepper_second_reg_tenant";
import { StepperTenantRegisterThird } from "./components/stepper_03_reg_tenant/stepper_third_reg_tenant";

@Component({
  selector: "tenant-register-form",
  templateUrl: "./tenant_form.component.html",
  styleUrls: ["./tenant_form.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class TenantFormComponent implements OnInit {
  registerForm: FormGroup;
  auth_type: any = "";

  isloading: boolean = false;

  @ViewChild(StepperTenantRegisterFirst)
  firstStepper: StepperTenantRegisterFirst;
  @ViewChild(StepperTenantRegisterSecond)
  secondStepper: StepperTenantRegisterSecond;
  @ViewChild(StepperTenantRegisterThird)
  thirdStepper: StepperTenantRegisterThird;
  @ViewChild(MatStepper) matStepper: MatStepper;

  @ViewChild("tenantRegStepper")
  stepper: MatStepper;

  tenantRegStep01Form: FormGroup;
  tenantRegStep02Form: FormGroup;
  tenantRegStep03Form: FormGroup;

  isFormNotFilled: boolean = false;
  stepperInitialized: boolean = false;
  isAllDocumentsNotUploaded: boolean = false;

  selectedIndex: number;
  currentIndex: number;

  isRegistering: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialog?: MatDialog
  ) {}

  ngOnInit() {
    this.currentIndex = 0;
    // this.selectedIndex = 2;
  }

  ngDoCheck() {
    if (this.stepperInitialized == true) {
      this.currentIndex = this.stepper.selectedIndex;
    }
  }

  ngAfterViewInit(): void {
    this.tenantRegStep01Form = this.firstStepper.form;
    this.tenantRegStep02Form = this.secondStepper.form;
    this.tenantRegStep03Form = this.thirdStepper.form;

    setTimeout(() => {
      this.isloading = false;
      this.stepperInitialized = true;
    }, 500);
  }

  stepperPreviousClick() {
    this.stepper.previous();
    if (this.currentIndex == 1) {
      this.currentIndex = 0;
    } else if (this.currentIndex == 2) {
      this.currentIndex = 1;
    }
  }

  cancelRegistration() {
    this.router.navigate(["/register"]);
  }

  stepperNextClick() {
    if (this.currentIndex == 0) {
      if (this.firstStepper.form.valid) {
        this.isFormNotFilled = false;
        this.currentIndex = 1;
        this.stepper.next();
      } else {
        this.isFormNotFilled = true;

        setTimeout(() => {
          this.isFormNotFilled = false;
        }, 4000);
      }
    } else if (this.currentIndex == 1) {
      if (this.secondStepper.form.valid) {
        this.isFormNotFilled = false;
        this.currentIndex = 2;
        this.stepper.next();
      } else {
        this.isFormNotFilled = true;

        setTimeout(() => {
          this.isFormNotFilled = false;
        }, 4000);
      }
    }
  }

  // this.loading = true;
  async register() {
    var unique_id = uuid.v4();

    if (
      this.thirdStepper.tenant_passPortPics.length == 0 ||
      this.thirdStepper.landlord_passPortPics.length == 0 ||
      this.thirdStepper.tenant_emiratesIDPics.length == 0 ||
      this.thirdStepper.copy_of_valid_power_of_attorney_document == "" ||
      this.thirdStepper.original_tenancy_contract == "" ||
      this.thirdStepper.tenants_Visa_Copy == "" ||
      this.thirdStepper.title_Deed_doc == "" ||
      this.thirdStepper.security_Deposit_reciept == ""
    ) {
      this.isAllDocumentsNotUploaded = true;

      setTimeout(() => {
        this.isAllDocumentsNotUploaded = false;
      }, 4000);
    } else {
      this.isRegistering = true;

      var allDocFiles = {
        unique_id: unique_id,
        tenant_passportFiles: this.thirdStepper.tenant_passPortPics,
        landlord_passportFiles: this.thirdStepper.landlord_passPortPics,
        tenant_emiratesIdFiles: this.thirdStepper.tenant_emiratesIDPics,
        original_tenancy_contract:
          this.thirdStepper.original_tenancy_contract["data"],
        security_Deposit_reciept:
          this.thirdStepper.security_Deposit_reciept["data"],
        copy_of_valid_power_of_attorney_document:
          this.thirdStepper.copy_of_valid_power_of_attorney_document["data"],
        title_Deed_doc: this.thirdStepper.title_Deed_doc["data"],
        tenants_Visa_Copy: this.thirdStepper.tenants_Visa_Copy["data"],
      };

      const REQUEST_TYPE = "NEW_TENANT_ACC";

      var tenant_passportPic1Ext =
        this.thirdStepper.tenant_passPortPics[0]["ext"];

      if (this.thirdStepper.tenant_passPortPics.length == 2) {
        var tenant_passportPic2Ext =
          this.thirdStepper.tenant_passPortPics[1]["ext"];
      }

      var landlord_passportPic1Ext =
        this.thirdStepper.landlord_passPortPics[0]["ext"];

      if (this.thirdStepper.landlord_passPortPics.length == 2) {
        var landlord_passportPic2Ext =
          this.thirdStepper.landlord_passPortPics[1]["ext"];
      }

      var tenant_emiratesIDPic1Ext =
        this.thirdStepper.tenant_emiratesIDPics[0]["ext"];

      if (this.thirdStepper.tenant_emiratesIDPics.length == 2) {
        var tenant_emiratesIDPic2Ext =
          this.thirdStepper.tenant_emiratesIDPics[1]["ext"];
      }

      var original_tenancy_contractExt =
        this.thirdStepper.original_tenancy_contract["ext"];
      var security_Deposit_recieptExt =
        this.thirdStepper.security_Deposit_reciept["ext"];
      var copy_of_valid_power_of_attorney_documentExt =
        this.thirdStepper.copy_of_valid_power_of_attorney_document["ext"];
      var tenants_Visa_CopyExt = this.thirdStepper.tenants_Visa_Copy["ext"];
      var title_Deed_docExt = this.thirdStepper.title_Deed_doc["ext"];

      var requestDetails = {
        request_type: REQUEST_TYPE,
        firstname: this.firstStepper.form.value.firstname,
        lastname: this.firstStepper.form.value.lastname,
        auth_type: "tenant",
        email: this.firstStepper.form.value.email,
        nationality: this.firstStepper.form.value.nationality,
        passport_no: this.firstStepper.form.value.passportNo,
        passport_exp: this.firstStepper.form.value.passportExpiry,
        phone_number: this.firstStepper.form.value.mobileNumber,
        address: this.firstStepper.form.value.address,
        city: this.firstStepper.form.value.city,
        state: this.firstStepper.form.value.state,

        propertyUsage: this.secondStepper.form.value.propertyUsage,
        landlordName: this.secondStepper.form.value.landlordName,
        buildingName: this.secondStepper.form.value.buildingName,
        contract_to: this.secondStepper.form.value.contract_to,
        contract_from: this.secondStepper.form.value.contract_from,
        property_size: this.secondStepper.form.value.property_size,
        property_type: this.secondStepper.form.value.property_type,
        propertyNo: this.secondStepper.form.value.propertyNo,
        location: this.secondStepper.form.value.location,
        premisesNo: this.secondStepper.form.value.premisesNo,
        annualRent: this.secondStepper.form.value.annualRent,
        contractValue: this.secondStepper.form.value.contractValue,
        security_deposit_amnt:
          this.secondStepper.form.value.security_deposit_amnt,
        mode_of_payment: this.secondStepper.form.value.mode_of_payment,

        request_details_id: unique_id,
        tenant_passport_pics:
          this.thirdStepper.tenant_passPortPics.length == 2
            ? JSON.stringify({
                pic1:
                  unique_id +
                  "/" +
                  "tenant_passport_1" +
                  "." +
                  tenant_passportPic1Ext,
                pic2:
                  unique_id +
                  "/" +
                  "tenant_passport_2" +
                  "." +
                  tenant_passportPic2Ext,
              })
            : JSON.stringify({
                pic1:
                  unique_id +
                  "/" +
                  "tenant_passport_1" +
                  "." +
                  tenant_passportPic1Ext,
              }),
        landlord_passport_pics:
          this.thirdStepper.landlord_passPortPics.length == 2
            ? JSON.stringify({
                pic1:
                  unique_id +
                  "/" +
                  "landlord_passport_1" +
                  "." +
                  landlord_passportPic1Ext,
                pic2:
                  unique_id +
                  "/" +
                  "landlord_passport_2" +
                  "." +
                  landlord_passportPic2Ext,
              })
            : JSON.stringify({
                pic1:
                  unique_id +
                  "/" +
                  "landlord_passport_1" +
                  "." +
                  landlord_passportPic1Ext,
              }),
        tenant_emirates_id_pics:
          this.thirdStepper.tenant_emiratesIDPics.length == 2
            ? JSON.stringify({
                pic1:
                  unique_id +
                  "/" +
                  "tenant_emirates_id_1" +
                  "." +
                  tenant_emiratesIDPic1Ext,
                pic2:
                  unique_id +
                  "/" +
                  "tenant_emirates_id_2" +
                  "." +
                  tenant_emiratesIDPic2Ext,
              })
            : JSON.stringify({
                pic1:
                  unique_id +
                  "/" +
                  "tenant_emirates_id_1" +
                  "." +
                  tenant_emiratesIDPic1Ext,
              }),

        original_tenancy_contract:
          unique_id +
          "/" +
          "original_tenancy_contract" +
          "." +
          original_tenancy_contractExt,
        security_Deposit_reciept:
          unique_id +
          "/" +
          "security_Deposit_reciept" +
          "." +
          security_Deposit_recieptExt,
        copy_of_valid_power_of_attorney_document:
          unique_id +
          "/" +
          "power_of_attorney" +
          "." +
          copy_of_valid_power_of_attorney_documentExt,
        tenants_Visa_Copy:
          unique_id + "/" + "tenants_Visa" + "." + tenants_Visa_CopyExt,
        title_Deed_doc:
          unique_id + "/" + "title_Deed_doc" + "." + title_Deed_docExt,
        approved: "false",
        expired: "false",
      };

      await this.uploadFiles(allDocFiles).then(() => {
        this.userService
          .request_register_tenant(JSON.stringify(requestDetails))
          .subscribe((e) => {
            console.log(e);
          });

        setTimeout(() => {
          this.isRegistering = false;
          this.dialog.open(SuccessDialogRegister, {
            width: "700px",
            height: "450px",
          });
        }, 5000);
      });
    }
  }

  async uploadFiles(allDocFiles) {
    this.apiService
      .saveTenantRegisterUploadFiles(JSON.stringify(allDocFiles))
      .subscribe((e) => {
        console.log(e);
      });
  }

  // readFile(event: any) {
  //   var file = event.target.files[0];

  //   var reader = new FileReader();
  //   reader.readAsArrayBuffer(file);

  //   reader.onloadend = (e) => {
  //     var buffer = e.target.result;
  //     var blob = new Blob([buffer], { type: "image/jpeg" });

  //     console.log(blob);

  //     // this.apiService.downloadFile(blob, "profile-img", "jpg");
  //   };
  // }
}
