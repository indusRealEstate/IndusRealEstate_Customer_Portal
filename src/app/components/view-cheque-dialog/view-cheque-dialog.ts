import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "view-cheque-dialog",
  styleUrls: ["./view-cheque-dialog.scss"],
  templateUrl: "./view-cheque-dialog.html",
})
export class ViewChequeDialog implements OnInit {
  cheque_data: any = "";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewChequeDialog>
  ) {
    this.cheque_data = data;
    console.log(data);
  }

  ngOnInit() {}

  onCloseDialog() {
    this.dialogRef.close();
  }
}
