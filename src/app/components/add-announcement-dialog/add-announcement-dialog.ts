import { HttpEvent, HttpEventType } from "@angular/common/http";
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AdminService } from "app/services/admin.service";
import { last, map, tap } from "rxjs";
import * as uuid from "uuid";

@Component({
  selector: "add-announcement-dialog",
  styleUrls: ["./add-announcement-dialog.scss"],
  templateUrl: "./add-announcement-dialog.html",
})
export class AddAnnouncementDialog implements OnInit {
  router: any;
  @ViewChild("fileInputImage") fileInputImage: ElementRef;
  @ViewChild("fileInput") fileInput: ElementRef;
  emergency: boolean = false;
  building_name: any = "";
  title: any = "";
  description: any = "";
  uploading: boolean = false;
  formNotFilled: boolean = false;
  properties: any[] = [];
  selected_property: any = "";
  property_id: any;

  docsFilesUploaded: File[] = [];
  imageNotAdded: boolean;
  uploading_progress: any = 0;
  documentNotAdded: boolean = false;
  isContentLoading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddAnnouncementDialog>,
    private adminService: AdminService
  ) {
    this.getAllPropertiesName();
    console.log(this.properties);
  }

  getAllPropertiesName() {
    this.adminService.getallPropertiesAdmin().subscribe((val: any[]) => {
      val.forEach((item) =>
        this.properties.push({
          value: item.property_id,
          viewValue: item.property_name,
        })
      );
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close();
  }

  removeUploadedDoc(index) {
    this.docsFilesUploaded.splice(index, 1);
  }
  onFileSelected(files: Array<any>) {
    for (var item of files) {
      this.docsFilesUploaded.push(item);
    }
    this.fileInput.nativeElement.value = "";
  }

  onSubmit() {
    if (
      // this.imgFilesUploaded.length != 0
      this.docsFilesUploaded.length != 0
    ) {
      if (
        // this.building_name != "" &&
        this.title != "" &&
        this.description != "" &&
        this.property_id != ""
      ) {
        this.uploading = true;
        var random_id = uuid.v4();

        var docs_names = [];
        for (var doc of this.docsFilesUploaded) {
          docs_names.push(doc.name);
        }
        var data = this.setupData(random_id, docs_names);
        this.adminService.addAnnouncement(data).subscribe((val) => {
          if (val == "success") {
            this.uploading_progress = 0;
            var uploadData = this.setupUploadFiles(random_id, docs_names);
            this.adminService
              .uploadAllFilesAddAnnouncement(uploadData)
              .pipe(
                map((event) => this.getEventMessage(event)),
                tap((message) => {
                  if (message == "File was completely uploaded!") {
                    this.dialogRef.close({ completed: true });
                  }
                }),
                last()
              )
              .subscribe((v) => {
                console.log(v);
              });
          } else {
            console.log("not inserted");
          }
        });
      } else {
        this.formNotFilled = true;
        setTimeout(() => {
          this.formNotFilled = false;
        }, 1000000);
      }
    } else {
      if (this.docsFilesUploaded.length == 0) {
        this.documentNotAdded = true;
        setTimeout(() => {
          this.documentNotAdded = false;
        }, 3000);
      }
    }
  }

  setupUploadFiles(random_id: any, docs_names: any[]): FormData {
    const formdata: FormData = new FormData();
    formdata.append("docs_names", JSON.stringify(docs_names));

    var doc_count = 0;
    for (let doc of this.docsFilesUploaded) {
      formdata.append(`doc_${doc_count}`, doc);
      doc_count++;
    }

    formdata.append("announcement_id", random_id);

    return formdata;
  }

  setupData(random_id: any, docs_names: any[]): string {
    var data = {
      emergency: this.emergency,
      property_id: this.selected_property,
      announcement_id: random_id,
      title: this.title,
      attachments: JSON.stringify(docs_names),
      description: this.description,
    };

    return JSON.stringify(data);
  }

  private getEventMessage(event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.Sent:
        return `Uploading file `;

      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        const percentDone = event.total
          ? Math.round((100 * event.loaded) / event.total)
          : 0;

        this.uploading_progress = percentDone;
        return `File is ${percentDone}% uploaded.`;

      case HttpEventType.Response:
        this.uploading = false;
        return `File was completely uploaded!`;

      default:
        return `File surprising upload event: ${event.type}.`;
    }
  }
}
