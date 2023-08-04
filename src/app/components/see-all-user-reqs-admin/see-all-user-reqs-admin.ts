import { Component, OnInit, Inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ApiService } from "app/services/api.service";

@Component({
  selector: "see-all-user-reqs-admin",
  styleUrls: ["./see-all-user-reqs-admin.scss"],
  templateUrl: "./see-all-user-reqs-admin.html",
})
export class SeeAllUserReqsAdminDialog implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SeeAllUserReqsAdminDialog>,
    private apiService: ApiService,
    private router: Router,
    private dialog?: MatDialog
  ) {
    this.all_reqs = data["reqs"];
    this.reqs_loading = true;
  }

  all_reqs: any[];

  reqs_loading: boolean = false;

  ngOnInit() {
    this.reqs_loading = false;
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
    } else if (req_type == "ADD_PROPERTY_REC_EXIST_LANDLORD") {
      return "Request for Adding new Property";
    }
  }
}
