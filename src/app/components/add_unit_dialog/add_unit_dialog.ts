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
  selector: "add_unit_dialog",
  styleUrls: ["./add_unit_dialog.scss"],
  templateUrl: "./add_unit_dialog.html",
  // imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class AddUnitDialog implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddUnitDialog>,
    private adminService: AdminService
  ) {
    this.getAllProperties();
  }

  @ViewChild("fileInput") fileInput: ElementRef;
  @ViewChild("fileInputImage") fileInputImage: ElementRef;

  docsFilesUploaded: File[] = [];
  docsFilesBase64Uploaded: any[] = [];
  imgFilesBase64Uploaded: any[] = [];
  imgFilesUploaded: File[] = [];

  amenties: any[] = [];
  inventories: any[] = [];

  selected_property: any = "";
  unit_type: any = "";
  unit_number: any = "";
  owner: any = "";
  govt_id: any = "";
  floors: any = "";
  unit_size: any = "";

  bedrooms: any = "";
  bathrooms: any = "";

  new_amenty: any = "";

  inventory_name: any = "";
  inventory_place: any = "";
  inventory_count: any = "";

  formNotFilled: boolean = false;
  imageNotAdded: boolean = false;
  documentNotAdded: boolean = false;
  uploading: boolean = false;

  users: any[] = [
    { value: "appartment", viewValue: "Appartment" },
    { value: "penthouse", viewValue: "Penthouse" },
    { value: "duplex", viewValue: "Duplex" },
    { value: "office", viewValue: "Office" },
    { value: "shop", viewValue: "Shop" },
    { value: "villa", viewValue: "Villa" },
  ];

  properties: any[] = [];

  unitTypes: DropDownButtonModel[] = [
    { value: "appartment", viewValue: "Appartment" },
    { value: "penthouse", viewValue: "Penthouse" },
    { value: "duplex", viewValue: "Duplex" },
    { value: "office", viewValue: "Office" },
    { value: "shop", viewValue: "Shop" },
    { value: "villa", viewValue: "Villa" },
  ];

  locality: DropDownButtonModel[] = [
    { value: "0", viewValue: "Al Barsha" },
    { value: "1", viewValue: "Dubai Internet City" },
    { value: "2", viewValue: "Nad Al Sheba" },
    { value: "3", viewValue: "Nashama Town Square" },
    { value: "4", viewValue: "JVC" },
  ];

  getAllProperties() {
    this.adminService.getallPropertiesAdmin().subscribe((val: any[]) => {
      val.forEach((prop) =>
        this.properties.push({
          value: prop.property_id,
          viewValue: prop.property_name,
        })
      );
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close();
  }

  addinventory() {
    this.inventories.push({
      name: this.inventory_name,
      place: this.inventory_place,
      count: this.inventory_count,
    });

    this.inventory_name = "";
    this.inventory_place = "";
    this.inventory_count = "";
  }

  deleteInventory(index) {
    this.inventories.splice(index, 1);
  }

  addAmenty() {
    this.amenties.push(this.new_amenty);
    this.new_amenty = "";
  }

  deleteAmenty(index) {
    this.amenties.splice(index, 1);
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
        this.selected_property != "" &&
        this.unit_type != "" &&
        this.unit_number != "" &&
        this.owner != ""
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
        this.adminService.addUnit(data).subscribe((val) => {
          if (val == "success") {
            var uploadData = this.setupUploadFiles(
              random_id,
              images_names,
              docs_names
            );
            this.adminService
              .uploadAllFilesAddUnit(uploadData)
              .subscribe((va) => {
                if (va == "success") {
                  if (this.inventories.length != 0) {
                    var inventory_data = {
                      unit_id: random_id,
                      data: this.inventories,
                    };
                    this.adminService
                      .addInventory(JSON.stringify(inventory_data))
                      .subscribe((val) => {
                        console.log(val);
                      });
                  }
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
      unit_id: random_id,
      img_files: this.imgFilesBase64Uploaded,
      doc_files: this.docsFilesBase64Uploaded,
      img_name: images_names,
      doc_names: docs_names,
    };

    return JSON.stringify(data);
  }

  setupData(random_id: any, images_names: any[], docs_names: any[]): string {
    var data = {
      unit_id: random_id,
      unit_no: this.unit_number,
      property_id: this.selected_property,
      unit_type: this.unit_type,
      floor: this.floors,
      size: this.unit_size,
      status: "vacant",
      bedroom: this.bedrooms,
      bathroom: this.bathrooms,
      owner: this.owner,
      images: JSON.stringify(images_names),
      documents: JSON.stringify(docs_names),
      amenties: JSON.stringify(this.amenties),
    };

    return JSON.stringify(data);
  }
}
