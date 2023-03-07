import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";

@Component({
  selector: "new_payment",
  templateUrl: "./new_payment.component.html",
  styleUrls: ["./new_payment.component.scss"],
})
export class NewPaymentComponent implements OnInit {
  isUserSignedIn: boolean = false;

  requestData: any;

  isLoading: boolean = false;

  previousUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private otherServices: OtherServices
  ) {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    if (
      user[0]["auth_type"] == "landlord" ||
      user[0]["auth_type"] == "tenant"
    ) {
      this.isLoading = true;
    } else {
      router.navigate([`/404`]);
    }
  }

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  docViewBtnClicked() {
    console.log("doc btn");
  }

  ngOnInit() {
    this.isLoading = false;
  }

  ngAfterViewInit() {}

  ngOnDestroy() {}
}
