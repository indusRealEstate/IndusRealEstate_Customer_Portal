import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AdminService } from "app/services/admin.service";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";

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
  imagesUrl: any;

  isLandlordRequestsEmpty: boolean = false;
  isTenantRequestsEmpty: boolean = false;

  categoryAllRequests: "fixtures" | "payments" | "cat_3" | "cat_4" = "fixtures";
  propertyTypeAllRequests: "all" | "villa" | "appartment" = "all";

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private adminService: AdminService
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

    if (diff >= 5) {
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
        }, 3000);
      }
    });

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);

    setTimeout(() => {
      sessionStorage.setItem(
        "admin_reqs_session",
        JSON.stringify({
          allRequests: this.allRequests,
          isLandlordRequestsEmpty: this.isLandlordRequestsEmpty,
          isTenantRequestsEmpty: this.isTenantRequestsEmpty,
        })
      );
    }, 10000);
  }

  async fetchAllRequests(userId) {
    var reqLen = 0;
    this.adminService
      .getAllAddPropertyRequests(userId)
      .subscribe((prop_req: Array<any>) => {
        this.allRequests = prop_req;
        reqLen = prop_req.length;
      });

    setTimeout(() => {
      this.adminService
        .getAllPaymentRequests(userId)
        .subscribe(async (payment_req: Array<any>) => {
          var i = 0;
          for (let p of payment_req) {
            i++;
            this.allRequests.push(p);
          }

          if (payment_req.length == i) {
            reqLen = reqLen + payment_req.length;
            await this.assignUsersData();
            this.checkRequestsEmpty();
          }
        });
    }, 300);

    return reqLen;
  }

  async assignUsersData() {
    for (let req of this.allRequests) {
      this.apiService.getUser(req["user_id"]).subscribe((userDetails) => {
        if (req) {
          Object.assign(req, { userData: userDetails[0] });
          Object.assign(req, { show_more: false });
        }
      });
    }
  }

  expandRequestCard(index) {
    if (this.allRequests[index].show_more == false) {
      this.allRequests[index].show_more = true;
    } else {
      this.allRequests[index].show_more = false;
    }
  }

  getRequestDocsAndImages(req) {
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
}
