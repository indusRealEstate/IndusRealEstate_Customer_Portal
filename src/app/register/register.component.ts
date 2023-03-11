import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "app/services/authentication.service";

@Component({
  selector: "user-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.scss"],
})
export class RegisterComponent implements OnInit {
  loading = false;
  submitted = false;
  // secretKey = "fiUIXSU3ZHVtMZADtUaIGxLVUKZAjjlf";

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit() {}

  // convenience getter for easy access to form fields
  // get f() {
  //   return this.registerForm.controls;
  // }

  // encrypt(value: string): string {
  //   return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
  // }

  onSubmit(auth?: any) {
    this.submitted = true;

    // var encAuthType = this.encrypt(auth);

    if (auth == "landlord") {
      this.router.navigate(
        ["/landlord-register-form"]
        // , {
        //   queryParams: { id: encAuthType },
        // }
      );
    } else if (auth == "tenant") {
      this.router.navigate(
        ["/tenant-register-form"]
        // , {
        //   queryParams: { id: encAuthType },
        // }
      );
    }
  }
}
