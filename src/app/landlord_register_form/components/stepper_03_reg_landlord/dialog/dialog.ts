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
  files: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DocUploadDialogLandlordRegister>
  ) { }

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
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
