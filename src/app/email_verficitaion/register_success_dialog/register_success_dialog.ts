import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";

@Component({
  selector: "register-success-dialog",
  styleUrls: ["./register_success_dialog.scss"],
  templateUrl: "./register_success_dialog.html",
})
export class RegisterSuccessDialog implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RegisterSuccessDialog>,
    private router: Router
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.dialogRef.close();
      this.router.navigate(["/login"]);
    }, 6000);
  }
}
