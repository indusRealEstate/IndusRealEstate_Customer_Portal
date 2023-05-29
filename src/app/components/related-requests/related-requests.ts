import { Component, OnInit, Inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { ReviewRequestDialog } from "../review_req_dialog/review_req_dialog";

@Component({
  selector: "view-related-requests",
  styleUrls: ["./related-requests.scss"],
  templateUrl: "./related-requests.html",
})
export class RelatedRequestsDialog implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RelatedRequestsDialog>,
    private apiService: ApiService,
    private router: Router,
    private dialog?: MatDialog
  ) {
    this.prop_id = data["prop_id"];
    this.reqs_loading = true;
  }

  prop_id: any;

  prop_reqs: any[];

  reqs_loading: boolean = false;

  doc_path: any;

  ngOnInit() {
    this.apiService
      .getPropertyRequests(this.prop_id)
      .subscribe((val: any[]) => {
        this.prop_reqs = val;
        setTimeout(() => {
          this.reqs_loading = false;
        }, 100);
      });
  }

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close();
  }

  getRequestType(req_type) {
    if (req_type == "MAINTENANCE_REQ") {
      return "Maintenance Request";
    } else if (req_type == "TENANT_MOVE_IN") {
      return "Tenant Move in Request";
    } else if (req_type == "TENANT_MOVE_OUT") {
      return "Tenant Move out Request";
    } else if (req_type == "CONDITIONING_REQ") {
      return "Property Conditioning Request";
    } else if (req_type == "PAYMENT") {
      return "Payment Request";
    } else if (req_type == "INSPECTION_REQ") {
      return "Inspection Request";
    }
  }

  reviewRequest(req) {
    this.dialog
      .open(ReviewRequestDialog, {
        width: "65%",
        height: "45rem",
        data: {
          req_data: req,
          section: "prop-related-reqs",
        },
      })
      .afterClosed()
      .subscribe(async (res) => {});
  }
}
