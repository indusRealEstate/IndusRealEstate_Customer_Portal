import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { ViewDocDialog } from "app/components/view-doc-dialog/view-doc-dialog";
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

  @ViewChild("status_update_mini_bar") status_update_mini_bar: ElementRef;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private otherServices: OtherServices,
    private dialog?: MatDialog
  ) {
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

    console.log(this.req);
  }

  viewStatusChangeBar() {
    this.status_update_mini_bar.nativeElement.style.display == "none"
      ? (this.status_update_mini_bar.nativeElement.style.display = "block")
      : (this.status_update_mini_bar.nativeElement.style.display = "none");
  }

  ngAfterViewInit() {}

  ngOnInit() {}

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
