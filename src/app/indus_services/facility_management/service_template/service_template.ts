import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";

@Component({
  selector: "service_template",
  templateUrl: "./service_template.html",
  styleUrls: ["./service_template.scss"],
})
export class ServiceTemplateComponent implements OnInit {
  isUserSignedIn: boolean = false;

  requestData: any;
  isLoading: boolean = false;
  previousUrl: string;

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
    private route: ActivatedRoute,
    private otherServices: OtherServices
  ) {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
      var userData = localStorage.getItem("currentUser");
      var user = JSON.parse(userData);
      if (user[0]["auth_type"] != "admin") {
        this.route.queryParams.subscribe((e) => {
          if (e == null) {
            router.navigate(["/404"]);
          } else if (e.uid != user[0]["id"]) {
            router.navigate(["/404"]);
          } else if (!this.servicePagesTypes.includes(e.service_type)) {
            router.navigate(["/404"]);
          } else {
            this.currentServicePageType = e.service_type;

            otherServices.servicePageToggle.subscribe((val) => {
              if (val == true) {
                // console.log("not okay");
                this.isLoading = true;
                this.ngOnInit();
              }
            });
          }
        });
      } else {
        router.navigate(["/admin-dashboard"]);
      }
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  selectedServiceSubType: any;
  serviceSubType: any[] = ["type 1", "type 2", "type 3"];

  ngOnInit() {
    this.isLoading = false;
  }

  nextBtnClicked() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.router.navigate(["/service-recap"], {
      queryParams: {
        uid: user[0]["id"],
        service_type: this.currentServicePageType,
      },
    });
  }
}
