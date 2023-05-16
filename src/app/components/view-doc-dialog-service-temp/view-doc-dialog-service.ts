import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ApiService } from "app/services/api.service";

@Component({
  selector: "view-doc-dialog-service",
  styleUrls: ["./view-doc-dialog-service.scss"],
  templateUrl: "./view-doc-dialog-service.html",
})
export class ViewDocDialogService implements OnInit {
  isLoading: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewDocDialogService>,
    private router: Router,
    private http: HttpClient,
    private service: ApiService
  ) {
    this.isLoading = true;
    this.doc_data = data["doc"];
  }

  doc_data: any;
  user_id: any;

  viewDocFile: any;
  ext: any;

  ngOnInit() {
    console.log(this.doc_data);
    this.ext = this.doc_data["ext"];

    if (this.ext == "pdf") {
      this.viewDocFile = this.doc_data["data"];
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    } else {
    }
  }

  viewDoc() {
    // this.service
    //   .getDocForView(
    //     JSON.stringify({
    //       file_path: this.doc_data["path"],
    //       auth_type: this.auth_type,
    //     })
    //   )
    //   .subscribe((res) => {
    //     this.viewDocFile = "data:application/pdf;base64," + res;

    //     setTimeout(() => {
    //       this.isLoading = false;
    //     }, 1000);
    //   });
  }

  onCloseDialog() {
    this.dialogRef.close();
  }
}
