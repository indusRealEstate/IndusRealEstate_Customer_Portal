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

interface DropDownButtonModel {
  value: string;
  viewValue: string;
}

@Component({
  selector: "add_property_dialog",
  styleUrls: ["./add_property_dialog.scss"],
  templateUrl: "./add_property_dialog.html",
})
export class AddPropertyDialog implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddPropertyDialog>,
    private adminService: AdminService
  ) {}

  @ViewChild("fileInput") fileInput: ElementRef;
  @ViewChild("fileInputImage") fileInputImage: ElementRef;

  docsFilesUploaded: File[] = [];
  imgFilesBase64Uploaded: any[] = [];
  imgFilesUploaded: File[] = [];

  property_name: any = "";
  property_address: any = "";
  property_no_of_units: any = "";
  property_in_charge: any = "";

  property_description: any = "";

  property_building_type: any = "";
  property_locality: any = "";

  formNotFilled: boolean = false;
  imageNotAdded: boolean = false;
  documentNotAdded: boolean = false;
  uploading: boolean = false;

  uploading_progress: any = 0;

  buildingTypes: DropDownButtonModel[] = [
    { value: "commercial", viewValue: "Commercial" },
    { value: "co_living", viewValue: "Co-Living" },
    { value: "co_working", viewValue: "Co-Working" },
    { value: "residential", viewValue: "Residential" },
    { value: "others", viewValue: "Others" },
  ];

  locality: DropDownButtonModel[] = [
    { value: "0", viewValue: "Al Barsha" },
    { value: "1", viewValue: "Dubai Internet City" },
    { value: "2", viewValue: "Nad Al Sheba" },
    { value: "3", viewValue: "Nashama Town Square" },
    { value: "4", viewValue: "JVC" },
  ];

  ngOnInit() {}

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close();
  }

  onFileSelected(files: Array<any>) {
    for (var item of files) {
      this.docsFilesUploaded.push(item);
    }
    this.fileInput.nativeElement.value = "";
  }

  removeUploadedDoc(index) {
    this.docsFilesUploaded.splice(index, 1);
  }

  removeUploadedImg(index) {
    this.imgFilesUploaded.splice(index, 1);
    this.imgFilesBase64Uploaded.splice(index, 1);
  }

  onImageFileSelected(files: Array<any>) {
    for (var item of files) {
      this.imgFilesUploaded.push(item);
      const reader = new FileReader();
      reader.readAsDataURL(item);
      reader.onload = (event) => {
        this.imgFilesBase64Uploaded.push(event.target.result);
      };
    }
    this.fileInputImage.nativeElement.value = "";
  }

  onSubmit() {
    if (
      this.imgFilesUploaded.length != 0 &&
      this.docsFilesUploaded.length != 0
    ) {
      if (
        this.property_name != "" &&
        this.property_building_type != "" &&
        this.property_locality != ""
      ) {
        this.uploading = true;
        var random_id = uuid.v4();

        var images_names = [];
        var docs_names = [];

        for (var img of this.imgFilesUploaded) {
          images_names.push(img.name);
        }

        for (var doc of this.docsFilesUploaded) {
          docs_names.push(doc.name);
        }

        var data = this.setupData(random_id, images_names, docs_names);
        this.adminService.addProperty(data).subscribe((val) => {
          if (val == "success") {
            this.uploading_progress = 0;
            var uploadData = this.setupUploadFiles(
              random_id,
              images_names,
              docs_names
            );
            this.adminService
              .uploadAllFilesAddProperty(uploadData)
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
          }
        });
      } else {
        this.formNotFilled = true;
        setTimeout(() => {
          this.formNotFilled = false;
        }, 3000);
      }
    } else {
      if (this.imgFilesUploaded.length == 0) {
        this.imageNotAdded = true;
        setTimeout(() => {
          this.imageNotAdded = false;
        }, 3000);
      } else if (this.docsFilesUploaded.length == 0) {
        this.documentNotAdded = true;
        setTimeout(() => {
          this.documentNotAdded = false;
        }, 3000);
      }
    }
  }

  setupUploadFiles(
    random_id: any,
    images_names: any[],
    docs_names: any[]
  ): FormData {
    const formdata: FormData = new FormData();

    var img_count = 0;
    for (let img of this.imgFilesUploaded) {
      formdata.append(`img_${img_count}`, img);
      img_count++;
    }

    formdata.append("images_names", JSON.stringify(images_names));
    formdata.append("docs_names", JSON.stringify(docs_names));

    var doc_count = 0;
    for (let doc of this.docsFilesUploaded) {
      formdata.append(`doc_${doc_count}`, doc);
      doc_count++;
    }

    formdata.append("property_id", random_id);

    return formdata;
  }

  setupData(random_id: any, images_names: any[], docs_names: any[]): string {
    var data = {
      property_id: random_id,
      property_name: this.property_name,
      address: this.property_address,
      property_type: this.property_building_type,
      locality_name: this.property_locality,
      no_of_units: this.property_no_of_units,
      property_in_charge: this.property_in_charge,
      images: JSON.stringify(images_names),
      documents: JSON.stringify(docs_names),
      description: this.property_description,
    };

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
