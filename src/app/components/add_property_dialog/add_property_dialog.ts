import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AdminService } from "app/services/admin.service";
import * as uuid from "uuid";

interface DropDownButtonModel {
  value: string;
  viewValue: string;
}

@Component({
  // standalone: true,
  selector: "add_property_dialog",
  styleUrls: ["./add_property_dialog.scss"],
  templateUrl: "./add_property_dialog.html",
  // imports: [CommonModule, FormsModule, ReactiveFormsModule],
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
  docsFilesBase64Uploaded: any[] = [];
  imgFilesBase64Uploaded: any[] = [];
  imgFilesUploaded: File[] = [];

  property_name: any = "";
  property_address: any = "";
  property_govt_id: any = "";
  property_owner_name: any = "";
  property_no_of_units: any = "";
  property_no_of_parking: any = "";
  property_in_charge: any = "";

  property_building_type: any = "";
  property_locality: any = "";

  formNotFilled: boolean = false;
  imageNotAdded: boolean = false;
  documentNotAdded: boolean = false;
  uploading: boolean = false;

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
      const reader = new FileReader();
      reader.readAsDataURL(item);
      reader.onload = (event) => {
        this.docsFilesBase64Uploaded.push(event.target.result);
      };
    }
    this.fileInput.nativeElement.value = "";
  }

  removeUploadedDoc(index) {
    this.docsFilesUploaded.splice(index, 1);
    this.docsFilesBase64Uploaded.splice(index, 1);
  }

  removeUploadedImg(index) {
    this.imgFilesBase64Uploaded.splice(index, 1);
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
            var uploadData = this.setupUploadFiles(
              random_id,
              images_names,
              docs_names
            );
            this.adminService
              .uploadAllFilesAddProperty(uploadData)
              .subscribe((va) => {
                if (va == "success") {
                  this.uploading = false;
                  this.dialogRef.close();
                }
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
  ): string {
    var data = {
      property_id: random_id,
      img_files: this.imgFilesBase64Uploaded,
      doc_files: this.docsFilesBase64Uploaded,
      img_name: images_names,
      doc_names: docs_names,
    };

    return JSON.stringify(data);
  }

  setupData(random_id: any, images_names: any[], docs_names: any[]): string {
    var data = {
      property_id: random_id,
      govt_id: this.property_govt_id,
      property_name: this.property_name,
      address: this.property_address,
      property_type: this.property_building_type,
      locality_name: this.property_locality,
      owner_name: this.property_owner_name,
      no_of_units: this.property_no_of_units,
      no_of_parking: this.property_no_of_parking,
      property_in_charge: this.property_in_charge,
      images: JSON.stringify(images_names),
      documents: JSON.stringify(docs_names),
    };

    return JSON.stringify(data);
  }
}
