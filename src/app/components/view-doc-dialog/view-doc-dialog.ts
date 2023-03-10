import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ApiService } from "app/services/api.service";

@Component({
  selector: "view-doc-dialog",
  styleUrls: ["./view-doc-dialog.scss"],
  templateUrl: "./view-doc-dialog.html",
})
export class ViewDocDialog implements OnInit {
  isLoading: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewDocDialog>,
    private router: Router,
    private http: HttpClient,
    private service: ApiService
  ) {
    this.isLoading = true;
    this.doc_data = data["doc"];
    this.user_id = data["user_id"];
    this.auth_type = data["auth_type"];
  }

  doc_data: any;
  user_id: any;
  auth_type: any;

  viewDocFile: any;

  ngOnInit() {
    // console.log(this.doc_data);
    this.fetchDoc();
  }

  fetchDoc() {
    this.service
      .getDocForView(
        JSON.stringify({
          file_path: this.doc_data["path"],
        })
      )
      .subscribe((res) => {
        this.viewDocFile = "data:application/pdf;base64," + res;

        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
      });
  }

  onCloseDialog() {
    this.dialogRef.close();
  }
}
