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
import { StepperLandlordRegisterFirst } from "./components/stepper_01_reg_landlord/stepper_first_reg_landlord";
import { StepperLandlordRegisterSecond } from "./components/stepper_02_reg_landlord/stepper_second_reg_landlord";
import { StepperLandlordRegisterThird } from "./components/stepper_03_reg_landlord/stepper_third_reg_landlord";

@Component({
  selector: "landlord-register-form",
  templateUrl: "./landlord_form.component.html",
  styleUrls: ["./landlord_form.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class LandlordFormComponent implements OnInit {
  secretKey = "fiUIXSU3ZHVtMZADtUaIGxLVUKZAjjlf";
  registerForm: FormGroup;
  auth_type: any = "";

  isloading: boolean = false;

  @ViewChild(StepperLandlordRegisterFirst)
  firstStepper: StepperLandlordRegisterFirst;
  @ViewChild(StepperLandlordRegisterSecond)
  secondStepper: StepperLandlordRegisterSecond;
  @ViewChild(StepperLandlordRegisterThird)
  thirdStepper: StepperLandlordRegisterThird;
  @ViewChild(MatStepper) matStepper: MatStepper;

  @ViewChild("LandlordRegStepper")
  stepper: MatStepper;

  LandlordRegStep01Form: FormGroup;
  LandlordRegStep02Form: FormGroup;
  LandlordRegStep03Form: FormGroup;

  isFormNotFilled: boolean = false;
  stepperInitialized: boolean = false;
  isAllDocumentsNotUploaded: boolean = false;

  selectedIndex: number;
  // currentIndex: number;

  isRegistering: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialog?: MatDialog
  ) {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    if (user != null) {
      if (user[0]["auth_type"] != "admin") {
        router.navigate(["/home"]);
      } else {
        router.navigate(["/admin-dashboard"]);
      }
    }
  }

  ngOnInit() {
    // this.currentIndex = 0;
    this.selectedIndex = 0;
  }

  // ngDoCheck() {
  //   if (this.stepperInitialized == true && this.isRegistering == false) {
  //     this.currentIndex = this.stepper.selectedIndex;
  //   }
  // }

  ngAfterViewInit(): void {
    this.LandlordRegStep01Form = this.firstStepper.form;
    this.LandlordRegStep02Form = this.secondStepper.form;
    this.LandlordRegStep03Form = this.thirdStepper.form;

    setTimeout(() => {
      this.isloading = false;
      this.stepperInitialized = true;
    }, 500);
  }

  stepperPreviousClick() {
    this.stepper.previous();
    if (this.selectedIndex == 1) {
      this.selectedIndex = 0;
    } else if (this.selectedIndex == 2) {
      this.selectedIndex = 1;
    }
  }

  cancelRegistration() {
    this.router.navigate(["/register"]);
  }

  stepperNextClick() {
    if (this.selectedIndex == 0) {
      if (this.firstStepper.form.valid) {
        this.isFormNotFilled = false;
        this.selectedIndex = 1;
        this.stepper.next();
      } else {
        this.isFormNotFilled = true;

        setTimeout(() => {
          this.isFormNotFilled = false;
        }, 4000);
      }
    } else if (this.selectedIndex == 1) {
      if (this.secondStepper.form.valid) {
        this.isFormNotFilled = false;
        this.selectedIndex = 2;
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
      var allDocFiles = {
        unique_id: unique_id,
        passportFiles: this.thirdStepper.passPortPics,
        emiratesIdFiles: this.thirdStepper.emiratesIDPics,
        salesDeedDoc: this.thirdStepper.salesDeedDoc["data"],
        ownerShipDoc: this.thirdStepper.ownerShipDoc["data"],
        user_signature: this.secondStepper.secondPartySignature,
      };

      const REQUEST_TYPE = "NEW_LANDLORD_ACC";

      var propertyDetails = {
        user_id: "",
        request_type: REQUEST_TYPE,
        unique_id: unique_id,
        property_state: this.secondStepper.propertyState,
        offer_validity: this.secondStepper.form.value.offerValidity,
        furnish_details: this.secondStepper.form.value.furnishDetails,
        title_deed_number: this.secondStepper.form.value.titleDeedNo,
        project_name: this.secondStepper.form.value.projectName,
        community: this.secondStepper.form.value.community,
        building_name: "",
        size_area: this.secondStepper.form.value.sizeArea,
        bedroom_no: this.secondStepper.form.value.bedroomNo,
        unit_number: this.secondStepper.form.value.unitNo,
        car_parking_no: this.secondStepper.form.value.carparkingNo,
        additional_info: this.secondStepper.form.value.additionalInfo,

        // property images and doc
        property_image_1_name: "",
        property_image_2_name: "",
        property_image_3_name: "",
        property_image_4_name: "",
        property_image_5_name: "",
        property_doc_1_name: "",
        property_doc_2_name: "",
        property_doc_3_name: "",
        property_doc_4_name: "",

        social_media_marketing_info: this.secondStepper.form.value.marketing01,
        board_marketing_info: this.secondStepper.form.value.marketing02,
        others_marketing_info: this.secondStepper.form.value.marketing03,
        valid_until: this.secondStepper.form.value.validUntil,
        second_party_signature_name:
          unique_id +
          "/" +
          "user_signature" +
          "." +
          this.secondStepper.secondPartySignatureExt,
        approved: "false",
        expired: "false",
        declined: "false",
      };

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
        declined: "false",
      };

      await this.uploadFiles(allDocFiles).then(() => {
        this.apiService
          .requestAddPropertyLandlord(JSON.stringify(propertyDetails))
          .subscribe((e) => {
            console.log(e);
          });

        this.userService
          .request_register(JSON.stringify(requestDetails))
          .subscribe((e) => {
            console.log(e);
          });

        setTimeout(() => {
          setTimeout(() => {
            this.isRegistering = false;
          }, 2000);
          this.dialog.open(SuccessDialogRegister, {
            width: "730px",
            height: "430px",
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
