import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { AuthenticationService } from "app/services/authentication.service";
import { UserService } from "app/services/user.service";
import { AlertService } from "app/services/alert.service";

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

  onSubmit() {
    console.log("submitted");
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService
      .register(this.registerForm.value, this.auth_type)
      .pipe(first())
      .subscribe(
        (data) => {
          this.alertService.success("Registration successful", true);
          this.router.navigate(["/login"]);
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }
}
