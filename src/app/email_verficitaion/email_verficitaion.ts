import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from "app/services/alert.service";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { EmailServices } from "app/services/email.service";
import { UserService } from "app/services/user.service";
import * as CryptoJS from "crypto-js";
import { first } from "rxjs";
import { interval as observableInterval } from "rxjs";
import { takeWhile, scan, tap } from "rxjs/operators";
import { RegisterSuccessDialog } from "./register_success_dialog/register_success_dialog";
// import { RegisterSuccessDialog } from "./register_success_dialog/register_success_dialog";

@Component({
  selector: "email-verficitaion",
  templateUrl: "./email_verficitaion.html",
  styleUrls: ["./email_verficitaion.scss"],
})
export class EmailVerification implements OnInit {
  registerForm: FormGroup;

  isLoading: boolean = false;
  isTokenVerified: boolean = false;
  isTokenExpired: boolean = false;

  isUsernameNotAvailable: boolean = false;
  isPasswordNot6letters: boolean = false;
  isRetypePassWrong: boolean = false;
  isFormEmpty: boolean = false;
  alluniqueIds: any[] = [];
  currentNewUserAllDetails: any;
  allUserNames: any[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private emailService: EmailServices,
    private authServices: AuthenticationService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialog?: MatDialog
  ) {
    this.isLoading = true;
    var userData = localStorage.getItem("currentUser");

    if (userData == null) {
      this.route.queryParams.subscribe(async (e) => {
        var replacedText = this.replaceAllStringsEnc(e["token"]);

        var raw_auth_data = this.decrypt(replacedText);
        console.log(raw_auth_data);
        var auth_data = JSON.parse(raw_auth_data);

        // console.log(auth_data);

        this.emailService
          .getAllNewAuthRequests()
          .subscribe(async (res: Array<any>) => {
            var limit = 0;
            for (let e of res) {
              limit++;
              this.alluniqueIds.push(e.request_details_id);
            }

            if (limit == res.length) {
              if (this.alluniqueIds.includes(auth_data.unique_id)) {
                console.log("success");
                console.log(auth_data);
                this.isTokenVerified = true;
                this.registerForm = this.formBuilder.group({
                  username: ["", [Validators.required]],
                  pass: ["", [Validators.required]],
                  pass_retype: ["", [Validators.required]],
                });

                await this.fetchNewUserData(
                  auth_data.unique_id,
                  auth_data.auth_type
                );
              } else {
                console.log("error");
                this.isTokenVerified = false;
                this.isLoading = false;
              }
            }
          });
      });
    } else {
      router.navigate(["/"]);
    }
  }

  async fetchNewUserData(unique_id, auth_type) {
    if (auth_type == "landlord") {
      this.authServices
        .fetchNewLandlordAllDetails(JSON.stringify({ unique_id: unique_id }))
        .subscribe((allDetails) => {
          this.currentNewUserAllDetails = allDetails[0];
          Object.assign(this.currentNewUserAllDetails, {
            propertyDetails: allDetails[1],
          });
        });
    } else if (auth_type == "tenant") {
      this.authServices
        .fetchNewTenantAllDetails(JSON.stringify({ unique_id: unique_id }))
        .subscribe((allDetails) => {
          this.currentNewUserAllDetails = allDetails[0];
        });

      console.log(this.currentNewUserAllDetails);
    }

    this.emailService
      .getAllUsersForChecking()
      .subscribe((allUsers: Array<any>) => {
        for (let user of allUsers) {
          this.allUserNames.push(user.username);
        }
      });

    setTimeout(() => {
      if (this.currentNewUserAllDetails.expired == "true") {
        this.isTokenExpired = true;
      }
      this.isLoading = false;
    }, 2000);
  }

  replaceAllStringsEnc(enc: string) {
    var replaced1 = enc.replace(/-/g, "/");
    var replaced2 = replaced1.replace(/#/g, "+");
    var replaced3 = replaced2.replace(/&/g, "=");

    return replaced3;
  }

  ngOnInit() {
    // console.log(this.registerForm.value);
    // console.log(this.auth_type);
  }

  onSubmit() {
    if (this.currentNewUserAllDetails.auth_type == "landlord") {
      if (
        this.currentNewUserAllDetails != null &&
        this.currentNewUserAllDetails.propertyDetails != null
      ) {
        if (!this.registerForm.invalid) {
          if (this.allUserNames.includes(this.registerForm.value.username)) {
            this.isUsernameNotAvailable = true;

            setTimeout(() => {
              this.isUsernameNotAvailable = false;
            }, 3000);
          } else {
            console.log("username is available");
            this.isUsernameNotAvailable = false;

            if (new String(this.registerForm.value.pass).length < 6) {
              this.isPasswordNot6letters = true;
              setTimeout(() => {
                this.isPasswordNot6letters = false;
              }, 3000);
            } else {
              if (
                this.registerForm.value.pass !=
                this.registerForm.value.pass_retype
              ) {
                this.isRetypePassWrong = true;
                setTimeout(() => {
                  this.isRetypePassWrong = false;
                }, 3000);
              } else {
                this.isLoading = true;
                var data = this.setOutData();

                this.authServices.addNewLandlord(data).subscribe((res) => {
                  console.log(res);
                });

                var expireToken_data = {
                  expired: "true",
                  unique_id: this.currentNewUserAllDetails.request_details_id,
                  auth_type: "landlord",
                };
                this.emailService
                  .expireRegisterToken(JSON.stringify(expireToken_data))
                  .subscribe((e) => {});

                this.dialog.open(RegisterSuccessDialog, {
                  width: "400px",
                  height: "260px",
                });
              }
            }
          }
        } else {
          this.isFormEmpty = true;
          setTimeout(() => {
            this.isFormEmpty = false;
          }, 3000);
        }
      }
    } else if (this.currentNewUserAllDetails.auth_type == "tenant") {
      if (this.currentNewUserAllDetails != null) {
        if (!this.registerForm.invalid) {
          if (this.allUserNames.includes(this.registerForm.value.username)) {
            this.isUsernameNotAvailable = true;

            setTimeout(() => {
              this.isUsernameNotAvailable = false;
            }, 3000);
          } else {
            console.log("username is available");
            this.isUsernameNotAvailable = false;

            if (new String(this.registerForm.value.pass).length < 6) {
              this.isPasswordNot6letters = true;
              setTimeout(() => {
                this.isPasswordNot6letters = false;
              }, 3000);
            } else {
              if (
                this.registerForm.value.pass !=
                this.registerForm.value.pass_retype
              ) {
                this.isRetypePassWrong = true;
                setTimeout(() => {
                  this.isRetypePassWrong = false;
                }, 3000);
              } else {
                this.isLoading = true;
                var data = this.setOutTenantdata();

                this.authServices.addNewTenant(data).subscribe((res) => {
                  console.log(res);
                });

                var expireToken_data = {
                  expired: "true",
                  unique_id: this.currentNewUserAllDetails.request_details_id,
                  auth_type: "tenant",
                };
                this.emailService
                  .expireRegisterToken(JSON.stringify(expireToken_data))
                  .subscribe((e) => {});

                this.dialog.open(RegisterSuccessDialog, {
                  width: "400px",
                  height: "260px",
                });
              }
            }
          }
        } else {
          this.isFormEmpty = true;
          setTimeout(() => {
            this.isFormEmpty = false;
          }, 3000);
        }
      }
    }
  }

  decrypt(textToDecrypt: string) {
    try {
      var enc_key = CryptoJS.enc.Utf8.parse("McQfTjWnZr4u7x!A");
      var enc_iv = CryptoJS.enc.Utf8.parse("Zq4t7w9z$C&F)J@N");

      return CryptoJS.AES.decrypt(textToDecrypt, enc_key, {
        iv: enc_iv,
      }).toString(CryptoJS.enc.Utf8);
    } catch (error) {
      return "decryption-failed";
    }
  }

  getCurrentDate() {
    var date = new Date();

    var dateDay = Number(date.toISOString().split("T")[0].split("-")[2]);
    var currentDate =
      date.toISOString().split("T")[0].split("-")[0] +
      "-" +
      date.toISOString().split("T")[0].split("-")[1] +
      "-" +
      dateDay.toString();

    return currentDate;
  }

  setOutTenantdata() {
    var user_data = {
      unique_id: this.currentNewUserAllDetails.request_details_id,
      auth_type: "tenant",
      username: this.registerForm.value.username,
      password: this.registerForm.value.pass,
      firstname: this.currentNewUserAllDetails.firstname,
      lastname: this.currentNewUserAllDetails.lastname,
      token: "012345",
    };

    var currentDate = this.getCurrentDate();

    var user_details = {
      unique_id: this.currentNewUserAllDetails.request_details_id,
      email: this.currentNewUserAllDetails.email,
      nationality: this.currentNewUserAllDetails.nationality,
      passport_no: this.currentNewUserAllDetails.passport_no,
      passport_exp: this.currentNewUserAllDetails.passport_exp,
      phone_number: this.currentNewUserAllDetails.mobile_no,
      address: this.currentNewUserAllDetails.address,
      profile_photo: "",
      joined_date: currentDate,
    };

    return JSON.stringify({
      user_data: user_data,
      user_details: user_details,
    });
  }

  setOutData() {
    // console.log(this.currentNewUserAllDetails);
    var user_data = {
      unique_id: this.currentNewUserAllDetails.request_details_id,
      auth_type: "landlord",
      username: this.registerForm.value.username,
      password: this.registerForm.value.pass,
      firstname: this.currentNewUserAllDetails.firstname,
      lastname: this.currentNewUserAllDetails.lastname,
      token: "012345",
    };
    var currentDate = this.getCurrentDate();

    var user_details = {
      unique_id: this.currentNewUserAllDetails.request_details_id,
      email: this.currentNewUserAllDetails.email,
      nationality: this.currentNewUserAllDetails.nationality,
      passport_no: this.currentNewUserAllDetails.passport_no,
      passport_exp: this.currentNewUserAllDetails.passport_exp,
      phone_number: this.currentNewUserAllDetails.mobile_no,
      address: this.currentNewUserAllDetails.address,
      profile_photo: "",
      joined_date: currentDate,
    };

    var property_data = {
      unique_id: this.currentNewUserAllDetails.request_details_id,
      property_id: "012345ABCDEFG",
      property_name: this.currentNewUserAllDetails.propertyDetails.project_name,
      property_address: "",
      property_state:
        this.currentNewUserAllDetails.propertyDetails.property_state,
      image1: "",
      image2: "",
      image3: "",
      image4: "",
      image5: "",
      property_doc1: "",
      property_doc2: "",
      property_doc3: "",
      property_doc4: "",
      property_size: this.currentNewUserAllDetails.propertyDetails.size_area,
      price_range: "",
      property_type: "",
      completion: "",
      furnish_details:
        this.currentNewUserAllDetails.propertyDetails.furnish_details,
      furnish_type: "",
      community_name: this.currentNewUserAllDetails.propertyDetails.community,
      project_name: this.currentNewUserAllDetails.propertyDetails.project_name,
      ownership: "",
      title_deed_number:
        this.currentNewUserAllDetails.propertyDetails.title_deed_number,
      ref_no: "",
      purpose: "",
      developer: "",
      chart_data: "",
      map_data: "",
      social_media_marketing_info:
        this.currentNewUserAllDetails.propertyDetails
          .social_media_marketing_info,
      board_marketing_info:
        this.currentNewUserAllDetails.propertyDetails.board_marketing_info,
      others_marketing_info:
        this.currentNewUserAllDetails.propertyDetails.others_marketing_info,
      bedroom_no: this.currentNewUserAllDetails.propertyDetails.bedroom_no,
      unit_no: this.currentNewUserAllDetails.propertyDetails.unit_number,
      parking_no: this.currentNewUserAllDetails.propertyDetails.car_parking_no,
    };

    return JSON.stringify({
      user_data: user_data,
      user_details: user_details,
      property_data: property_data,
    });
  }
}
