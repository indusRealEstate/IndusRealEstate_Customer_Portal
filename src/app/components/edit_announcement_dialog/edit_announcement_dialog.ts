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
import { AnnouncementService } from "app/services/announcement.service";
import { PropertiesService } from "app/services/properties.service";
import { last, map, tap } from "rxjs";

@Component({
  selector: "edit_announcement_dialog",
  styleUrls: ["./edit_announcement_dialog.scss"],
  templateUrl: "./edit_announcement_dialog.html",
})
export class EditAnnouncementDialog implements OnInit {
  all_data: any;
  @ViewChild("fileInput") fileInput: ElementRef;
  @ViewChild("fileInputImage") fileInputImage: ElementRef;

  title: any = "";
  p_id: any = "";
  p_name: any = "";
  building_name: any = "";
  description: any = "";
  emergency: boolean = false;
  announce_id: number;
  ann_id: number;
  properties: any[] = [];
  selected_property: any = "";
  property_id: any;
  formNotFilled: boolean = false;
  uploading: boolean = false;
  uploaded: boolean = false;
  docsFilesUploaded: any[] = [];
  property_building_type: any = "";
  deleted_doc_array: string[] = [];
  new_selected_doc: File[] = [];
  uploading_progress: any = 0;
  uploaded_doc: string[] = [];
  docsFilesUploaded_new: File[] = [];
  removed_existing_docs: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditAnnouncementDialog>,
    private announcementService: AnnouncementService,
    private propertyService: PropertiesService
  ) {
    this.all_data = data;

    this.title = this.all_data.a_title;
    this.announce_id = this.all_data.ann_id;

    this.description = this.all_data.a_description;
    this.emergency = this.all_data.a_emergency > "0" ? true : false;
    this.p_id = this.all_data.p_id;
    this.p_name = this.all_data.p_name;
    //console.log(this.all_data.a_emergency);

    this.getAllPropertiesName();
    this.selected_property = this.p_id;

    JSON.parse(this.data.attachments).forEach((doc) => {
      this.docsFilesUploaded.push({ name: doc, old: true });
    });
  }

  getAllPropertiesName() {
    this.propertyService.getallPropertiesAdmin().subscribe((val: any[]) => {
      val.forEach((item) =>
        this.properties.push({
          value: item.property_id,
          viewValue: item.property_name,
        })
      );
    });
  }

  ngOnInit() {}

  closeDialogWithoutSaving() {
    this.dialogRef.close();
  }

  onCloseDialog() {
    this.dialogRef.close({
      title: this.uploaded == true ? this.title : undefined,
      selected_property:
        this.uploaded == true ? this.selected_property : undefined,
      description: this.uploaded == true ? this.description : undefined,
      emergency: this.uploaded == true ? this.emergency : undefined,
    });
  }

  onFileSelected(files: Array<any>) {
    for (var item of files) {
      this.docsFilesUploaded.push(item);
      this.docsFilesUploaded_new.push(item);
    }
    this.fileInput.nativeElement.value = "";
  }

  removeUploadedDoc(index: number, file: any) {
    if (this.docsFilesUploaded_new.includes(file)) {
      var i = this.docsFilesUploaded_new.findIndex((f) => f.name == file.name);
      this.docsFilesUploaded_new.splice(i, 1);
    } else {
      this.removed_existing_docs.push(file);
    }
    this.docsFilesUploaded.splice(index, 1);
  }

  onSubmit() {
    if (
      this.title != "" &&
      this.selected_property != "" &&
      this.description != ""
    ) {
      this.uploading = true;
      let docs_names = [];

      var docs_names_new = [];

      for (var doc of this.docsFilesUploaded) {
        docs_names.push(doc.name);
        if (doc.old == undefined) {
          docs_names_new.push(doc.name);
        }
      }

      let r_id = this.all_data.ann_id;

      let data = this.setupData(r_id, docs_names);
      // console.log(this.removed_existing_docs);
      this.announcementService.updateAnnouncement(data).subscribe((value) => {
        // console.log(data);
        if (value == "success") {
          if (this.removed_existing_docs.length != 0) {
            this.announcementService
              .deleteAnnouncementDocs(
                JSON.stringify({
                  names: this.removed_existing_docs,
                  id: r_id,
                })
              )
              .subscribe((res) => {
                console.log(res);
              });
          }
          if (this.docsFilesUploaded_new.length != 0) {
            this.uploading_progress = 0;
            let uploadData = this.setupUploadFiles(r_id, docs_names_new);
            // console.log(uploadData);
            this.announcementService
              .uploadAllFilesAddAnnouncement(uploadData)
              .pipe(
                map((event) => this.getEventMessage(event)),
                tap((message) => {
                  if (message == "File was completely uploaded!") {
                    this.onCloseDialog();
                  }
                }),
                last()
              )
              .subscribe((v) => {
                console.log(v, "uploaded..");
              });
          } else {
            this.onCloseDialog();
          }
        }
      });
    } else {
      this.formNotFilled = true;
      setTimeout(() => {
        this.formNotFilled = false;
      }, 3000);
    }
  }

  setupUploadFiles(r_id: any, docs_names: any[]): FormData {
    const formdata: FormData = new FormData();

    formdata.append("docs_names", JSON.stringify(docs_names));

    var doc_count = 0;
    for (let doc of this.docsFilesUploaded_new) {
      formdata.append(`doc_${doc_count}`, doc);
      doc_count++;
    }

    formdata.append("announcement_id", r_id);

    return formdata;
  }

  setupData(announce_id: any, docs_names_new: any[]): string {
    var data = {
      id: announce_id,
      title: this.title,
      emergency: this.emergency,
      description: this.description,
      p_id: this.selected_property,
      documents: JSON.stringify(docs_names_new),
    };
    //console.log(data);
    return JSON.stringify(data);
  }

  /** Return distinct message for sent, upload progress, & response events */
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
