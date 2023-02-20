import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { AdminService } from "app/services/admin.service";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { EmailServices } from "app/services/email.service";
import { OtherServices } from "app/services/other.service";
import { AcceptRequestConfirmDialog } from "./accept_req_dialog/acspt_req_dialog";

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

  async ngDoCheck() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    if (this.isContentLoading == false) {
      for (let index = 0; index < this.allRequests.length; index++) {
        if (this.allRequests[index].request_type != "NEW_LANDLORD_ACC") {
          if (
            this.allRequests[index]["userData"] == null ||
            this.allRequests[index]["userData"] == undefined
          ) {
            console.log("issue spotted -- reloading");
            this.contentLoadingTime = this.contentLoadingTime + 1000;
            this.isContentLoading = true;
            this.clearAllVariables();
            sessionStorage.removeItem("admin_reqs_fetched_time");
            sessionStorage.removeItem("admin_reqs_session");
            await this.initFunction(user[0]["id"]);
            sessionStorage.setItem(
              "admin_reqs_fetched_time",
              JSON.stringify(new Date().getMinutes())
            );
          } else {
            console.log("no issue");
          }
        } else {
          if (
            this.allRequests[index]["propertyData"] == null ||
            this.allRequests[index]["propertyData"] == undefined
          ) {
            console.log("issue spotted -- reloading");
            this.contentLoadingTime = this.contentLoadingTime + 1000;
            this.isContentLoading = true;
            this.clearAllVariables();
            sessionStorage.removeItem("admin_reqs_fetched_time");
            sessionStorage.removeItem("admin_reqs_session");
            await this.initFunction(user[0]["id"]);
            sessionStorage.setItem(
              "admin_reqs_fetched_time",
              JSON.stringify(new Date().getMinutes())
            );
          } else {
            console.log("no issue");
          }
        }
      }
    }
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

  async initFunction(userId) {
    await this.fetchAllRequests(userId).then((req_len) => {
      if (req_len == this.allRequests.length) {
        setTimeout(() => {
          this.isContentLoading = false;
          setTimeout(() => {
            sessionStorage.setItem(
              "admin_reqs_session",
              JSON.stringify({
                allRequests: this.allRequests,
                isLandlordRequestsEmpty: this.isLandlordRequestsEmpty,
                isTenantRequestsEmpty: this.isTenantRequestsEmpty,
              })
            );
          }, 500);
        }, this.contentLoadingTime);
      }
    });

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  async fetchAllRequests(userId) {
    var reqLen = 0;
    this.adminService
      .getAllAddPropertyRequests(userId)
      .subscribe((prop_req: Array<any>) => {
        this.allRequests = prop_req;
        reqLen = prop_req.length;

        for (let index = 0; index < this.allRequests.length; index++) {
          if (this.allRequests[index].request_type == "NEW_LANDLORD_ACC") {
            this.allNewLandLordACCRequests.push(this.allRequests[index]);
            this.allRequests.splice(index, 1);
            reqLen--;
          }
        }
      });

    setTimeout(() => {
      this.adminService
        .getAllPaymentRequests(userId)
        .subscribe((payment_req: Array<any>) => {
          var i = 0;
          for (let p of payment_req) {
            i++;
            this.allRequests.push(p);
          }

          if (payment_req.length == i) {
            this.adminService
              .getAllNewLandlordACCRequest(userId)
              .subscribe(async (new_landlord_req: Array<any>) => {
                var j = 0;
                for (let req of new_landlord_req) {
                  j++;
                  this.allRequests.push(req);
                }

                if (new_landlord_req.length == j) {
                  reqLen =
                    reqLen + payment_req.length + new_landlord_req.length;
                  await this.assignUsersData();
                  this.checkRequestsEmpty();
                }
              });
          }
        });
    }, 1000);

    return reqLen;
  }

  async assignUsersData() {
    for (let req of this.allRequests) {
      if (req.request_type != "NEW_LANDLORD_ACC") {
        this.apiService
          .getUser(req["user_id"])
          .subscribe(async (userDetails) => {
            if (req) {
              await Object.assign(req, { userData: userDetails[0] });
              await Object.assign(req, { show_more: false });
            }
          });
      } else {
        for (let new_lndlrd_req of this.allNewLandLordACCRequests) {
          if (req.request_details_id == new_lndlrd_req.unique_id) {
            await Object.assign(req, { propertyData: new_lndlrd_req });
            await Object.assign(req, { show_more: false });
          }
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
        height: "250px",
        data: {
          req_type: req.request_type,
        },
      })
      .afterClosed()
      .subscribe(async (res) => {
        if (res == true) {
          if (req.request_type == "NEW_LANDLORD_ACC") {
            await this.acceptedNewLandlordAccRequest(req);
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
  }
}
