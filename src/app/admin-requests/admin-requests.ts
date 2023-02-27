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

  everyDataInitialized: boolean = false;

  allDataAssigned: boolean = false;

  noDataPresent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  allRequests: any[] = [];
  // allRequestsBH: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  allRequestsLenBH: BehaviorSubject<number> = new BehaviorSubject<number>(100);

  paymentReqsLen: number = 0;
  newLandlordReqsLen: number = 0;
  newTenantReqsLen: number = 0;

  isPaymentReqFinished: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  isNewLandlordReqFinised: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  isNewTenantReqFinised: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

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
    private emailServices?: EmailServices,
    private otherServices?: OtherServices
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

  // async ngDoCheck() {
  //   if (this.ngDoCheckInitiaized == true) {
  //     setTimeout(async () => {
  //       this.noDataPresent.subscribe(async (no_data) => {
  //         if (no_data == true) {
  //           console.log("no data present");
  //           await this.assignUsersData();
  //         } else {
  //           console.log("got data");
  //           this.ngOnDestroyInitiaized = true;
  //           this.ngOnDestroy();
  //           this.ngDoCheckInitiaized = false;
  //           setTimeout(() => {
  //             this.isContentLoading = false;
  //             sessionStorage.setItem(
  //               "admin_reqs_session",
  //               JSON.stringify({
  //                 allRequests: this.allRequests,
  //                 isLandlordRequestsEmpty: this.isLandlordRequestsEmpty,
  //                 isTenantRequestsEmpty: this.isTenantRequestsEmpty,
  //               })
  //             );
  //           }, 1000);
  //         }
  //       });
  //     }, 1000);
  //   }
  // }

  ngOnDestroy() {
    this.noDataPresent.unsubscribe();
    this.allRequestsLenBH.unsubscribe();
    this.isPaymentReqFinished.unsubscribe();
    this.isNewTenantReqFinised.unsubscribe();
    this.isNewTenantReqFinised.unsubscribe();
  }

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
      // console.log("session data available");
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
      // console.log("no session data");
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
    // this.allRequestsBH.next([]);
    this.allRequestsLenBH.next(100);
    this.paymentReqsLen = 0;
    this.newLandlordReqsLen = 0;
    this.newTenantReqsLen = 0;

    this.isPaymentReqFinished.next(false);
    this.isNewLandlordReqFinised.next(false);
    this.isNewTenantReqFinised.next(false);
    this.noDataPresent.next(false);
    this.everyDataInitialized = false;
    this.allRequestsLen = 0;
    this.allNewLandLordACCRequests.length = 0;
    this.show_more_imgLoading.length = 0;
    this.isLandlordRequestsEmpty = false;
    this.isTenantRequestsEmpty = false;
    this.allDataAssigned = false;
  }

  async checkEveryDataPresent(req: Array<any>) {
    var noDataCount = 0;

    var i = 0;
    for (let index = 0; index < req.length; index++) {
      i++;
      if (req[index].request_type == "NEW_LANDLORD_ACC") {
        if (req[index].propertyData == null || req[index].show_more == null) {
          noDataCount++;
        }
      } else if (
        req[index].request_type != "NEW_TENANT_ACC" &&
        req[index].request_type != "NEW_LANDLORD_ACC"
      ) {
        if (req[index].userData == null || req[index].show_more == null) {
          noDataCount++;
        }
      } else if (req[index].request_type == "NEW_TENANT_ACC") {
        if (req[index].show_more == null) {
          noDataCount++;
        }
      }
    }

    if (i == req.length) {
      if (noDataCount == 0) {
        this.noDataPresent.next(false);
      } else {
        this.noDataPresent.next(true);
      }
    }
  }

  async initFunction(userId) {
    await this.fetchAllRequests(userId).finally(() => {
      this.allRequestsLenBH.subscribe(async (e) => {
        // console.log(e, this.allRequests.length);
        if (e == this.allRequests.length) {
          await this.assignUsersData().finally(() => {
            setTimeout(() => {
              if (this.allDataAssigned == true) {
                this.noDataPresent.subscribe(async (no_data) => {
                  if (no_data == true) {
                    console.log("no data present");
                    await this.assignUsersData();
                  } else {
                    console.log("got data...");
                    if (this.everyDataInitialized == false) {
                      setTimeout(() => {
                        this.isContentLoading = false;
                        this.everyDataInitialized = true;
                        sessionStorage.setItem(
                          "admin_reqs_session",
                          JSON.stringify({
                            allRequests: this.allRequests,
                            isLandlordRequestsEmpty:
                              this.isLandlordRequestsEmpty,
                            isTenantRequestsEmpty: this.isTenantRequestsEmpty,
                          })
                        );
                        // this.ngOnDestroy();
                      }, 1000);
                    }
                  }
                });
              }
            }, 3000);
          });
        } else {
          // console.log("length not matched.....");
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
      .subscribe((prop_req: Array<any>) => {
        if (prop_req.length != 0) {
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
        }
      });
  }

  getAllPaymentRequests(userId) {
    this.adminService
      .getAllPaymentRequests(userId)
      .subscribe((payment_req: Array<any>) => {
        if (payment_req.length != 0) {
          var i = 0;
          for (let p of payment_req) {
            i++;
            this.allRequests.push(p);
          }

          this.paymentReqsLen = payment_req.length;

          if (i == payment_req.length) {
            this.isPaymentReqFinished.next(true);
          }
        }
      });
  }

  getAllTenantNewRegReqs(userId) {
    this.adminService
      .getAllNewTenantACCRequest(userId)
      .subscribe((new_tenant_req: Array<any>) => {
        if (new_tenant_req.length != 0) {
          var i = 0;
          for (let req of new_tenant_req) {
            i++;
            this.allRequests.push(req);
          }

          this.newTenantReqsLen = new_tenant_req.length;

          if (i == new_tenant_req.length) {
            this.isNewTenantReqFinised.next(true);
          }
        }
      });
  }

  getAllLandlordNewRegReqs(userId) {
    this.adminService
      .getAllNewLandlordACCRequest(userId)
      .subscribe((new_landlord_req: Array<any>) => {
        if (new_landlord_req.length != 0) {
          var i = 0;
          for (let req of new_landlord_req) {
            i++;
            this.allRequests.push(req);
          }

          this.newLandlordReqsLen = new_landlord_req.length;

          if (i == new_landlord_req.length) {
            this.isNewLandlordReqFinised.next(true);
          }
        }
      });
  }

  async fetchAllRequests(userId) {
    await this.getAllAddPropertyRequests(userId).finally(() => {
      this.isPaymentReqFinished.subscribe((pay_val) => {
        this.isNewTenantReqFinised.subscribe((tenant_val) => {
          this.isNewTenantReqFinised.subscribe((landlord_val) => {
            if (pay_val == true && tenant_val == true && landlord_val == true) {
              this.allRequestsLenBH.next(
                this.allRequestsLen +
                  this.paymentReqsLen +
                  this.newTenantReqsLen +
                  this.newLandlordReqsLen
              );
            }
          });
        });
      });
    });
  }

  async assignUsersData() {
    // console.log("assigning data...");
    var i = 0;
    for (let req of this.allRequests) {
      i++;
      if (req.request_type == "NEW_LANDLORD_ACC") {
        if (req.propertyData == null || req.show_more == null) {
          if (req.propertyData == null) {
            for (let new_lndlrd_req of this.allNewLandLordACCRequests) {
              if (req.request_details_id == new_lndlrd_req.unique_id) {
                await Object.assign(req, { propertyData: new_lndlrd_req });
                if (req.show_more == null) {
                  await Object.assign(req, { show_more: false });
                }
              }
            }
          } else if (req.show_more == null) {
            await Object.assign(req, { show_more: false });
          }
        }
      } else if (req.request_type == "NEW_TENANT_ACC") {
        if (req.show_more == null) {
          await Object.assign(req, { show_more: false });
        }
      } else {
        if (req.userData == null || req.show_more == null) {
          if (req.userData == null) {
            this.apiService
              .getUser(req["user_id"])
              .subscribe(async (userDetails) => {
                if (req) {
                  await Object.assign(req, { userData: userDetails[0] });
                  if (req.show_more == null) {
                    await Object.assign(req, { show_more: false });
                  }
                }
              });
          } else if (req.show_more == null) {
            await Object.assign(req, { show_more: false });
          }
        }
      }
    }

    if (i == this.allRequests.length) {
      await this.checkEveryDataPresent(this.allRequests);
      setTimeout(() => {
        this.allDataAssigned = true;
      }, 2000);
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
            // this.otherServices.adminRequestGotApproved.next(true);
          } else if (req.request_type == "NEW_TENANT_ACC") {
            await this.acceptedNewTenantAccRequest(req);
            // this.otherServices.adminRequestGotApproved.next(true);
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
      auth_type: req.auth_type,
    };

    // console.log(email_data);
    this.emailServices
      .sendEmail(JSON.stringify(email_data))
      .subscribe((res) => {
        // console.log(res);
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
        // console.log(res);
      });
    sessionStorage.removeItem("admin_reqs_session");
    this.clearAllVariables();
    this.isContentLoading = true;
    setTimeout(async () => {
      await this.initFunction(user[0]["id"]);
      sessionStorage.setItem(
        "admin_reqs_fetched_time",
        JSON.stringify(new Date().getMinutes())
      );
    }, 1000);
  }

  async acceptedNewTenantAccRequest(req) {
    var email_data = {
      mail: req.email,
      name: req.firstname,
      unique_id: req.request_details_id,
      auth_type: req.auth_type,
    };

    // console.log(email_data);
    this.emailServices
      .sendEmail(JSON.stringify(email_data))
      .subscribe((res) => {
        // console.log(res);
      });
    var user = JSON.parse(localStorage.getItem("currentUser"));

    var admin_data = {
      admin_id: user[0]["id"],
      req_type_name: "create_ac_req_tenant",
      approved: "true",
      unique_id: req.request_details_id,
    };

    this.adminService
      .approveRequest(JSON.stringify(admin_data))
      .subscribe((res) => {
        // console.log(res);
      });
    sessionStorage.removeItem("admin_reqs_session");
    this.clearAllVariables();
    this.isContentLoading = true;
    setTimeout(async () => {
      await this.initFunction(user[0]["id"]);
      sessionStorage.setItem(
        "admin_reqs_fetched_time",
        JSON.stringify(new Date().getMinutes())
      );
    }, 1000);
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
            this.landlordRequestDecline(req);
          } else if (req.request_type == "NEW_TENANT_ACC") {
            this.tenantRequestDecline(req);
          }
        }
      });
  }

  tenantRequestDecline(req) {
    var user = JSON.parse(localStorage.getItem("currentUser"));

    var admin_data = {
      admin_id: user[0]["id"],
      req_type_name: "create_ac_req_tenant",
      declined: "true",
      unique_id: req.request_details_id,
    };
    this.adminService
      .declineRegisterToken(JSON.stringify(admin_data))
      .subscribe((e) => {});

    sessionStorage.removeItem("admin_reqs_session");
    this.clearAllVariables();
    this.isContentLoading = true;
    setTimeout(async () => {
      await this.initFunction(user[0]["id"]);
      sessionStorage.setItem(
        "admin_reqs_fetched_time",
        JSON.stringify(new Date().getMinutes())
      );
    }, 1000);
  }

  landlordRequestDecline(req) {
    var user = JSON.parse(localStorage.getItem("currentUser"));

    var admin_data = {
      admin_id: user[0]["id"],
      req_type_name: "create_ac_req",
      declined: "true",
      unique_id: req.request_details_id,
    };
    this.adminService
      .declineRegisterToken(JSON.stringify(admin_data))
      .subscribe((e) => {});

    sessionStorage.removeItem("admin_reqs_session");
    this.clearAllVariables();
    this.isContentLoading = true;
    setTimeout(async () => {
      await this.initFunction(user[0]["id"]);
      sessionStorage.setItem(
        "admin_reqs_fetched_time",
        JSON.stringify(new Date().getMinutes())
      );
    }, 1000);
  }
}
