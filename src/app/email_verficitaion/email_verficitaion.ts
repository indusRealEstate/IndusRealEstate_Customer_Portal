import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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

@Component({
  selector: "email-verficitaion",
  templateUrl: "./email_verficitaion.html",
  styleUrls: ["./email_verficitaion.scss"],
})
export class EmailVerification implements OnInit {
  registerForm: FormGroup;

  isLoading: boolean = false;
  isTokenVerified: boolean = false;
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
    private formBuilder: FormBuilder
  ) {
    this.isLoading = true;
    var userData = localStorage.getItem("currentUser");

    if (userData == null) {
      this.route.queryParams.subscribe(async (e) => {
        var replacedText = this.replaceAllStringsEnc(e["token"]);

        var auth_data = this.decrypt(replacedText);

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
              if (this.alluniqueIds.includes(auth_data)) {
                console.log("success");
                console.log(auth_data);
                this.isTokenVerified = true;
                this.registerForm = this.formBuilder.group({
                  username: ["", [Validators.required]],
                  pass: ["", [Validators.required]],
                  pass_retype: ["", [Validators.required]],
                });

                await this.fetchNewUserData(auth_data);
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

  async fetchNewUserData(unique_id) {
    this.authServices
      .fetchNewLandlordAllDetails(JSON.stringify({ unique_id: unique_id }))
      .subscribe((allDetails) => {
        this.currentNewUserAllDetails = allDetails[0];
        Object.assign(this.currentNewUserAllDetails, {
          propertyDetails: allDetails[1],
        });
      });

    this.emailService
      .getAllUsersForChecking()
      .subscribe((allUsers: Array<any>) => {
        for (let user of allUsers) {
          this.allUserNames.push(user.username);
        }
      });

    setTimeout(() => {
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
              console.log("gooood.....");
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
}
