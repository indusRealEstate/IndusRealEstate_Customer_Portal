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
import { catchError, last, map, tap } from "rxjs";
import * as uuid from "uuid";

// interface DropDownButtonModel {
//   value: string;
//   viewValue: string;
// }

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
  documentNotAdded: boolean = false;
  docsFilesUploaded: any[] = [];
  property_building_type: any = "";
  deleted_doc_array: string[] = [];
  new_selected_doc: File[] = [];
  uploading_progress: any = 0;
  uploaded_doc: string[] = [];
  docsFilesUploaded_new: File[] = [];
  removed_existing_docs: any[] = [];

  //  buildingName: DropDownButtonModel[] = [
  //   { value: "alsima tower", viewValue: "alsima tower" },
  //   { value: "Marina gate", viewValue: "Marina gate" },

  // ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditAnnouncementDialog>,
    private adminService: AdminService
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
    let selected = this.properties.filter((val) => val.value == this.p_id);
    //console.log(selected);
    this.selected_property = this.p_id;
    //console.log(this.properties);
    this.assignDoc();
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

  async assignDoc() {
    console.log(this.all_data);
    for (let i = 0; i < JSON.parse(this.all_data.attachments).length; i++) {
      let doc_URL: string = `https://indusre.app/api/upload/announcement/${
        this.all_data.ann_id
      }/${JSON.parse(this.all_data.attachments)[i]}`;

      this.docsFilesUploaded.push(JSON.parse(this.all_data.attachments)[i]);
      //console.log(doc_URL);
    }
  }
  ngOnInit() {}

  ngAfterViewInit() {
    // JSON.parse(this.all_data.attachments).forEach((doc) => {
    //   this.docsFilesUploaded.push({ name: doc, old: true });
    // });
  }

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
    }
    this.fileInput.nativeElement.value = "";
  }

  // removeUploadedDoc(index) {
  //   let remove_item = this.docsFilesUploaded.splice(index, 1);

  //   if (typeof remove_item[0] == "string") {
  //     this.deleted_doc_array.push(remove_item[0]);
  //   }
  //   //console.log(this.deleted_doc_array);
  // }

  // removeUploadedDoc(index: number, file: any) {
  //   if (this.docsFilesUploaded_new.includes(file)) {
  //     var i = this.docsFilesUploaded_new.findIndex((f) => f.name == file.name);
  //     this.docsFilesUploaded_new.splice(i, 1);
  //   } else {
  //     this.removed_existing_docs.push(file);
  //   }
  //   this.docsFilesUploaded.splice(index, 1);
  //   console.log( this.docsFilesUploaded);
  // }
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
    let uploaded_doc: File[] = [];
    let exist_doc: string[] = [];
    if (this.docsFilesUploaded.length != 0) {
     
      // this.docsFilesUploaded.forEach((value) => {
      //   if (typeof value == "object") {
      //     this.new_selected_doc.push(value);
      //   } else {
      //     exist_doc.push(value);
      //   }
      // });

      if (
        this.title != "" &&
        this.selected_property != "" &&
        this.description != ""
      ) {
        this.uploading = true;
        let docs_names = [];

      //   for (let doc of this.docsFilesUploaded) {
      //     docs_names.push(doc.name);
      //   }
      //   if (docs_names.length != 0) {
      //     exist_doc = exist_doc.concat(docs_names);
      //   }
      //  console.log('document name is'+docs_names);

        var docs_names_new = [];

        for (var doc of this.docsFilesUploaded) {
          docs_names.push(doc.name);
          if (doc.old == undefined) {
            docs_names_new.push(doc.name);
          }
          console.log(docs_names_new);
        }

        let announce_id = this.all_data.a_id;
        let r_id = this.all_data.ann_id;

        let data = this.setupData(r_id, announce_id, docs_names);
       // console.log(this.removed_existing_docs);
        this.adminService.updateAnnouncement(data).subscribe((value) => {
         // console.log(data);
          if (value == "success") {
            // if (this.removed_existing_docs.length != 0) {
            //   this.adminService
            //     .deleteAnnouncementDocs(
            //       JSON.stringify({
            //         names: this.removed_existing_docs,
            //         id: r_id,
            //       })
            //     )
            //     .subscribe((res) => {
            //       console.log(res);
            //     });
            // }

            if (this.removed_existing_docs.length != 0) {
              this.adminService
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
            this.uploading_progress = 0;
            let uploadData = this.setupUploadFiles(r_id, docs_names_new);
            console.log(this.removed_existing_docs);
            this.adminService
              .uploadAllFilesEditAnnouncement(uploadData)
              .pipe(
                map((event) => this.getEventMessage(event)),
                tap((message) => {
                  if (message == "File was completely uploaded!") {
                    this.uploaded = true;
                    this.uploaded_doc = exist_doc;
                    this.onCloseDialog();
                    // this.dialogRef.close();
                  }
                }),
                last()
              )
              .subscribe((v) => {
                console.log(v);
              });
          }

          console.log(value);
        });
      } else {
        this.formNotFilled = true;
        setTimeout(() => {
          this.formNotFilled = false;
        }, 3000);
      }
    } else if (this.docsFilesUploaded.length == 0) {
      this.documentNotAdded = true;
      setTimeout(() => {
        this.documentNotAdded = false;
      }, 3000);
    }
  }
  // setupUploadFiles(r_id: any, docs_names: any[]): FormData {
  //   const formdata: FormData = new FormData();
  //   formdata.append("docs_names", JSON.stringify(docs_names));
  //   formdata.append("deleted_doc", JSON.stringify(this.deleted_doc_array));

  //   var doc_count = 0;
  //   for (let doc of this.new_selected_doc) {
  //     formdata.append(`doc_${doc_count}`, doc);
  //     doc_count++;
  //   }

  //   formdata.append("announcement_id", r_id);

  //   return formdata;
  // }

  setupUploadFiles(r_id: any, docs_names: any[]): FormData {
    const formdata: FormData = new FormData();

    formdata.append("docs_names", JSON.stringify(docs_names));
    formdata.append("deleted_doc", JSON.stringify(this.removed_existing_docs));

    var doc_count = 0;
    for (let doc of this.docsFilesUploaded_new) {
      doc_count++;
      formdata.append(`doc_${doc_count}`, doc);
    }

    formdata.append("announcement_id", r_id);

    return formdata;
  }

  setupData(r_id, announce_id: any, docs_names_new: any[]): string {
    var data = {
      // announcement_id: random_id,
      //testid:this.ann_id,
      id: announce_id,
      title: this.title,
      emergency: this.emergency,
      description: this.description,
      p_id: this.selected_property,
      p_name: this.p_name,
      documents: JSON.stringify(docs_names_new),
      //an_id:this.ann_id
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
