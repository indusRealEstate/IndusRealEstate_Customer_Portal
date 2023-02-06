import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AdminService } from "app/services/admin.service";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";
import * as Chartist from "chartist";
import { BehaviorSubject } from "rxjs";
import { User } from "../../../models/user/user.model";

@Component({
  selector: "admin-dashboard",
  templateUrl: "./admin_dashboard.html",
  styleUrls: ["./admin_dashboard.scss"],
})
export class AdminDashboardComponent implements OnInit {
  isUserSignedIn: boolean = false;

  // properties
  rentPropertiesLength: number = 0;
  salePropertiesLength: number = 0;

  // clients
  landlordClient: number = 0;
  tenantClient: number = 0;

  totalRequests: number = 0;
  approvedRequests: number = 0;

  requestPercentage: number = 0;

  isLoading: boolean = false;

  allRequests: any[] = [];

  requestOverview: any[] = [];

  isRequestOverviewLoading: boolean = false;

  constructor(
    private apiService: ApiService,
    private adminService: AdminService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private otherService: OtherServices,
    private route: ActivatedRoute
  ) {
    this.isLoading = true;
    if (sessionStorage.getItem("admin_dashboard_session_data") == null) {
      this.isRequestOverviewLoading = true;
    }
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    if (user[0]["auth_type"] != "admin") {
      router.navigate(["/404"]);
    } else {
      this.route.queryParams.subscribe((e) => {
        if (e == null) {
          router.navigate(["/admin-dashboard"], {
            queryParams: { uid: user[0]["id"] },
          });
        } else if (e != user[0]["id"]) {
          router.navigate(["/admin-dashboard"], {
            queryParams: { uid: user[0]["id"] },
          });
        }
      });
    }

    // this.scrollToTop();
  }

  scrollToTop() {
    // window.scrollTo(0, 0);
  }

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  ngOnInit() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    this.isUserSignOut();

    var sessionDataRaw = sessionStorage.getItem("admin_dashboard_session_data");
    var sessionData = JSON.parse(sessionDataRaw);

    if (sessionDataRaw != null) {
      this.rentPropertiesLength = sessionData["rentProperties"];
      this.salePropertiesLength = sessionData["saleProperties"];
      this.landlordClient = sessionData["landlords"];
      this.tenantClient = sessionData["tenants"];
      this.totalRequests = sessionData["totalRequests"];
      this.requestPercentage = sessionData["requestPercentage"];
      this.approvedRequests = sessionData["approvedRequests"];
      this.requestOverview = sessionData["requestOverview"];
      this.isLoading = false;
    } else {
      this.initFunction(user[0]["id"]);
      sessionStorage.setItem(
        "admin_dashboard_fetched_time",
        JSON.stringify(new Date().getMinutes())
      );

      setTimeout(() => {
        this.isRequestOverviewLoading = false;
      }, 2000);
    }

    var now = new Date().getMinutes();

    var diff =
      now -
      Number(
        JSON.parse(sessionStorage.getItem("admin_dashboard_fetched_time"))
      );

    if (diff >= 2) {
      this.clearAllVariables();
      sessionStorage.removeItem("admin_dashboard_fetched_time");
      sessionStorage.removeItem("admin_dashboard_session_data");
      this.initFunction(user[0]["id"]);
      sessionStorage.setItem(
        "admin_dashboard_fetched_time",
        JSON.stringify(new Date().getMinutes())
      );
    }
  }

  calculateRequests() {
    var a = this.approvedRequests;
    var b = this.totalRequests;

    var a1 = a / b;

    this.requestPercentage = a1 * 100;
  }

  clearAllVariables() {
    this.rentPropertiesLength = 0;
    this.salePropertiesLength = 0;
    this.landlordClient = 0;
    this.tenantClient = 0;
    this.totalRequests = 0;
    this.approvedRequests = 0;
    this.requestPercentage = 0;
    this.requestOverview.length = 0;
  }

  initFunction(userId) {
    this.getAllProperties(userId);
    this.getAllRequests(userId);

    setTimeout(() => {
      this.getAllClients(userId);
    }, 3000);

    setTimeout(() => {
      sessionStorage.setItem(
        "admin_dashboard_session_data",
        JSON.stringify({
          rentProperties: this.rentPropertiesLength,
          saleProperties: this.salePropertiesLength,
          landlords: this.landlordClient,
          tenants: this.tenantClient,
          totalRequests: this.totalRequests,
          approvedRequests: this.approvedRequests,
          requestPercentage: this.requestPercentage,
          requestOverview: this.requestOverview,
        })
      );

      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    }, 4000);
  }

  getAllProperties(userId) {
    this.adminService.getAllProperties(userId).subscribe((e: Array<any>) => {
      for (let pr of e) {
        if (pr["property_state"] == "rent") {
          this.rentPropertiesLength++;
        } else if (pr["property_state"] == "sale") {
          this.salePropertiesLength++;
        }
      }
    });
  }

  getAllClients(userId) {
    this.adminService.getAllClients(userId).subscribe((e: Array<any>) => {
      for (let cl of e) {
        if (cl["auth_type"] == "landlord") {
          this.landlordClient++;
        } else if (cl["auth_type"] == "tenant") {
          this.tenantClient++;
        }
      }
    });
  }

  getAllRequests(userId) {
    this.adminService
      .getAllAddPropertyRequests(userId)
      .subscribe((prop_req: Array<any>) => {
        this.allRequests = prop_req;
      });

    setTimeout(() => {
      this.adminService
        .getAllPaymentRequests(userId)
        .subscribe((pay_req: Array<any>) => {
          for (let pay of pay_req) {
            this.allRequests.push(pay);
          }
        });
    }, 1000);

    setTimeout(() => {
      var limit = 0;
      for (let req of this.allRequests) {
        limit++;
        this.totalRequests++;
        if (limit < 5) {
          this.requestOverview.push(req);
        }
        if (req["approved"] == "true") {
          this.approvedRequests++;
        }
      }
    }, 1500);

    setTimeout(() => {
      for (let req of this.allRequests) {
        this.apiService.getUser(req["user_id"]).subscribe((userData) => {
          if (req) {
            Object.assign(req, { userData: userData[0] });
          }
        });

        this.apiService
          .getUserDetails(req["user_id"])
          .subscribe((userDetails) => {
            if (req) {
              Object.assign(req, { userDetails: userDetails[0] });
            }
          });
      }

      setTimeout(() => {
        this.calculateRequests();
      }, 1500);
    }, 2500);
  }
}
