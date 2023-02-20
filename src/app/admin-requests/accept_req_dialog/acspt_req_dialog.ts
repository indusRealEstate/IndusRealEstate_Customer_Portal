import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";

@Component({
  selector: "accept-dialog",
  styleUrls: ["./acspt_req_dialog.scss"],
  templateUrl: "./acspt_req_dialog.html",
})
export class AcceptRequestConfirmDialog implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AcceptRequestConfirmDialog>,
    private router: Router
  ) {}

  ngOnInit() {}

  onCloseDialog() {
    this.dialogRef.close();
  }

  acceptRequestConfirm(){
    this.dialogRef.close(true);
  }
}
