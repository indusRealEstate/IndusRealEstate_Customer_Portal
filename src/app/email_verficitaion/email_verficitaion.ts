import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from "app/services/alert.service";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
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
  enc_key = "jXnZr4u7x!A%D*G-KaPdSgVkYp3s5v8y";
  enc_iv = CryptoJS.SHA256("Zq4t7w9z$C&F)J@N");
  registerForm: FormGroup;

  isLoading: boolean = false;

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
      // var auth_data = this.decrypt(JSON.stringify(e));
      console.log(e["token"]);

      // if (auth_data == "decryption-failed") {
      //   // router.navigateByUrl("/register");
      //   console.log("error");
      // } else {
      //   console.log("success");
      //   this.registerForm = this.formBuilder.group({
      //     username: ["", [Validators.required]],
      //     password: ["", [Validators.required]],
      //   });
      // }
    });
  }

  ngOnInit() {
    // console.log(this.registerForm.value);
    // console.log(this.auth_type);
  }

  onSubmit() {}

  decrypt(textToDecrypt: string) {
    try {
      return CryptoJS.AES.decrypt(textToDecrypt, this.enc_key.trim(), {
        iv: this.enc_iv,
      }).toString(CryptoJS.enc.Utf8);
    } catch (error) {
      return "decryption-failed";
    }
  }
}
