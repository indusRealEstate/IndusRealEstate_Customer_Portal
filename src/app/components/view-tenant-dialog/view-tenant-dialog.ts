import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ApiService } from "app/services/api.service";

@Component({
  selector: "view-tenant-dialog",
  styleUrls: ["./view-tenant-dialog.scss"],
  templateUrl: "./view-tenant-dialog.html",
})
export class ViewTenantDialog implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewTenantDialog>,
  ) {
    this.tenant_data = data["data"];
  }
  
  tenant_data: any;

  ngOnInit() {}

  onCloseDialog() {
    this.dialogRef.close();
  }
}
