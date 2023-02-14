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
    // if (sessionStorage.getItem("admin_dashboard_session_data") == null) {
    this.isRequestOverviewLoading = true;
    // }
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

  async ngDoCheck() {
    if (this.isRequestOverviewLoading == false) {
      if (this.requestOverview.length != 0) {
        for (let index = 0; index < this.requestOverview.length; index++) {
          if (
            this.requestOverview[index]["userData"] == null ||
            this.requestOverview[index]["userDetails"] == null
          ) {
            this.isRequestOverviewLoading = true;
            console.log("issue spotted -- reloading");
            await this.assignUserData().then(() => {
              setTimeout(() => {
                this.isRequestOverviewLoading = false;
              }, 6000);

              setTimeout(() => {
                this.cacheInSession();
              }, 7000);
            });
          } else {
            console.log("no issue");
          }
        }
      }
    }
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

  async ngOnInit() {
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
      this.isRequestOverviewLoading = false;
    } else {
      await this.initFunction(user[0]["id"]).then(() => {
        setTimeout(() => {
          this.isRequestOverviewLoading = false;
        }, 5000);
      });
      sessionStorage.setItem(
        "admin_dashboard_fetched_time",
        JSON.stringify(new Date().getMinutes())
      );
    }

    var now = new Date().getMinutes();

    var diff =
      now -
      Number(
        JSON.parse(sessionStorage.getItem("admin_dashboard_fetched_time"))
      );

    if (diff >= 10) {
      this.isRequestOverviewLoading = true;
      this.isLoading = true;
      this.clearAllVariables();
      sessionStorage.removeItem("admin_dashboard_fetched_time");
      sessionStorage.removeItem("admin_dashboard_session_data");
      await this.initFunction(user[0]["id"]).then(() => {
        setTimeout(() => {
          this.isRequestOverviewLoading = false;
        }, 5000);
      });
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

  async initFunction(userId) {
    await this.getAllProperties(userId);
    await this.getAllClients(userId);

    await this.getAllRequests(userId);

    setTimeout(() => {
      this.isLoading = false;
    }, 1500);

    setTimeout(() => {
      this.cacheInSession();
    }, 12000);
  }

  cacheInSession() {
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
  }

  async getAllProperties(userId) {
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

  async getAllClients(userId) {
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

  async getAllRequests(userId) {
    this.adminService
      .getAllAddPropertyRequests(userId)
      .subscribe((prop_req: Array<any>) => {
        this.allRequests = prop_req;

        setTimeout(() => {
          this.adminService
            .getAllPaymentRequests(userId)
            .subscribe(async (pay_req: Array<any>) => {
              this.totalRequests = this.allRequests.length;
              var i = 0;
              for (let pay of pay_req) {
                i++;
                this.totalRequests++;
                this.allRequests.push(pay);
              }

              if (pay_req.length == i) {
                var limit = 0;
                for (let req of this.allRequests) {
                  limit++;
                  if (limit < 5) {
                    this.requestOverview.push(req);
                  }
                  if (req["approved"] == "true") {
                    this.approvedRequests++;
                  }
                }
                if (limit == this.allRequests.length) {
                  await this.assignUserData();
                  this.calculateRequests();
                }
              }
            });
        }, 500);
      });
  }

  async assignUserData() {
    for (let req of this.requestOverview) {
      this.apiService.getUser(req["user_id"]).subscribe(async (userData) => {
        if (req) {
          await Object.assign(req, { userData: userData[0] });
        }
      });

      this.apiService
        .getUserDetails(req["user_id"])
        .subscribe(async (userDetails) => {
          if (req) {
            await Object.assign(req, { userDetails: userDetails[0] });
          }
        });
    }
  }

  moreRequestClicked() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    var userId = user[0]["id"];
    this.router.navigate(["/admin-requests"], { queryParams: { uid: userId } });
  }
}
