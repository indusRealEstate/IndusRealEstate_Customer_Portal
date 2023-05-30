import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { SeeAllUserReqsAdminDialog } from "app/components/see-all-user-reqs-admin/see-all-user-reqs-admin";
import { ViewDocDialog } from "app/components/view-doc-dialog/view-doc-dialog";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";

@Component({
  selector: "admin-request-review-page",
  templateUrl: "./admin-request-review-page.html",
  styleUrls: ["./admin-request-review-page.scss"],
})
export class ReviewRequestAdmin implements OnInit {
  isUserSignedIn: boolean = false;

  req: any;

  user_to_details: any;
  // req_for: any;
  landlord_details: any;
  landlord_tenant_count: any;

  profile_img_loading: boolean = false;

  user_total_reqs: any = 0;
  user_approved_reqs: any = 0;
  user_pending_reqs: any = 0;
  user_review_reqs: any = 0;
  user_declined_reqs: any = 0;

  user_all_req: any[] = [];

  usrImgPath: any = "https://indusre.app/api/upload/img/user/";

  @ViewChild("status_update_mini_bar") status_update_mini_bar: ElementRef;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private otherServices: OtherServices,
    private apiServices: ApiService,
    private dialog?: MatDialog
  ) {
    this.profile_img_loading = true;
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
      var userData = localStorage.getItem("currentUser");
      var user = JSON.parse(userData);

      if (user[0]["auth_type"] == "admin") {
        this.route.queryParams.subscribe((e) => {
          this.initFunction(e);
        });
      } else {
        router.navigate(["/"]);
      }
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  initFunction(param) {
    this.req = JSON.parse(this.otherServices.decodeBase64(param.req));

    var adminReqDataSession: any[] = JSON.parse(
      sessionStorage.getItem("admin_reqs_session")
    );

    if (
      this.req.request_type != "NEW_LANDLORD_REQ" &&
      this.req.request_type != "NEW_TENANT_AC" &&
      this.req != undefined
    ) {
      var tenant_uid = new String(this.req.profile_photo).split(".")[0];
      var landlord_uid = this.req.user_id;

      for (let index = 0; index < adminReqDataSession.length; index++) {
        if (this.req.auth_type == "tenant") {
          var temp_uid = new String(
            adminReqDataSession[index].profile_photo
          ).split(".")[0];
          if (temp_uid == tenant_uid) {
            this.user_all_req.push(adminReqDataSession[index]);
            this.user_total_reqs++;

            if (adminReqDataSession[index].status == "approved") {
              this.user_approved_reqs++;
            }

            if (adminReqDataSession[index].status == "pending") {
              this.user_pending_reqs++;
            }

            if (adminReqDataSession[index].status == "review") {
              this.user_review_reqs++;
            }

            if (adminReqDataSession[index].status == "declined") {
              this.user_declined_reqs++;
            }
          }
        } else if (this.req.auth_type == "landlord") {
          if (adminReqDataSession[index].auth_type != "tenant") {
            if (adminReqDataSession[index].user_id == landlord_uid) {
              this.user_all_req.push(adminReqDataSession[index]);
              this.user_total_reqs++;
              console.log(adminReqDataSession[index].user_id);

              if (adminReqDataSession[index].status == "approved") {
                this.user_approved_reqs++;
              }

              if (adminReqDataSession[index].status == "pending") {
                this.user_pending_reqs++;
              }

              if (adminReqDataSession[index].status == "review") {
                this.user_review_reqs++;
              }

              if (adminReqDataSession[index].status == "declined") {
                this.user_declined_reqs++;
              }
            }
          }
        }
      }
    }

    console.log(this.req);

    if (
      this.req.request_type != "NEW_LANDLORD_REQ" &&
      this.req.request_type != "NEW_TENANT_AC" &&
      this.req.request_type != "ADD_PROPERTY_REC_EXIST_LANDLORD" &&
      this.req != undefined
    ) {
      var uid: any;
      if (this.req.auth_type == "landlord") {
        uid = this.req.req_to_id;
      } else if (this.req.auth_type == "tenant") {
        uid = new String(this.req.profile_photo).split(".")[0];
      }

      this.apiServices
        .getLandlordDetails(uid)
        .subscribe((val) => {
          this.landlord_details = val[0];

          console.log(this.landlord_details);
        })
        .add(() => {
          this.apiServices
            .getLandlordTenants(this.landlord_details.landlord_id)
            .subscribe((val: any[]) => {
              this.landlord_tenant_count = val.length;
            });
        });
    }

    setTimeout(() => {
      this.profile_img_loading = false;
    }, 1000);
  }

  viewStatusChangeBar() {
    this.status_update_mini_bar.nativeElement.style.display == "none"
      ? (this.status_update_mini_bar.nativeElement.style.display = "block")
      : (this.status_update_mini_bar.nativeElement.style.display = "none");
  }

  ngAfterViewInit() {}

  ngOnInit() {}

  viewUserAllReqs() {
    this.dialog.open(SeeAllUserReqsAdminDialog, {
      data: {
        reqs: this.user_all_req,
      },
      width: "60%",
      height: "45rem",
    });
  }

  requestFor() {
    var req_type = this.req.request_type;
    if (req_type == "NEW_LANDLORD_REQ") {
      return "Admin";
    } else if (req_type == "NEW_TENANT_AC") {
      return "Admin";
    } else if (req_type == "ADD_PROPERTY_REC_EXIST_LANDLORD") {
      return "Admin";
    } else {
      if (this.req.auth_type == "landlord") {
        return "Tenant";
      } else if (this.req.auth_type == "tenant") {
        return "Landlord";
      }
    }
  }

  requestedBy() {
    var req_type = this.req.request_type;
    if (req_type == "NEW_LANDLORD_REQ") {
      return "New Landlord";
    } else if (req_type == "NEW_TENANT_AC") {
      return "New Tenant";
    } else if (req_type == "ADD_PROPERTY_REC_EXIST_LANDLORD") {
      return "Landlord";
    } else {
      if (this.req.auth_type == "landlord") {
        return "Landlord";
      } else if (this.req.auth_type == "tenant") {
        return "Tenant";
      }
    }
  }

  getRequestId() {
    var req_type = this.req.request_type;
    if (req_type == "NEW_LANDLORD_REQ") {
      return this.req.request_details_id;
    } else if (req_type == "NEW_TENANT_AC") {
      return this.req.unique_id;
    } else if (req_type == "ADD_PROPERTY_REC_EXIST_LANDLORD") {
      return this.req.property_req_id;
    } else if (req_type == "PAYMENT") {
      return this.req.request_id;
    } else {
      return this.req.request_no;
    }
  }

  getIssuedDate() {
    var req_type = this.req.request_type;
    if (
      req_type == "NEW_LANDLORD_REQ" ||
      req_type == "NEW_TENANT_AC" ||
      req_type == "PAYMENT"
    ) {
      return this.req.issue_date;
    } else if (req_type == "ADD_PROPERTY_REC_EXIST_LANDLORD") {
      return this.req.property_issue_date;
    } else {
      return this.req.created_date;
    }
  }

  getRequestType() {
    var req_type = this.req.request_type;
    if (req_type == "NEW_LANDLORD_REQ") {
      return "Request for new Landlord Account";
    } else if (req_type == "NEW_TENANT_AC") {
      return "Request for new Tenant Account";
    } else if (req_type == "ADD_PROPERTY_REC_EXIST_LANDLORD") {
      return "Add New Property Request";
    } else if (req_type == "PAYMENT") {
      return "Payment Request";
    } else if (req_type == "INSPECTION_REQ") {
      return "Inspection Request";
    } else if (req_type == "CONDITIONING_REQ") {
      return "Property Conditioning Request";
    } else if (req_type == "MAINTENANCE_REQ") {
      return "Maintenance Request";
    } else if (req_type == "TENANT_MOVE_IN") {
      return "Tenant Move-in Request";
    } else if (req_type == "TENANT_MOVE_OUT") {
      return "Tenant Move-out Request";
    }
  }

  getRequestStatus() {
    var status = this.req.status;
    if (status == "pending") {
      return "pending-status";
    } else if (status == "approved") {
      return "approved-status";
    } else if (status == "declined") {
      return "declined-status";
    } else if (status == "review") {
      return "review-status";
    }
  }

  viewRequestDoc() {
    var req_type = this.req.request_type;
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    if (req_type != "ADD_PROPERTY_REC_EXIST_LANDLORD") {
      if (req_type == "PAYMENT") {
        var document = {
          path: this.req.payment_doc_path,
        };
      } else {
        var document = {
          path: this.req.doc_path,
        };
      }
    }

    this.dialog.open(ViewDocDialog, {
      data: {
        doc: document,
        user_id: user[0]["id"],
        type: "request-doc",
      },
      width: "60%",
      height: "45rem",
    });
  }
}
