import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "caution-dialog",
  styleUrls: ["./caution-dialog.scss"],
  templateUrl: "./caution-dialog.html",
})
export class CautionDialog implements OnInit {
  title: any = "";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CautionDialog>
  ) {
    this.title = data.title;
  }

  ngOnInit() {}

  onCloseDialog(response: boolean) {
    this.dialogRef.close(response);
  }
}
