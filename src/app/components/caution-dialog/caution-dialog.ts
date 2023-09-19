import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "caution-dialog",
  styleUrls: ["./caution-dialog.scss"],
  templateUrl: "./caution-dialog.html",
})
export class CautionDialog implements OnInit {
  title: any = "";
  subtitle: any = "";
  warning: any = "";

  delete_button: any = "";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CautionDialog>
  ) {
    this.title = data.title;
    this.subtitle = data.subtitle;
    this.warning = data.warning;
    this.delete_button = data.delete_text;
  }

  ngOnInit() {}

  onCloseDialog(response: boolean) {
    this.dialogRef.close(response);
  }
}
