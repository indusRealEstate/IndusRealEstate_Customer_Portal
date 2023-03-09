import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";

@Component({
  selector: "success-dialog",
  styleUrls: ["./success_dialog.scss"],
  templateUrl: "./success_dialog.html",
})
export class SuccessDialogRegister implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SuccessDialogRegister>,
    private router: Router
  ) {
    this.auth_type = data["auth_type"];
  }

  auth_type: any;

  ngOnInit() {
    if (this.auth_type == "landlord") {
      setTimeout(() => {
        this.router.navigate(["/home"]);
        setTimeout(() => {
          this.dialogRef.close();
        }, 500);
      }, 4000);
    } else {
      setTimeout(() => {
        this.router.navigate(["/login"]);
        setTimeout(() => {
          this.dialogRef.close();
        }, 500);
      }, 4000);
    }
  }

  onCloseDialog() {}
}
