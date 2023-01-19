import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { AuthenticationService } from "app/services/authentication.service";
import { UserService } from "app/services/user.service";
import { AlertService } from "app/services/alert.service";
import * as CryptoJS from "crypto-js";

@Component({
  selector: "user-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.scss"],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  auth_type: any = "";
  secretKey = "fiUIXSU3ZHVtMZADtUaIGxLVUKZAjjlf";

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      username: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  radioChange(value: any) {
    if (value["value"] == "landlord") {
      this.auth_type = "landlord";
    } else {
      this.auth_type = "tenant";
    }
  }

  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
  }

  onSubmit() {
    this.submitted = true;

    var encForm = this.encrypt(JSON.stringify(this.registerForm.value));
    var encAuthType = this.encrypt(this.auth_type);

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    } else {
      if (this.auth_type == "landlord") {
        this.router.navigate(["/landlord-register-form"], {
          queryParams: { id: `${encForm}*${encAuthType}` },
        });
      } else if (this.auth_type == "tenant") {
        this.router.navigate(["/tenant-register-form"], {
          queryParams: { id: `${encForm}*${encAuthType}` },
        });
      }
    }
  }
}
