import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { UserService } from "app/services/user.service";
import * as CryptoJS from "crypto-js";
import { first } from "rxjs";
import * as uuid from "uuid";

@Component({
  selector: "landlord-register-form",
  templateUrl: "./landlord_form.component.html",
  styleUrls: ["./landlord_form.component.scss"],
})
export class LandlordFormComponent implements OnInit {
  secretKey = "fiUIXSU3ZHVtMZADtUaIGxLVUKZAjjlf";
  registerForm: FormGroup;
  auth_type: any = "";

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.route.queryParams.subscribe((e) => {
      var encFormData = e["id"].split("*")[0];
      var encAuthType = e["id"].split("*")[1];

      var formData = this.decrypt(encFormData);
      var authTypeData = this.decrypt(encAuthType);

      if (
        formData == "decryption-failed" ||
        authTypeData == "decryption-failed"
      ) {
        router.navigateByUrl("/register");
      } else {
        var rawJson = JSON.parse(formData);

        this.registerForm = this.formBuilder.group({
          firstname: [rawJson["firstname"]],
          lastname: [rawJson["lastname"]],
          username: [rawJson["username"]],
          password: [rawJson["password"]],
        });

        this.auth_type = authTypeData;
      }
    });
  }

  ngOnInit() {
    console.log(this.registerForm.value);
    console.log(this.auth_type);
  }

  // this.loading = true;
  onSubmit() {
    var userId = uuid.v4();
    var userDetails = {
      user_id: userId,
      email: "example123@gmail.com",
      phone_number: "0123456789",
      address: "Dubai, JLT",
      profile_photo: "",
    };

    this.userService
      .register(this.registerForm.value, userId, this.auth_type, userDetails)
      .pipe(first())
      .subscribe(
        (data) => {
          // this.alertService.success("Registration successful", true);
          // this.router.navigate(["/login"]);

          if (data == null) {
            this.userService.addUserDetails(userDetails).subscribe((e) => {
              console.log(e);
            });
          }
        },
        (error) => {
          // this.alertService.error(error);
          console.log(error);
          // this.loading = false;
        }
      );
  }

  decrypt(textToDecrypt: string) {
    try {
      return CryptoJS.AES.decrypt(
        textToDecrypt,
        this.secretKey.trim()
      ).toString(CryptoJS.enc.Utf8);
    } catch (error) {
      return "decryption-failed";
    }
  }

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
