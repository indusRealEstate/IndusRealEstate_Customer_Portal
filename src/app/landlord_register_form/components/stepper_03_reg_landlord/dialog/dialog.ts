import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-dialog",
  styleUrls: ["./dialog.scss"],
  templateUrl: "./dialog.html",
})
export class DocUploadDialogLandlordRegister implements OnInit {
  public docName: string = "";
  docs: any[] = [];
  singleDoc: any;

  isDocsExceededMoreThan2: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DocUploadDialogLandlordRegister>
  ) {}

  ngOnInit() {
    this.docName = this.data["upload"];
  }

  onCloseDialog() {
    this.dialogRef.close();
  }

  submitEditedData() {
    this.dialogRef.close({});
  }

  pickDoc(doc) {
    var file = doc.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);

    console.log(file);

    if (this.docName == "passport" || this.docName == "emirates_id") {
      if (this.docs.length < 3) {
        reader.onloadend = (e) => {
          if (this.docs.length == 0) {
            this.docs[0] = e.target.result;
          } else {
            this.docs[1] = e.target.result;
          }
        };
      } else {
        this.isDocsExceededMoreThan2 = true;

        setTimeout(() => {
          this.isDocsExceededMoreThan2 = false;
        }, 4000);
      }
    } else {
      reader.onloadend = (e) => {
        this.singleDoc = e.target.result;
      };
    }
  }
}
