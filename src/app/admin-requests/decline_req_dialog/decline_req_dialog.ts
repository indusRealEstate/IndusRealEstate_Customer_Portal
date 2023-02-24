import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";

@Component({
  selector: "decline-dialog",
  styleUrls: ["./decline_req_dialog.scss"],
  templateUrl: "./decline_req_dialog.html",
})
export class DeclineRequestConfirmDialog implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DeclineRequestConfirmDialog>,
    private router: Router
  ) {}

  ngOnInit() {}

  onCloseDialog() {
    this.dialogRef.close();
  }

  declineRequestConfirm(){
    this.dialogRef.close(true);
  }
}
