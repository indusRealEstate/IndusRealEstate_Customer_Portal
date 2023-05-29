import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { RelatedDocsDialog } from "../related-documents/related-documents";
import { RequestTimelineComponent } from "../request-timeline/request-timeline";
import { ViewDocDialog } from "../view-doc-dialog/view-doc-dialog";
import { ViewTenantDialog } from "../view-tenant-dialog/view-tenant-dialog";

@Component({
  selector: "review_req_dialog",
  styleUrls: ["./review_req_dialog.scss"],
  templateUrl: "./review_req_dialog.html",
})
export class ReviewRequestDialog implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ReviewRequestDialog>,
    private apiService: ApiService,
    private router: Router,
    private dialog?: MatDialog
  ) {
    this.request_data = data["req_data"];
    this.req_section = data["section"];
  }

  request_data: any;
  req_section: any;

  mouseEnterUserTab: boolean = false;
  usrImgPath: any = "https://indusre.app/api/upload/img/user/";

  @ViewChild("req_procs") req_procs: RequestTimelineComponent;
  @ViewChild("user_data_mini_tab") user_data_mini_tab: ElementRef;

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.req_procs != undefined) {
      this.req_procs.setupProcess(this.request_data.status);
    }
  }

  onCloseDialog() {
    this.dialogRef.close();
  }

  navigateToPropertyDetailsPage() {
    this.dialogRef.close();
    this.router.navigate(["/property-page"], {
      queryParams: { propertyId: this.request_data.property_id },
    });
  }

  viewRelatedDoc() {
    this.dialog.open(RelatedDocsDialog, {
      data: {
        prop_id: this.request_data.property_id,
      },
      width: "60%",
      height: "45rem",
    });
  }

  viewUserDetailsMiniTab(state) {
    if (state == "enter") {
      // setTimeout(() => {
      this.user_data_mini_tab.nativeElement.style.display = "block";
      // }, 500);
    } else if (state == "leave") {
      this.user_data_mini_tab.nativeElement.style.display = "none";
    }
  }

  openUserDetails() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    if (user[0]["auth_type"] == "landlord") {
      this.dialog.open(ViewTenantDialog, {
        data: {
          data: this.request_data,
        },
        width: "65%",
        height: "45rem",
      });
    }
  }

  getRequestType() {
    var req_type = this.request_data.request_type;
    if (req_type == "ADD_PROPERTY_REC_EXIST_LANDLORD") {
      return "Add New Property Request";
    } else if (req_type == "INSPECTION_REQ") {
      return "Inspection Request";
    } else if (req_type == "PAYMENT") {
      return "Payment Request";
    } else if (req_type == "MAINTENANCE_REQ") {
      return "Maintenance Request";
    } else if (req_type == "TENANT_MOVE_IN") {
      return "Tenant Move in Request";
    } else if (req_type == "TENANT_MOVE_OUT") {
      return "Tenant Move out Request";
    } else if (req_type == "CONDITIONING_REQ") {
      return "Property Conditioning Request";
    } else if (req_type == "PAYMENT") {
      return "Payment Request";
    }
  }

  getRequestStatus(status) {
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

  getReqSection() {
    if (this.req_section == "my-reqs") {
      return "My Requests";
    } else if (this.req_section == "recent") {
      return "My History";
    } else if (this.req_section == "payment") {
      return "Payment Requests";
    } else if (this.req_section == "conditioning") {
      return "Property Conditioning Requests";
    } else if (this.req_section == "maintenance") {
      return "Maintenance Requests";
    } else if (this.req_section == "move-in") {
      return "Tenant Move-in Requests";
    } else if (this.req_section == "move-out") {
      return "Tenant Move-out Requests";
    } else if (this.req_section == "inspection") {
      return "Property Inspection Requests";
    } else if (this.req_section == "prop-related-reqs") {
      return "Property Related Requests";
    }
  }

  getUserAppState() {
    return "online-app-status";
  }

  viewRequestDoc() {
    var req_type = this.request_data.request_type;
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    if (req_type != "ADD_PROPERTY_REC_EXIST_LANDLORD") {
      if (req_type == "PAYMENT") {
        var document = {
          path: this.request_data.payment_doc_path,
        };
      } else {
        var document = {
          path: this.request_data.doc_path,
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
