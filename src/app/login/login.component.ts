import { Component, HostListener, OnInit } from "@angular/core";
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

  screenHeight: number;
  screenWidth: number;

  isPasswordHidden: boolean = true;

  color = "accent";
  checked: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private otherServices: OtherServices
  ) {
    this.getScreenSize();
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      var userData = localStorage.getItem("currentUser");
      var user = JSON.parse(userData);
      this.router.navigate([`/home`], {
        queryParams: { uid: user[0]["id"] },
      });
    }
  }

  changed() {
    if (this.checked == true) {
      this.checked = false;
    } else {
      this.checked = true;
    }
  }

  hidePassword() {
    if (this.isPasswordHidden == true) {
      this.isPasswordHidden = false;
    } else {
      this.isPasswordHidden = true;
    }
  }

  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
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

  onSubmit() {
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

            setTimeout(async () => {
              // await this.authenticationService.getIPAddress().then((res) => {
              //   var date = this.getCurrentDate();

              //   setTimeout(() => {
              //     res.subscribe((ip) => {
              //       var ip_data = {
              //         date: date,
              //         ip: ip["ip"],
              //       };

              //       this.authenticationService
              //         .storeClientIP(JSON.stringify(ip_data))
              //         .subscribe((e) => {
              //           console.log(e);
              //         });
              //     });
              //   }, 1000);
              // });

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
