import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-dialog",
  styleUrls: ["./dialog.scss"],
  templateUrl: "./dialog.html",
})
export class DocUploadDialogRegister implements OnInit {
  public docName: string = "";
  docs: any[] = [];
  singleDoc: any;
  auth_type: any = "";

  isDocsExceededMoreThan2: boolean = false;
  isDocsExceededMoreThan1: boolean = false;
  isDocsEmpty: boolean = false;
  files: any[] = [];
  base64files: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DocUploadDialogRegister>
  ) {}

  ngOnInit() {
    this.docName = this.data["upload"];
    this.auth_type = this.data["auth"];
  }

  onCloseDialog() {
    this.dialogRef.close();
  }

  submitEditedData() {
    if (this.docName == "passport" || this.docName == "emirates_id") {
      if (this.files.length < 3 && this.files.length != 0) {
        if (this.docName == "passport") {
          this.dialogRef.close({ doc: "passport", data: this.base64files });
        } else {
          this.dialogRef.close({ doc: "emirates_id", data: this.base64files });
        }
      } else {
        if (this.files.length == 0) {
          this.isDocsEmpty = true;

          setTimeout(() => {
            this.isDocsEmpty = false;
          }, 4000);
        } else {
          this.isDocsExceededMoreThan2 = true;

          setTimeout(() => {
            this.isDocsExceededMoreThan2 = false;
          }, 4000);
        }
      }
    } else {
      if (this.files.length < 2 && this.files.length != 0) {
        if (this.docName == "sales_deed") {
          this.dialogRef.close({
            doc: "sales_deed",
            data: this.base64files[0],
          });
        } else {
          this.dialogRef.close({
            doc: "ownership_doc",
            data: this.base64files[0],
          });
        }
      } else {
        if (this.files.length >= 2) {
          this.isDocsExceededMoreThan1 = true;

          setTimeout(() => {
            this.isDocsExceededMoreThan1 = false;
          }, 4000);
        } else {
          this.isDocsEmpty = true;

          setTimeout(() => {
            this.isDocsEmpty = false;
          }, 4000);
        }
      }
    }
  }

  submitDataTenant() {
    if (
      this.docName == "tenant_passport" ||
      this.docName == "landlord_passport" ||
      this.docName == "tenant_emirates_id"
    ) {
      if (this.files.length < 3 && this.files.length != 0) {
        if (this.docName == "tenant_passport") {
          this.dialogRef.close({
            doc: "tenant_passport",
            data: this.base64files,
          });
        } else if (this.docName == "landlord_passport") {
          this.dialogRef.close({
            doc: "landlord_passport",
            data: this.base64files,
          });
        } else {
          this.dialogRef.close({
            doc: "tenant_emirates_id",
            data: this.base64files,
          });
        }
      } else {
        if (this.files.length == 0) {
          this.isDocsEmpty = true;

          setTimeout(() => {
            this.isDocsEmpty = false;
          }, 4000);
        } else {
          this.isDocsExceededMoreThan2 = true;

          setTimeout(() => {
            this.isDocsExceededMoreThan2 = false;
          }, 4000);
        }
      }
    } else {
      if (this.files.length < 2 && this.files.length != 0) {
        if (this.docName == "tenant_visa") {
          this.dialogRef.close({
            doc: "tenant_visa",
            data: this.base64files[0],
          });
        } else if (this.docName == "title_deed_doc") {
          this.dialogRef.close({
            doc: "title_deed_doc",
            data: this.base64files[0],
          });
        } else if (this.docName == "power_of_attorney") {
          this.dialogRef.close({
            doc: "power_of_attorney",
            data: this.base64files[0],
          });
        } else if (this.docName == "security_deposit") {
          this.dialogRef.close({
            doc: "security_deposit",
            data: this.base64files[0],
          });
        } else if (this.docName == "tenancy_contract") {
          this.dialogRef.close({
            doc: "tenancy_contract",
            data: this.base64files[0],
          });
        }
      } else {
        if (this.files.length >= 2) {
          this.isDocsExceededMoreThan1 = true;

          setTimeout(() => {
            this.isDocsExceededMoreThan1 = false;
          }, 4000);
        } else {
          this.isDocsEmpty = true;

          setTimeout(() => {
            this.isDocsEmpty = false;
          }, 4000);
        }
      }
    }
  }

  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);

      var reader = new FileReader();
      reader.readAsDataURL(item);

      reader.onloadend = (e) => {
        var part1 = e.target.result.toString().split(";base64,")[0];
        this.base64files.push({
          data: e.target.result,
          ext: part1.split("/")[1],
        });
      };
    }
    this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
}
