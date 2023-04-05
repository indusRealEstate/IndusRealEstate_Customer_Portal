import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "app/services/authentication.service";

@Component({
  selector: "service_recap",
  templateUrl: "./service_recap.html",
  styleUrls: ["./service_recap.scss"],
})
export class ServiceRecapComponent implements OnInit {
  isUserSignedIn: boolean = false;

  requestData: any;
  isLoading: boolean = false;
  previousUrl: string;

  selectedPayment: string;

  currentServicePageType: any;
  servicePagesTypes: string[] = [
    "payment-tenant",
    "payment-landlord",
    "maintenance",
    "tenant-move-in",
    "tenant-move-out",
    "conditioning",
    "inspection",
  ];

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute
  ) {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
      var userData = localStorage.getItem("currentUser");
      var user = JSON.parse(userData);
      if (user[0]["auth_type"] != "admin") {
        this.isLoading = true;
        this.route.queryParams.subscribe((e) => {
          if (e == null) {
            router.navigate(["/404"]);
          } else if (e.uid != user[0]["id"]) {
            router.navigate(["/404"]);
          } else if (!this.servicePagesTypes.includes(e.service_type)) {
            router.navigate(["/404"]);
          } else {
            this.currentServicePageType = e.service_type;

            // otherServices.servicePageToggle.subscribe((val) => {
            //   if (val == true) {
            //     // console.log("not okay");
            //     this.isLoading = true;
            //     this.ngOnInit();
            //   }
            // });
          }
        });
      } else {
        router.navigate([`/admin-dashboard`]);
      }
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  ngOnInit() {
    this.isLoading = false;
  }
}
