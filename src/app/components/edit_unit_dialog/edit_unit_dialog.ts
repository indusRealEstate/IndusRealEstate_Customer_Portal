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

interface DropDownButtonModel {
  value: string;
  viewValue: string;
}

@Component({
  // standalone: true,
  selector: "edit_unit_dialog",
  styleUrls: ["./edit_unit_dialog.scss"],
  templateUrl: "./edit_unit_dialog.html",
  // imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class EditUnitDialog implements OnInit {
  @ViewChild("fileInput") fileInput: ElementRef;
  @ViewChild("fileInputImage") fileInputImage: ElementRef;

  all_data: any;

  docsFilesUploaded: any[] = [];
  imgFilesBase64Uploaded: any[] = [];
  imgFilesUploaded: any[] = [];

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

  number_of_parking: any = "";

  new_amenty: any = "";

  inventory_name: any = "";
  inventory_place: any = "";
  inventory_count: any = "";

  unit_description: any = "";

  formNotFilled: boolean = false;
  imageNotAdded: boolean = false;
  documentNotAdded: boolean = false;
  uploading: boolean = false;
  data_uploaded: boolean = false;

  uploading_progress: any = 0;

  properties: any[] = [];

  users: any[] = [];

  selected_images: File[] = [];
  selected_doc: File[] = [];
  uploaded_images: string[] = [];
  uploaded_doc: string[] = [];
  deleted_images: string[] = [];
  deleted_doc: string[] = [];

  is_submit: boolean = false;

  images_fully_loaded: boolean = false;

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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditUnitDialog>,
    private adminService: AdminService
  ) {
    this.all_data = data;
    this.getAllTheDropdowns();

    // console.log(this.all_data);
    var count = 0;
    for (let item of JSON.parse(this.all_data.unit_images)) {
      let link = `https://indusre.app/api/upload/unit/${this.all_data.unit_id}/images/`;
      this.imgFilesBase64Uploaded.push(link + item);
      this.imgFilesUploaded.push(item);
      count++;
    }
    if (count == JSON.parse(this.all_data.unit_images).length) {
      this.images_fully_loaded = true;
    }

    for (let item of JSON.parse(this.all_data.unit_doc)) {
      this.docsFilesUploaded.push(item);
    }

    for (let item of JSON.parse(this.all_data.unit_amenties)) {
      this.amenties.push(item);
    }

    if (this.all_data.inventories != undefined) {
      for (let item of this.all_data.inventories) {
        this.inventories.push({
          name: item.inventory_name,
          place: item.inventory_place,
          count: item.inventory_count,
          new: false,
        });
      }
    }

    this.unit_type = this.all_data.unit_type;
    this.unit_number = this.all_data.unit_no;
    this.govt_id = this.all_data.prop_gov_id;
    this.floors = this.all_data.unit_floor;
    this.unit_size = this.all_data.unit_size;
    this.unit_description = this.all_data.unit_description;
    this.bedrooms = this.all_data.unit_bed;
    this.bathrooms = this.all_data.unit_bath;
    this.number_of_parking = this.all_data.unit_parking;
    this.unit_description = this.all_data.unit_description;
  }

  selectUnit(event: any) {
    var e = this.users.find((u) => u.value == event.value.owner_id);
    this.owner.viewValue = e.viewValue;
    this.owner.value = e.value;
  }

  getAllTheDropdowns() {
    this.adminService
      .getallPropertiesAdmin()
      .subscribe((val: any[]) => {
        val.forEach((prop) =>
          this.properties.push({
            value: prop.property_id,
            viewValue: prop.property_name,
          })
        );
      })
      .add(() => {
        var sel_prop = this.properties.find(
          (pr) => pr.value == this.all_data.prop_uid
        );
        // console.log(sel_prop);

        this.selected_property = sel_prop.value;
      });

    // this.users = [];
    this.adminService
      .getAllUsersAdmin()
      .subscribe((val: any[]) => {
        val.forEach((user) => {
          if (user.user_type != "tenant") {
            this.users.push({
              value: user.user_id,
              user_type: user.user_type,
              viewValue: user.name,
            });
          }
        });
      })
      .add(() => {
        let selected_user = this.users.find(
          (result) => result.value == this.all_data.user_uid
        );
        this.owner = selected_user;
        // console.log(selected_user);
      });
  }

  getUserType(user_type) {
    if (user_type == "new_user") {
      return "New User";
    } else if (user_type == "resident") {
      return "Resident";
    } else if (user_type == "owner") {
      return "Property Owner";
    }
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  

  onCloseDialog() {
    if (this.is_submit == true) {
      var sel_prop_name = this.properties.find(
        (pr) => pr.value == this.selected_property
      ).viewValue; 
    }

    this.dialogRef.close({
      unit_no: this.is_submit ? this.unit_number : undefined,
      property_id: this.is_submit ? this.selected_property : undefined,
      property_name: this.is_submit ? sel_prop_name : undefined,
      unit_type: this.is_submit ? this.unit_type : undefined,
      floor: this.is_submit ? this.floors : undefined,
      size: this.is_submit ? this.unit_size : undefined,
      status: this.is_submit ? this.all_data.unit_status : undefined,
      bedroom: this.is_submit ? this.bedrooms : undefined,
      bathroom: this.is_submit ? this.bathrooms : undefined,
      no_of_parking: this.is_submit ? this.number_of_parking : undefined,
      owner: this.is_submit ? this.owner.viewValue : undefined,
      owner_id: this.is_submit ? this.owner.value : undefined,
      tenant_id: this.is_submit
        ? this.all_data.tenant_uid == undefined
          ? ""
          : this.all_data.tenant_uid
        : undefined,
      lease_id: this.is_submit
        ? this.all_data.lease_uid == undefined
          ? ""
          : this.all_data.lease_uid
        : undefined,
      images: this.is_submit ? JSON.stringify(this.uploaded_images) : undefined,
      documents: this.is_submit ? JSON.stringify(this.uploaded_doc) : undefined,
      amenties: this.is_submit ? JSON.stringify(this.amenties) : undefined,
      user_id: this.is_submit ? this.owner.value : undefined,
      description: this.is_submit ? this.unit_description : undefined,
    });
  }

  addinventory() {
    this.inventories.push({
      name: this.inventory_name,
      place: this.inventory_place,
      count: this.inventory_count,
      new: true,
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
    }
    this.fileInput.nativeElement.value = "";
  }

  removeUploadedDoc(index) {
    let item = this.docsFilesUploaded.splice(index, 1);
    if (typeof item[0] != "object") {
      this.deleted_doc.push(item[0]);
    }
  }

  removeUploadedImg(index) {
    this.imgFilesUploaded.splice(index, 1);
    let item = this.imgFilesBase64Uploaded.splice(index, 1);

    if (typeof item[0] !== "object") {
      this.deleted_images.push(item[0]);
    }
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

  addInventories(unit_id) {
    var new_inventories = this.inventories.filter((inv) => inv.new == true);
    if (new_inventories.length != 0) {
      var data = {
        unit_id: unit_id,
        data: new_inventories,
      };

      this.adminService.addInventory(JSON.stringify(data)).subscribe((res) => {
        console.log(res);
      });
    }
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
        var random_id = this.all_data.unit_id;

        this.imgFilesUploaded.forEach((value) => {
          if (typeof value == "object") {
            this.selected_images.push(value);
          } else {
            this.uploaded_images.push(value);
          }
        });

        this.docsFilesUploaded.forEach((value) => {
          if (typeof value == "object") {
            this.selected_doc.push(value);
          } else {
            this.uploaded_doc.push(value);
          }
        });

        var images_names: string[] = [];
        var docs_names: string[] = [];

        for (var img of this.selected_images) {
          images_names.push(img.name);
        }

        for (var doc of this.selected_doc) {
          docs_names.push(doc.name);
        }

        this.uploaded_doc = this.uploaded_doc.concat(docs_names);
        this.uploaded_images = this.uploaded_images.concat(images_names);

        var data = this.setupData(
          random_id,
          this.uploaded_images,
          this.uploaded_doc
        );

        this.adminService.editUnit(data).subscribe((val) => {
          if (val == "success") {
            this.addInventories(random_id);
            var uploadData = this.setupUploadFiles(
              random_id,
              images_names,
              docs_names
            );
            this.adminService
              .uploadAllFilesAddUnit(uploadData)
              .pipe(
                map((event) => this.getEventMessage(event)),
                tap((message) => {
                  if (message == "File was completely uploaded!") {
                    this.is_submit = true;
                    this.onCloseDialog();
                  }
                }),
                last()
              )
              .subscribe((v) => {
                // console.log(v);
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
    for (let img of this.selected_images) {
      formdata.append(`img_${img_count}`, img);
      img_count++;
    }

    formdata.append("images_names", JSON.stringify(images_names));
    formdata.append("docs_names", JSON.stringify(docs_names));
    formdata.append("deleted_images", JSON.stringify(this.deleted_images));
    formdata.append("deleted_doc", JSON.stringify(this.deleted_doc));

    var doc_count = 0;
    for (let doc of this.selected_doc) {
      doc_count++;
      formdata.append(`doc_${doc_count}`, doc);
    }

    formdata.append("unit_id", random_id);

    return formdata;
  }

  setupData(random_id: any, images_names: any[], docs_names: any[]): string {
    var data = {
      unit_id: random_id,
      unit_no: this.unit_number,
      property_id: this.selected_property,
      unit_type: this.unit_type,
      floor: this.floors,
      size: this.unit_size,
      status: this.all_data.unit_status,
      bedroom: this.bedrooms,
      bathroom: this.bathrooms,
      no_of_parking: this.number_of_parking,
      owner: this.owner.viewValue,
      tenant_id:
        this.all_data.tenant_uid == undefined ? "" : this.all_data.tenant_uid,
      lease_id:
        this.all_data.lease_uid == undefined ? "" : this.all_data.lease_uid,
      images: JSON.stringify(images_names),
      documents: JSON.stringify(docs_names),
      amenties: JSON.stringify(this.amenties),
      user_id: this.owner.value,
      description: this.unit_description,
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
