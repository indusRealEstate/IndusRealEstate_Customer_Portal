import { Component, OnInit, Inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ApiService } from "app/services/api.service";

@Component({
  selector: "view-related-documents",
  styleUrls: ["./related-documents.scss"],
  templateUrl: "./related-documents.html",
})
export class RelatedDocsDialog implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RelatedDocsDialog>,
    private apiService: ApiService,
    private router: Router,
    private dialog?: MatDialog
  ) {
    this.prop_id = data["prop_id"];
    this.document_loading = true;

    this.doc_path = apiService.getBaseUrlDocs();
  }

  prop_id: any;

  prop_docs: any[];

  document_loading: boolean = false;

  doc_path: any;

  ngOnInit() {
    this.apiService
      .getPropertyDocuments(this.prop_id)
      .subscribe((val: any[]) => {
        this.prop_docs = val;
      })
      .add(() => {
        this.document_loading = false;
      });
  }

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close();
  }

  downloadDoc(doc) {
    var document_url = `${this.doc_path}/${doc.document_path}`;
    // console.log(document_url);
    // window.open(document_url);

    this.apiService.downloadFile(document_url).subscribe((v) => {
      // console.log(v);
      const url = window.URL.createObjectURL(v);
      window.open(url);
    });
  }

  viewDoc(doc) {
    var document_url = `${this.doc_path}/${doc.document_path}`;
    // console.log(document_url);
    // window.open(document_url);

    this.apiService.downloadFile(document_url).subscribe((v) => {
      // console.log(v);
      const url = window.URL.createObjectURL(v);
      window.open(url);
    });
  }
}
