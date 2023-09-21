import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AdminService } from "app/services/admin.service";

@Component({
  selector: "view-created-user-details-dialog",
  styleUrls: ["./view-created-user-details-dialog.scss"],
  templateUrl: "./view-created-user-details-dialog.html",
})
export class ViewCreatedUserDetailsDialog implements OnInit {
  user_data: any = "";
  created_time: any = "";
  type: any = "";
  isContentLoading: boolean = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewCreatedUserDetailsDialog>,
    public adminService: AdminService
  ) {
    if (data.type == "user") {
      this.created_time = data.details.joined_date;
    } else if (data.type == "announcement" || data.type == "payment") {
      this.created_time = data.details.date;
    } else {
      this.created_time = data.details.created_date;
    }

    this.type = data.type;

    adminService
      .getAdminDetails(
        JSON.stringify({ user_id: data.details.created_user_id })
      )
      .subscribe((user) => {
        this.user_data = user;
      })
      .add(() => {
        this.isContentLoading = false;
      });
  }

  ngOnInit() {}

  onCloseDialog() {
    this.dialogRef.close();
  }
}
