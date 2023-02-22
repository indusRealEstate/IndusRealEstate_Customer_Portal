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
  secretKey = "fiUIXSU3ZHVtMZADtUaIGxLVUKZAjjlf";
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
    this.selectedIndex = 2;
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
      this.thirdStepper.passPortPics.length == 0 ||
      this.thirdStepper.emiratesIDPics.length == 0 ||
      this.thirdStepper.salesDeedDoc == "" ||
      this.thirdStepper.ownerShipDoc == ""
    ) {
      this.isAllDocumentsNotUploaded = true;

      setTimeout(() => {
        this.isAllDocumentsNotUploaded = false;
      }, 4000);
    } else {
      this.isRegistering = true;
      var allDocFiles = {};

      const REQUEST_TYPE = "NEW_LANDLORD_ACC";

      var passportPic1Ext = this.thirdStepper.passPortPics[0]["ext"];

      if (this.thirdStepper.passPortPics.length == 2) {
        var passportPic2Ext = this.thirdStepper.passPortPics[1]["ext"];
      }

      var emiratesIDPic1Ext = this.thirdStepper.emiratesIDPics[0]["ext"];

      if (this.thirdStepper.emiratesIDPics.length == 2) {
        var emiratesIDPic2Ext = this.thirdStepper.emiratesIDPics[1]["ext"];
      }

      var salesDeedExt = this.thirdStepper.salesDeedDoc["ext"];
      var ownershipDocExt = this.thirdStepper.ownerShipDoc["ext"];

      var requestDetails = {
        request_type: REQUEST_TYPE,
        firstname: this.firstStepper.form.value.firstname,
        lastname: this.firstStepper.form.value.lastname,
        auth_type: "landlord",
        email: this.firstStepper.form.value.email,
        nationality: this.firstStepper.form.value.nationality,
        passport_no: this.firstStepper.form.value.passportNo,
        passport_exp: this.firstStepper.form.value.passportExpiry,
        phone_number: this.firstStepper.form.value.mobileNumber,
        address: this.firstStepper.form.value.address,
        city: this.firstStepper.form.value.city,
        state: this.firstStepper.form.value.state,

        request_details_id: unique_id,
        passport_pics:
          this.thirdStepper.passPortPics.length == 2
            ? JSON.stringify({
                pic1: unique_id + "/" + "passport_1" + "." + passportPic1Ext,
                pic2: unique_id + "/" + "passport_2" + "." + passportPic2Ext,
              })
            : JSON.stringify({
                pic1: unique_id + "/" + "passport_1" + "." + passportPic1Ext,
              }),
        emirates_id_pics:
          this.thirdStepper.emiratesIDPics.length == 2
            ? JSON.stringify({
                pic1:
                  unique_id + "/" + "emirates_id_1" + "." + emiratesIDPic1Ext,
                pic2:
                  unique_id + "/" + "emirates_id_2" + "." + emiratesIDPic2Ext,
              })
            : JSON.stringify({
                pic1:
                  unique_id + "/" + "emirates_id_1" + "." + emiratesIDPic1Ext,
              }),
        ownership_doc: unique_id + "/" + "ownership" + "." + ownershipDocExt,
        sales_deed_doc: unique_id + "/" + "sales_deed" + "." + salesDeedExt,
        approved: "false",
        expired: "false",
      };

      await this.uploadFiles(allDocFiles).then(() => {
        // this.apiService
        //   .requestAddPropertyLandlord(JSON.stringify(propertyDetails))
        //   .subscribe((e) => {
        //     console.log(e);
        //   });

        this.userService
          .request_register(JSON.stringify(requestDetails))
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
      .saveLandlordRegisterUploadFiles(JSON.stringify(allDocFiles))
      .subscribe((e) => {
        console.log(e);
      });
  }

  // decrypt(textToDecrypt: string) {
  //   try {
  //     return CryptoJS.AES.decrypt(
  //       textToDecrypt,
  //       this.secretKey.trim()
  //     ).toString(CryptoJS.enc.Utf8);
  //   } catch (error) {
  //     return "decryption-failed";
  //   }
  // }

  readFile(event: any) {
    var file = event.target.files[0];

    var reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = (e) => {
      var buffer = e.target.result;
      var blob = new Blob([buffer], { type: "image/jpeg" });

      console.log(blob);

      // this.apiService.downloadFile(blob, "profile-img", "jpg");
    };
  }
}
