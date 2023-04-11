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
  new_ac_landlord_req_len: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  requestPercentage: number = 0;

  isLoading: boolean = false;

  isNew_ac_landlord_reqsFinished: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  isPaymentReqFinished: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  isNewLandlordReqFinised: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  isNewTenantReqFinised: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  isReqOverviewFullyAdded: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  // allRequests: any[] = [];

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

    this.new_ac_landlord_req_len.next(0);
    this.isNew_ac_landlord_reqsFinished.next(false);
    this.isPaymentReqFinished.next(false);
    this.isNewLandlordReqFinised.next(false);
    this.isNewTenantReqFinised.next(false);
    this.isReqOverviewFullyAdded.next(false);
  }

  async initFunction(userId) {
    await this.getAllProperties(userId);
    await this.getAllClients(userId);

    await this.getAllRequests(userId);

    setTimeout(() => {
      this.isLoading = false;
    }, 1500);
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

  async getAllPropertyReqs(userId) {
    this.adminService
      .getAllAddPropertyRequests(userId)
      .subscribe((prop_req: Array<any>) => {
        if (prop_req.length != 0) {
          var i = 0;
          for (let index = 0; index < prop_req.length; index++) {
            i++;

            if (prop_req[index].request_type != "NEW_LANDLORD_ACC") {
              this.totalRequests++;
              if (prop_req[index]["approved"] == "true") {
                this.approvedRequests++;
              }
            } else {
              this.new_ac_landlord_req_len.next(
                this.new_ac_landlord_req_len.getValue() + 1
              );
            }
            if (i == prop_req.length) {
              setTimeout(() => {
                this.isNew_ac_landlord_reqsFinished.next(true);
              }, 1000);
            }
          }
        }

        this.isNew_ac_landlord_reqsFinished.subscribe((val) => {
          if (val == true) {
            for (let index = 0; index < 5; index++) {
              if (prop_req[index].request_type != "NEW_LANDLORD_ACC") {
                this.requestOverview.push(prop_req[index]);
              }
            }
          }
        });
      });
  }

  getAllPaymentReqs(userId) {
    this.adminService
      .getAllPaymentRequests(userId)
      .subscribe(async (pay_req: Array<any>) => {
        if (pay_req.length != 0) {
          var i = 0;
          for (let req of pay_req) {
            i++;
            this.totalRequests++;
            if (req["approved"] == "true") {
              this.approvedRequests++;
            }
          }

          if (this.requestOverview.length < 4) {
            for (let index = 0; index < pay_req.length; index++) {
              if (this.requestOverview.length >= 4) {
                break;
              } else {
                this.requestOverview.push(pay_req[index]);
              }
            }
          }

          if (i == pay_req.length) {
            this.isPaymentReqFinished.next(true);
          }
        }
      });
  }

  getAllNewLandlordReqs(userId) {
    this.adminService
      .getAllNewLandlordACCRequest(userId)
      .subscribe((new_landlord_ac_req: Array<any>) => {
        if (new_landlord_ac_req.length != 0) {
          var i = 0;
          for (let req of new_landlord_ac_req) {
            i++;
            this.totalRequests++;
            if (req["approved"] == "true") {
              this.approvedRequests++;
            }
          }

          if (i == new_landlord_ac_req.length) {
            this.isNewLandlordReqFinised.next(true);
          }
        }
      });
  }

  getAllNewTenantReqs(userId) {
    this.adminService
      .getAllNewTenantACCRequest(userId)
      .subscribe((new_tenant_ac_req: Array<any>) => {
        if (new_tenant_ac_req.length != 0) {
          var i = 0;
          for (let req of new_tenant_ac_req) {
            i++;
            this.totalRequests++;
            if (req["approved"] == "true") {
              this.approvedRequests++;
            }
          }

          if (i == new_tenant_ac_req.length) {
            this.isNewTenantReqFinised.next(true);
          }
        }
      });
  }

  async checkRequestOverviewUserdata() {
    for (let req of this.requestOverview) {
      if (req.userData == null || req.userDetails == null) {
        this.isReqOverviewFullyAdded.next(false);
      }
    }
  }

  async getAllRequests(userId) {
    await this.getAllPropertyReqs(userId).finally(() => {
      this.isNew_ac_landlord_reqsFinished.subscribe((val) => {
        console.log(val);
        if (val == true) {
          this.getAllPaymentReqs(userId);
          this.isPaymentReqFinished.subscribe((pay_val) => {
            if (pay_val == true) {
              this.getAllNewLandlordReqs(userId);

              this.isNewLandlordReqFinised.subscribe((new_landlord_val) => {
                if (new_landlord_val == true) {
                  this.getAllNewTenantReqs(userId);

                  this.isNewTenantReqFinised.subscribe(
                    async (new_tenant_val) => {
                      if (new_tenant_val == true) {
                        this.calculateRequests();
                        await this.assignUserData();
                        await this.checkRequestOverviewUserdata().finally(
                          () => {
                            this.isReqOverviewFullyAdded.subscribe(
                              async (req_overview_val) => {
                                if (req_overview_val == true) {
                                  setTimeout(() => {
                                    this.isRequestOverviewLoading = false;
                                    this.cacheInSession();
                                  }, 1000);
                                } else {
                                  await this.assignUserData();

                                  setTimeout(() => {
                                    this.isRequestOverviewLoading = false;
                                    this.cacheInSession();
                                  }, 4000);
                                }
                              }
                            );
                          }
                        );
                      }
                    }
                  );
                }
              });
            }
          });
        }
      });
    });
  }

  async assignUserData() {
    for (let req of this.requestOverview) {
      if (req.userData == null) {
        this.apiService.getUser(req["user_id"]).subscribe(async (userData) => {
          if (req) {
            await Object.assign(req, { userData: userData[0] });
          }
        });
      }

      if (req.userDetails == null) {
        this.apiService
          .getUserDetails(req["user_id"])
          .subscribe(async (userDetails) => {
            if (req) {
              await Object.assign(req, { userDetails: userDetails[0] });
            }
          });
      }
    }
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
