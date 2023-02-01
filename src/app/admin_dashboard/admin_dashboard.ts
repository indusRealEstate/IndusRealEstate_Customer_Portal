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

  dataFetchedTime: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  requestOverview: any[] = [];
  requestOverviewClients: any[] = [];
  requestOverviewClientsPhoto: any[] = [];

  isRequestOverviewLoading: boolean = false;

  constructor(
    private apiService: ApiService,
    private adminService: AdminService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private otherService: OtherServices,
    private route: ActivatedRoute
  ) {
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
      this.requestOverviewClients = sessionData["requestOverviewClients"];
      this.requestOverviewClientsPhoto =
        sessionData["requestOverviewClientsPhoto"];
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

    this.dataFetchedTime.next(
      now -
        Number(
          JSON.parse(sessionStorage.getItem("admin_dashboard_fetched_time"))
        )
    );

    this.dataFetchedTime.subscribe((e) => {
      if (e >= 2) {
        this.clearAllVariables();
        sessionStorage.removeItem("admin_dashboard_fetched_time");
        sessionStorage.removeItem("admin_dashboard_session_data");
        this.initFunction(user[0]["id"]);
        sessionStorage.setItem(
          "admin_dashboard_fetched_time",
          JSON.stringify(new Date().getMinutes())
        );
      }
    });
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
    this.requestOverviewClients.length = 0;
    this.requestOverviewClientsPhoto.length = 0;
  }

  initFunction(userId) {
    this.getAllProperties(userId);
    this.getAllRequests(userId);
    this.getAllClients(userId);

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
          requestOverviewClients: this.requestOverviewClients,
          requestOverviewClientsPhoto: this.requestOverviewClientsPhoto,
        })
      );
    }, 2000);
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

        for (let ovr of this.requestOverview) {
          if (ovr["user_id"] == cl["id"]) {
            this.requestOverviewClients.push(cl);

            this.apiService.getUserDetails(cl["id"]).subscribe((usdet) => {
              this.requestOverviewClientsPhoto.push(usdet[0]["profile_photo"]);
            });
          }
        }
      }
    });
  }

  getAllRequests(userId) {
    this.adminService.getAllRequests(userId).subscribe((e: Array<any>) => {
      var limit = 0;
      for (let req of e) {
        limit++;
        this.totalRequests++;
        if (limit < 5) {
          this.requestOverview.push(req);
        }

        if (req["approved"] == "true") {
          this.approvedRequests++;
        }
      }
    });

    setTimeout(() => {
      this.calculateRequests();
    }, 200);
  }
}
