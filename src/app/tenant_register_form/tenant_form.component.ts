import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from "app/services/alert.service";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { UserService } from "app/services/user.service";
import * as CryptoJS from "crypto-js";
import { first } from "rxjs";

@Component({
  selector: "tenant-register-form",
  templateUrl: "./tenant_form.component.html",
  styleUrls: ["./tenant_form.component.scss"],
})
export class TenantFormComponent implements OnInit {
  secretKey = "fiUIXSU3ZHVtMZADtUaIGxLVUKZAjjlf";
  registerForm: FormGroup;
  auth_type: any = "";
  fullName: string = "";

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private route: ActivatedRoute,
    private alertService: AlertService,
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
        this.fullName = rawJson["firstname"] + " " + rawJson["lastname"];
      }
    });
  }

  ngOnInit() {
    console.log(this.registerForm.value);
    console.log(this.auth_type);
  }

  // this.loading = true;
  onSubmit() {
    this.userService
      .register(this.registerForm.value, this.auth_type)
      .pipe(first())
      .subscribe(
        (data) => {
          // this.alertService.success("Registration successful", true);
          this.router.navigate(["/login"]);
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
