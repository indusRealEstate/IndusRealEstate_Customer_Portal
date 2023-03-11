import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "app/services/authentication.service";

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
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
      var userData = localStorage.getItem("currentUser");
      var user = JSON.parse(userData);
      if (
        user[0]["auth_type"] == "landlord" ||
        user[0]["auth_type"] == "tenant"
      ) {
        this.isLoading = true;
      } else {
        router.navigate([`/admin-dashboard`]);
      }
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  selectedPaymentType: any;
  paymentType: any[] = ["Payment 1", "Payment 2", "Payment 3"];

  ngOnInit() {
    this.isLoading = false;
  }
}
