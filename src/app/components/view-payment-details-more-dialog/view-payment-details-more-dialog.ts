import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
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
  parent: string;
  sub_parent: string;
  child: string;
  method: string;
  all_data: any;
  is_data_loaded: boolean = false;
  displayedColumns: string[] = [];
  displayPreloadCol: String[] = [];
  data_source: MatTableDataSource<any>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewPaymentDetailsMoreDialog>,
    private adminService: AdminService
  ) {
    switch (data.method) {
      case "cheque":
        this.is_cheque = true;
        this.displayedColumns = [
          "cheque_number",
          "cheque_date",
          "name_on_cheque",
        ];
        this.displayPreloadCol = [
          "Cheque Number",
          "Cheque Date",
          "Name On Cheque",
        ];
        break;
      case "online":
        this.is_online = true;
        this.displayedColumns = [
          "bank_name",
          "branch",
          "account_number",
          "name_of_holder",
          "iban",
        ];
        this.displayPreloadCol = [
          "Bank Name",
          "Branch",
          "Account Number",
          "Name of Holder",
          "IBAN",
        ];

        break;
      case "cash":
        this.is_cash = true;
        this.displayedColumns = ["details"];
        this.displayPreloadCol = ["Details"];
        break;
    }

    this.parent = data.parent;
    this.sub_parent = data.sub_parent;
    this.child = data.child;
    this.method = data.method;

    this.adminService
      .selectPaymentAccordeingToTheMothod(data)
      .subscribe((value) => {
        this.all_data = value;
        this.is_data_loaded = true;
        this.data_source = new MatTableDataSource<any>([this.all_data]);
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

  capitalizeAllWords(str) {
    return str.replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
