import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { AuthenticationService } from "app/services/authentication.service";
import { AlertService } from "app/services/alert.service";
import { OtherServices } from "app/services/other.service";

@Component({
  selector: "user-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  invaliduser: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private otherServices: OtherServices
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      var userData = localStorage.getItem("currentUser");
      var user = JSON.parse(userData);
      this.router.navigate([`/home`], {
        queryParams: { uid: user[0]["id"] },
      });
    }
  }
  ngOnInit() {
    this.invaliduser = false;
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    console.log("submitted");
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService
      .login(this.f.username.value, this.f.password.value)
      .subscribe(
        (data) => {
          if (data == "invalid-user") {
            this.invaliduser = true;
            this.loading = false;
          } else {
            this.otherServices.isUserSignedOut.next(false);
            var userData = localStorage.getItem("currentUser");
            var user = JSON.parse(userData);

            setTimeout(() => {
              if (user[0]["auth_type"] != "admin") {
                // window.location.replace(`/home?uid=${user[0]["id"]}`);
                this.router.navigate(["/home"], {
                  // replaceUrl: true,
                  queryParams: { uid: user[0]["id"] },
                });
              } else {
                // window.location.replace(`/admin-dashboard?uid=${user[0]["id"]}`);
                this.router.navigate(["/admin-dashboard"], {
                  // replaceUrl: true,
                  queryParams: { uid: user[0]["id"] },
                });
              }
            }, 500);
          }
        },
        (error) => {
          console.log(error);
          if (error["statusText"] == "Not Found") {
            this.invaliduser = true;
          }
          console.log(this.invaliduser);
          this.loading = false;
        }
      );
  }
}
