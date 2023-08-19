import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AdminService } from "app/services/admin.service";

@Component({
  selector: "view-income-statement-dialog",
  styleUrls: ["./view-payment-details-more-dialog.scss"],
  templateUrl: "./view-payment-details-more-dialog.html",
})
export class ViewPaymentDetailsMoreDialog implements OnInit {
  is_cheque: boolean = false;
  is_online: boolean = false;
  is_cash: boolean = false;

  all_data: any; 

  is_data_loaded: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewPaymentDetailsMoreDialog>,
    private adminService: AdminService
  ) {
    switch (data.method) {
      case "cheque":
        this.is_cheque = true;
        break;
      case "online":
        this.is_online = true;
        break;
      case "cash":
        this.is_cash = true;
        break;
    }

    this.adminService
      .selectPaymentAccordeingToTheMothod(data)
      .subscribe((value) => {
        this.all_data = value;
        this.is_data_loaded = true;
        console.log(this.all_data);
      })
      .add(() => {
        this.is_data_loaded = true;
      });
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close();
  }
}
