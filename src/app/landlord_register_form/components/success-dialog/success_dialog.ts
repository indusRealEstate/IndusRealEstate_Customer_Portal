import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";

@Component({
  selector: "success-dialog",
  styleUrls: ["./success_dialog.scss"],
  templateUrl: "./success_dialog.html",
})
export class SuccessDialogLandLordRegister implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SuccessDialogLandLordRegister>,
    private router: Router
  ) {}

  ngOnInit() {}

  onCloseDialog() {
    this.dialogRef.close();
    this.router.navigate(["/login"]);
  }
}
