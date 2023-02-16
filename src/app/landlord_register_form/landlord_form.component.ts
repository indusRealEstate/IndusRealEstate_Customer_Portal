import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
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

  selectedIndex: number;
  currentIndex: number;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
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
    this.LandlordRegStep01Form = this.firstStepper.form;
    this.LandlordRegStep02Form = this.secondStepper.form;
    this.LandlordRegStep03Form = this.thirdStepper.form;

    setTimeout(() => {
      this.isloading = false;
      this.stepperInitialized = true;
    }, 1000);
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

  async makeRandom(lengthOfCode: number, possible: string) {
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  // this.loading = true;
  async register() {
    console.log(this.firstStepper.form.value);
    console.log(this.secondStepper.form.value);
    // var userId = uuid.v4();
    const REQUEST_TYPE = "NEW_LANDLORD_ACC";

    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-#@$%&";
    const lengthOfCode = 40;
    var unique_id = await this.makeRandom(lengthOfCode, possible);

    var propertyDetails = {
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
      second_party_signature: this.secondStepper.secondPartySignatureName,
      approved: "false",
    };

    var requestDetails = {
      firstname: this.firstStepper.form.value.firstname,
      lastname: this.firstStepper.form.value.lastname,
      email: this.firstStepper.form.value.email,
      nationality: this.firstStepper.form.value.nationality,
      passport_no: this.firstStepper.form.value.passportNo,
      passport_exp: this.firstStepper.form.value.passportExpiry,
      phone_number: this.firstStepper.form.value.mobileNumber,
      address: this.firstStepper.form.value.address,
      city: this.firstStepper.form.value.city,
      state: this.firstStepper.form.value.state,

      request_details_id: unique_id,
      passport_front_pic: "",
      passport_back_pic: "",
      emirates_id_front_pic: "",
      emirates_id_back_pic: "",
      ownership_doc: "",
      sales_deed_doc: "",
    };

    // if (
    //   this.firstStepper.form.valid &&
    //   this.secondStepper.form.valid &&
    //   this.thirdStepper.allDocsCollected == true
    // ) {
    //   this.userService
    //     .register(this.registerForm.value, userId, this.auth_type, userDetails)
    //     .pipe(first())
    //     .subscribe(
    //       (data) => {
    //         // this.alertService.success("Registration successful", true);

    //         if (data == null) {
    //           this.userService.addUserDetails(userDetails).subscribe((e) => {
    //             if (e == true) {
    //               this.router.navigate(["/login"]);
    //             }
    //           });
    //         }
    //       },
    //       (error) => {
    //         // this.alertService.error(error);
    //         console.log(error);
    //         // this.loading = false;
    //       }
    //     );
    // }
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
