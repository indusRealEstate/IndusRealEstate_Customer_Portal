import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { AdminService } from "app/services/admin.service";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { EmailServices } from "app/services/email.service";
import { OtherServices } from "app/services/other.service";
import { BehaviorSubject } from "rxjs";
import { AcceptRequestConfirmDialog } from "./accept_req_dialog/acspt_req_dialog";
import { DeclineRequestConfirmDialog } from "./decline_req_dialog/decline_req_dialog";

@Component({
  selector: "admin-requests",
  templateUrl: "./admin-requests.html",
  styleUrls: ["./admin-requests.scss"],
})
export class AdminRequests implements OnInit {
  isUserSignedIn: boolean = false;

  isLoading: boolean = false;
  isContentLoading: boolean = false;

  allRequests: any[] = [];
  allRequestsBH: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  allRequestsLenBH: BehaviorSubject<number> = new BehaviorSubject<number>(100);
  allRequestsLen: number = 0;
  allNewLandLordACCRequests: any[] = [];
  imagesUrl: any;
  show_more_imgLoading: boolean[] = [];

  isLandlordRequestsEmpty: boolean = false;
  isTenantRequestsEmpty: boolean = false;

  contentLoadingTime: any = 2000;

  categoryAllRequests: "fixtures" | "payments" | "cat_3" | "cat_4" = "fixtures";
  propertyTypeAllRequests: "all" | "villa" | "appartment" = "all";

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private adminService: AdminService,
    private dialog?: MatDialog,
    private emailServices?: EmailServices
  ) {
    this.isLoading = true;
    this.isContentLoading = true;
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    if (user[0]["auth_type"] == "admin") {
      this.route.queryParams.subscribe((e) => {
        if (e == null) {
          router.navigate([`/admin-requests`], {
            queryParams: { uid: user[0]["id"] },
          });
        } else if (e != user[0]["id"]) {
          router.navigate([`/admin-requests`], {
            queryParams: { uid: user[0]["id"] },
          });
        }
      });
    } else {
      router.navigate([`/404`]);
    }
  }

  async ngDoCheck() {}

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  getImageExtension(img: string) {
    var ext = img.split(".")[1];
    return ext;
  }

  async ngOnInit() {
    this.imagesUrl = this.apiService.getBaseUrlImages();
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    var adminReqDataSession = JSON.parse(
      sessionStorage.getItem("admin_reqs_session")
    );

    if (adminReqDataSession != null) {
      console.log("session data available");
      this.allRequests = adminReqDataSession["allRequests"];
      for (let index = 0; index < this.allRequests.length; index++) {
        this.show_more_imgLoading[index] = false;
      }
      this.isLandlordRequestsEmpty =
        adminReqDataSession["isLandlordRequestsEmpty"];
      this.isTenantRequestsEmpty = adminReqDataSession["isTenantRequestsEmpty"];
      this.isLoading = false;
      this.isContentLoading = false;
    } else {
      console.log("no session data");
      await this.initFunction(user[0]["id"]);
      sessionStorage.setItem(
        "admin_reqs_fetched_time",
        JSON.stringify(new Date().getMinutes())
      );
    }

    var now = new Date().getMinutes();

    var diff =
      now -
      Number(JSON.parse(sessionStorage.getItem("admin_reqs_fetched_time")));

    if (diff >= 10) {
      this.isLoading = true;
      this.isContentLoading = true;
      this.clearAllVariables();
      sessionStorage.removeItem("admin_reqs_fetched_time");
      sessionStorage.removeItem("admin_reqs_session");
      await this.initFunction(user[0]["id"]);
      sessionStorage.setItem(
        "admin_reqs_fetched_time",
        JSON.stringify(new Date().getMinutes())
      );
    }
  }

  clearAllVariables() {
    this.allRequests.length = 0;
  }

  async checkEveryDataPresent(req) {
    var noDataPresent = false;
    for (let index = 0; index < req.length; index++) {
      if (req[index].request_type == "NEW_LANDLORD_ACC") {
        if (req[index].propertyData == null) {
          noDataPresent = true;
        }
      } else if (
        req[index].request_type != "NEW_TENANT_ACC" &&
        req[index].request_type != "NEW_LANDLORD_ACC"
      ) {
        if (req[index].userData == null) {
          noDataPresent = true;
        }
      }
    }

    return noDataPresent;
  }

  async initFunction(userId) {
    await this.fetchAllRequests(userId).finally(() => {
      this.allRequestsLenBH.subscribe(async (e) => {
        if (e == this.allRequests.length) {
          await this.assignUsersData().finally(() => {
            this.allRequestsBH.next(this.allRequests);
          });

          this.allRequestsBH.subscribe(async (req) => {
            var res = await this.checkEveryDataPresent(req).finally(
              async () => {
                if (res == true) {
                  await this.assignUsersData().finally(() => {
                    this.allRequestsBH.next(this.allRequests);
                    setTimeout(() => {
                      this.isContentLoading = false;
                      sessionStorage.setItem(
                        "admin_reqs_session",
                        JSON.stringify({
                          allRequests: this.allRequests,
                          isLandlordRequestsEmpty: this.isLandlordRequestsEmpty,
                          isTenantRequestsEmpty: this.isTenantRequestsEmpty,
                        })
                      );
                    }, 4000);
                  });
                } else {
                  setTimeout(() => {
                    this.isContentLoading = false;
                    sessionStorage.setItem(
                      "admin_reqs_session",
                      JSON.stringify({
                        allRequests: this.allRequests,
                        isLandlordRequestsEmpty: this.isLandlordRequestsEmpty,
                        isTenantRequestsEmpty: this.isTenantRequestsEmpty,
                      })
                    );
                  }, 3000);
                }
              }
            );
          });
        }
      });
    });

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  async getAllAddPropertyRequests(userId) {
    this.adminService
      .getAllAddPropertyRequests(userId)
      .subscribe(async (prop_req: Array<any>) => {
        var i = 0;
        for (let index = 0; index < prop_req.length; index++) {
          i++;
          if (prop_req[index].request_type != "NEW_LANDLORD_ACC") {
            this.allRequests.push(prop_req[index]);
            this.allRequestsLen++;
          } else {
            this.allNewLandLordACCRequests.push(prop_req[index]);
          }
        }

        if ((i = prop_req.length)) {
          this.getAllPaymentRequests(userId);
          this.getAllTenantNewRegReqs(userId);
          this.getAllLandlordNewRegReqs(userId);
        }
      });
  }

  getAllPaymentRequests(userId) {
    this.adminService
      .getAllPaymentRequests(userId)
      .subscribe((payment_req: Array<any>) => {
        for (let p of payment_req) {
          this.allRequests.push(p);
        }

        setTimeout(() => {
          this.allRequestsLenBH.next(this.allRequestsLen + payment_req.length);
        }, 1000);
      });
  }

  getAllTenantNewRegReqs(userId) {
    this.adminService
      .getAllNewTenantACCRequest(userId)
      .subscribe((new_tenant_req: Array<any>) => {
        for (let req of new_tenant_req) {
          this.allRequests.push(req);
        }

        setTimeout(() => {
          this.allRequestsLenBH.next(
            this.allRequestsLenBH.getValue() + new_tenant_req.length
          );
        }, 1000);
      });
  }

  getAllLandlordNewRegReqs(userId) {
    this.adminService
      .getAllNewLandlordACCRequest(userId)
      .subscribe((new_landlord_req: Array<any>) => {
        for (let req of new_landlord_req) {
          this.allRequests.push(req);
        }

        setTimeout(() => {
          this.allRequestsLenBH.next(
            this.allRequestsLenBH.getValue() + new_landlord_req.length
          );
        }, 1000);
      });
  }

  async fetchAllRequests(userId) {
    await this.getAllAddPropertyRequests(userId);
  }

  async assignUsersData() {
    // console.log("assigning data...");
    for (let req of this.allRequests) {
      if (req.request_type == "NEW_LANDLORD_ACC") {
        if (req.propertyData == null) {
          for (let new_lndlrd_req of this.allNewLandLordACCRequests) {
            if (req.request_details_id == new_lndlrd_req.unique_id) {
              await Object.assign(req, { propertyData: new_lndlrd_req });
              await Object.assign(req, { show_more: false });
            }
          }
        }
      } else if (req.request_type == "NEW_TENANT_ACC") {
        if (req.show_more == null) {
          await Object.assign(req, { show_more: false });
        }
      } else {
        if (req.userData == null) {
          this.apiService
            .getUser(req["user_id"])
            .subscribe(async (userDetails) => {
              if (req) {
                await Object.assign(req, { userData: userDetails[0] });
                await Object.assign(req, { show_more: false });
              }
            });
        }
      }
    }
  }

  expandRequestCard(index) {
    this.show_more_imgLoading[index] = true;
    var sessionDataReqs = JSON.parse(
      sessionStorage.getItem("admin_reqs_session")
    );
    if (this.allRequests[index].show_more == false) {
      this.allRequests[index].show_more = true;

      if (sessionDataReqs != null) {
        sessionDataReqs["allRequests"][index]["show_more"] = true;

        setTimeout(() => {
          sessionStorage.setItem(
            "admin_reqs_session",
            JSON.stringify(sessionDataReqs)
          );
        }, 50);
      }

      setTimeout(() => {
        this.show_more_imgLoading[index] = false;
      }, 500);
    } else {
      this.allRequests[index].show_more = false;

      if (sessionDataReqs != null) {
        sessionDataReqs["allRequests"][index]["show_more"] = false;

        setTimeout(() => {
          sessionStorage.setItem(
            "admin_reqs_session",
            JSON.stringify(sessionDataReqs)
          );
        }, 50);
      }

      setTimeout(() => {
        this.show_more_imgLoading[index] = false;
      }, 500);
    }
  }

  acceptRequest(req) {
    this.dialog
      .open(AcceptRequestConfirmDialog, {
        width: "400px",
        height: "260px",
        data: {
          req_type: req.request_type,
        },
      })
      .afterClosed()
      .subscribe(async (res) => {
        if (res == true) {
          if (req.request_type == "NEW_LANDLORD_ACC") {
            await this.acceptedNewLandlordAccRequest(req);
          } else if (req.request_type == "NEW_TENANT_ACC") {
          }
        }
      });
  }

  getRequestDocsAndImages(req) {
    if (req.request_type == "ADD_PROPERTY") {
      // imgs
      var imgCount = 0;
      if (req.property_image_1 != "") {
        imgCount++;
      }
      if (req.property_image_2 != "") {
        imgCount++;
      }
      if (req.property_image_3 != "") {
        imgCount++;
      }
      if (req.property_image_4 != "") {
        imgCount++;
      }
      if (req.property_image_5 != "") {
        imgCount++;
      }

      // docs
      var docCount = 0;
      if (req.property_doc_1 != "") {
        docCount++;
      }
      if (req.property_doc_2 != "") {
        docCount++;
      }
      if (req.property_doc_3 != "") {
        docCount++;
      }
      if (req.property_doc_4 != "") {
        docCount++;
      }
      return `${imgCount} Images & ${docCount} pdf`;
    } else if (req.request_type == "NEW_LANDLORD_ACC") {
      var passport = JSON.parse(req.passport_pics);
      var emirates_id = JSON.parse(req.emirates_id_pics);
      var passportPicCount = 0;
      var emirates_idPicCount = 0;
      if (passport.pic2 != null || passport.pic2 != undefined) {
        passportPicCount = 2;
      } else {
        passportPicCount = 1;
      }

      if (emirates_id.pic2 != null || emirates_id.pic2 != undefined) {
        emirates_idPicCount = 2;
      } else {
        emirates_idPicCount = 1;
      }

      return `${passportPicCount + emirates_idPicCount + 2} Documents`;
    }
  }

  checkRequestsEmpty() {
    var tenantReqs = 0;
    var landlordReqs = 0;
    for (let req of this.allRequests) {
      if (req.userData.auth_type == "landlord") {
        landlordReqs++;
      } else if (req.userData.auth_type == "tenant") {
        tenantReqs++;
      }
    }

    setTimeout(() => {
      if (landlordReqs == 0) {
        this.isLandlordRequestsEmpty = true;
      }
      if (tenantReqs == 0) {
        this.isTenantRequestsEmpty = true;
      }
    }, 1000);
  }

  async acceptedNewLandlordAccRequest(req) {
    var email_data = {
      mail: req.email,
      name: req.firstname,
      unique_id: req.request_details_id,
    };

    // console.log(email_data);
    this.emailServices
      .sendEmail(JSON.stringify(email_data))
      .subscribe((res) => {
        console.log(res);
      });
    var user = JSON.parse(localStorage.getItem("currentUser"));

    var admin_data = {
      admin_id: user[0]["id"],
      req_type_name: "create_ac_req",
      approved: "true",
      unique_id: req.request_details_id,
    };

    this.adminService
      .approveRequest(JSON.stringify(admin_data))
      .subscribe((res) => {
        console.log(res);
      });
    sessionStorage.removeItem("admin_reqs_session");
    this.allRequests.length = 0;
    this.isContentLoading = true;
    await this.ngOnInit();
  }

  declineRequest(req) {
    this.dialog
      .open(DeclineRequestConfirmDialog, {
        width: "400px",
        height: "260px",
        data: {
          req_type: req.request_type,
        },
      })
      .afterClosed()
      .subscribe(async (res) => {
        if (res == true) {
          if (req.request_type == "NEW_LANDLORD_ACC") {
          } else if (req.request_type == "NEW_TENANT_ACC") {
          }
        }
      });
  }
}
