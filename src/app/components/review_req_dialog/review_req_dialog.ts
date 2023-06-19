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
import { ViewTenantDialog } from "../view-tenant-dialog/view-tenant-dialog";
import { ChatService } from "app/services/chat.service";

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
    private chatService: ChatService,
    private router: Router,
    private dialog?: MatDialog
  ) {
    this.request_data = data["req_data"];
    this.req_section = data["section"];
  }

  is_user_online: boolean = false;
  request_data: any;
  req_section: any;

  mouseEnterUserTab: boolean = false;
  usrImgPath: any = "https://indusre.app/api/upload/img/user/";

  @ViewChild("req_procs") req_procs: RequestTimelineComponent;
  @ViewChild("user_data_mini_tab") user_data_mini_tab: ElementRef;

  ngOnInit() {
    if (this.req_section != "my-reqs" && this.req_section != "recent") {
      var requested_user_id = new String(this.request_data.profile_photo).split(
        "."
      )[0];
      this.chatService.new_joined_users.subscribe((n_j_u) => {
        n_j_u.forEach((v) => {
          if (v.user_id == requested_user_id) {
            this.is_user_online = true;
          }
        });
      });

      this.chatService.leaved_user.subscribe((l_u) => {
        if (l_u.user_id == requested_user_id) {
          this.is_user_online = false;
        }
      });
    }
  }

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
    if (this.req_section != "my-reqs" && this.req_section != "recent") {
      if (state == "enter") {
        // setTimeout(() => {
        this.user_data_mini_tab.nativeElement.style.display = "block";
        // }, 500);
      } else if (state == "leave") {
        this.user_data_mini_tab.nativeElement.style.display = "none";
      }
    }
  }

  changeStatus() {
    if (
      this.request_data.status == "pending" ||
      this.request_data.status == "review"
    ) {
      return "Approve";
    } else {
      return "Audit Again";
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
    if (this.is_user_online == true) {
      return "online-app-status";
    } else {
      return "offline-app-status";
    }
  }

  viewRequestDoc() {
    var req_type = this.request_data.request_type;

    var path = this.apiService.getBaseUrlDocs();
    if (req_type != "ADD_PROPERTY_REC_EXIST_LANDLORD") {
      if (req_type == "PAYMENT") {
        var doc_path = this.request_data.payment_doc_path;
      } else {
        var doc_path = this.request_data.doc_path;
      }

      var document_url = `${path}/${doc_path}`;
    }

    this.apiService.downloadFile(document_url).subscribe((v) => {
      // console.log(v);
      const url = window.URL.createObjectURL(v);
      window.open(url);
    });
  }
}
