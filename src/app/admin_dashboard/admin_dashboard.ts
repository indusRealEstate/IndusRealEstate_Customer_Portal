import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AdminService } from "app/services/admin.service";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";
import { BehaviorSubject } from "rxjs";

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

  requestOverview: any[] = [];

  isRequestOverviewLoading: boolean = false;

  usrImgPath: any = "https://indusmanagement.ae/api/upload/img/user/";

  constructor(
    private apiService: ApiService,
    private adminService: AdminService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private otherServices: OtherServices
  ) {
    this.isLoading = true;
    // if (sessionStorage.getItem("admin_dashboard_session_data") == null) {
    this.isRequestOverviewLoading = true;
    // }

    this.getScreenSize();
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
  }

  screenHeight: number;
  screenWidth: number;
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
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
    this.isRequestOverviewLoading = true;
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
      await this.initFunction(user[0]["id"]);
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
      await this.initFunction(user[0]["id"]);
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
    }, 500);
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
    this.adminService.getAllProperties(userId, 'rent').subscribe((e: Array<any>) => {
      this.rentPropertiesLength = e.length;
    });
    this.adminService.getAllProperties(userId, 'sale').subscribe((e: Array<any>) => {
      this.salePropertiesLength = e.length;
    });
  }

  async getAllClients(userId) {
    this.adminService
      .getAllClients(userId, "landlord")
      .subscribe((e: Array<any>) => {
        this.landlordClient = e.length;
      });
    this.adminService
      .getAllClients(userId, "tenant")
      .subscribe((e: Array<any>) => {
        this.tenantClient = e.length;
      });
  }

  async getAllRequests(userId) {
    this.adminService
      .getAllRequestsAdmin({ userId: userId })
      .subscribe((val: any[]) => {
        // console.log(val);
        setTimeout(() => {
          if (val.length != 0) {
            this.totalRequests = val.length;

            var count = 0;
            for (let index = 0; index < val.length; index++) {
              count++;
              if (val[index].status == "approved") {
                this.approvedRequests++;
              }

              if (
                val[index].request_type != "NEW_LANDLORD_REQ" &&
                val[index].request_type != "NEW_TENANT_AC"
              ) {
                if (this.requestOverview.length != 4) {
                  this.requestOverview.push(val[index]);
                }
              }
            }

            if (val.length == count) {
              setTimeout(() => {
                this.isRequestOverviewLoading = false;
                this.cacheInSession();
              }, 500);

              this.calculateRequests();
            }
          }
        }, 100);
      });
  }

  moreRequestClicked() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    var userId = user[0]["id"];
    this.router.navigate(["/admin-requests"], { queryParams: { uid: userId } });

    this.otherServices.allRequestsClickedAdminDashboard.next(true);
  }

  navigateToTotalLandlordCleints() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    var userId = user[0]["id"];
    this.router.navigate(["/admin-clients-landlord"], {
      queryParams: { uid: userId },
    });
  }

  navigateToTotalTenantCleints() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    var userId = user[0]["id"];
    this.router.navigate(["/admin-clients-tenant"], {
      queryParams: { uid: userId },
    });
  }

  navigateToTotalSaleProperties() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    var userId = user[0]["id"];
    this.router.navigate(["/admin-properties-sale"], {
      queryParams: { uid: userId },
    });
  }

  navigateToTotalRentProperties() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    var userId = user[0]["id"];
    this.router.navigate(["/admin-properties-rent"], {
      queryParams: { uid: userId },
    });
  }
}
