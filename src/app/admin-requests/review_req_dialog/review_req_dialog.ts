import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";

@Component({
  selector: "review-req-dialog",
  styleUrls: ["./review_req_dialog.scss"],
  templateUrl: "./review_req_dialog.html",
})
export class ReviewRequestDialog implements OnInit {
  req_data: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ReviewRequestDialog>,
    private router: Router
  ) {}

  ngOnInit() {
    this.req_data = this.data["req_data"];
  }

  onCloseDialog() {
    this.dialogRef.close();
  }

  acceptRequestConfirm() {
    this.dialogRef.close(true);
  }
}
