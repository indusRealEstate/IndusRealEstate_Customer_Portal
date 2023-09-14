import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { DownloadService } from "app/services/download.service";
import { PaymentService } from "app/services/payment.service";
import * as FileSaver from "file-saver";
import { ViewChequeDialog } from "../view-cheque-dialog/view-cheque-dialog";

@Component({
  selector: "payment-details-dialog",
  styleUrls: ["./payment-details-dialog.scss"],
  templateUrl: "./payment-details-dialog.html",
})
export class PaymentDetailsDialog implements OnInit {
  all_data: any;

  attachments: any[] = [];

  isContentLoading: boolean = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PaymentDetailsDialog>,
    private router: Router,
    private downloadService: DownloadService,
    private paymentService: PaymentService,
    private dialog: MatDialog
  ) {
    this.paymentService
      .getPaymentAllDetails(
        JSON.stringify({
          payment_id: data.id,
          method: data.method,
        })
      )
      .subscribe((res) => {
        console.log(res);
        this.all_data = res;
        this.attachments = JSON.parse(res.payment_documents);
      })
      .add(() => {
        this.isContentLoading = false;
      });
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  downloadDoc(item) {
    this.downloadService
      .downloadFile(`payment/${this.all_data.payment_uid}/documents/${item}`)
      .subscribe((res: any) => {
        FileSaver.saveAs(res, item);
      });
  }

  onCloseDialog() {
    this.dialogRef.close();
  }

  navigateToProprety(prop_id: any) {
    this.onCloseDialog();
    this.router.navigate(["/property-details"], {
      queryParams: {
        prop_id: prop_id,
      },
    });
  }

  navigateToUnit(unit_id: any) {
    this.onCloseDialog();
    this.router.navigate(["/property-unit-details"], {
      queryParams: { unit_id: unit_id },
    });
  }

  navigateToUserDetails(user_id: any, auth) {
    this.onCloseDialog();
    this.router.navigate(["/user-details"], {
      queryParams: { user_id: user_id, auth: auth },
    });
  }

  viewCheque(cheque) {
    this.dialog
      .open(ViewChequeDialog, {
        width: "50%",
        data: cheque,
      })
      .afterClosed()
      .subscribe((res) => {});
  }
}
