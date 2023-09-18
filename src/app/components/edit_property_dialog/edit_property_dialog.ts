import { HttpEvent, HttpEventType } from "@angular/common/http";
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PropertiesService } from "app/services/properties.service";
import { last, map, tap } from "rxjs";

interface DropDownButtonModel {
  value: string;
  viewValue: string;
}

@Component({
  selector: "edit_property_dialog",
  styleUrls: ["./edit_property_dialog.scss"],
  templateUrl: "./edit_property_dialog.html",
})
export class EditPropertyDialog implements OnInit {
  all_data: any;

  @ViewChild("fileInput") fileInput: ElementRef;
  @ViewChild("fileInputImage") fileInputImage: ElementRef;

  docsFilesUploaded: any[] = [];
  imgFilesBase64Uploaded: any[] = [];
  imgFilesUploaded: any[] = [];
  new_selected_images: File[] = [];
  new_selected_doc: File[] = [];
  deleted_image_array: string[] = [];
  deleted_doc_array: string[] = [];
  uploaded_images: string[] = [];
  uploaded_doc: string[] = [];

  property_name: any = "";
  property_address: any = "";
  // property_govt_id: any = "";
  property_no_of_units: any = "";
  property_in_charge: any = "";

  property_description: any = "";

  property_building_type: any = "";
  property_locality: any = "";

  formNotFilled: boolean = false;
  imageNotAdded: boolean = false;
  documentNotAdded: boolean = false;
  uploading: boolean = false;
  uploaded: boolean = false;

  uploading_progress: any = 0;

  images_fully_loaded: boolean = false;

  isContentLoading: boolean = true;

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
    { value: "5", viewValue: "International City" },
    { value: "6", viewValue: "Downtown Dubai" },
    { value: "7", viewValue: "JLT" },
    { value: "8", viewValue: "Hadaeq mohammed bin rashid" },
    { value: "9", viewValue: "Jabel Ali First" },
    { value: "11", viewValue: "Burj khalifa" },
    { value: "12", viewValue: "DSO" },
    { value: "13", viewValue: "Me'Aisem First" },
  ];

  testImage: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditPropertyDialog>,
    private propertyService: PropertiesService
  ) {
    this.propertyService
      .getPropDetails(JSON.stringify({ prop_id: data }))
      .subscribe((value) => {
        this.all_data = value;
      })
      .add(() => {
        this.isContentLoading = false;
        this.property_name = this.all_data.prop_name;
        this.property_address = this.all_data.prop_address;
        // this.property_govt_id = this.all_data.prop_gov_id;
        this.property_no_of_units = this.all_data.prop_no_of_units;
        this.property_in_charge = this.all_data.prop_in_charge;

        this.property_description = this.all_data.prop_description;

        this.property_building_type = this.all_data.prop_type;
        this.property_locality = this.all_data.prop_locality_name;

        this.assignImages();
        this.assignDoc();
      });
  }

  async assignImages() {
    var count = 0;
    for (let i = 0; i < JSON.parse(this.all_data.prop_images).length; i++) {
      let image_URL: string = `https://indusre.app/api/upload/property/${
        this.all_data.prop_uid
      }/images/${JSON.parse(this.all_data.prop_images)[i]}`;

      this.imgFilesUploaded.push(JSON.parse(this.all_data.prop_images)[i]);

      this.imgFilesBase64Uploaded.push(image_URL);
      count++;
    }

    if (count == JSON.parse(this.all_data.prop_images).length) {
      this.images_fully_loaded = true;
    }
  }

  async assignDoc() {
    for (let i = 0; i < JSON.parse(this.all_data.prop_doc).length; i++) {
      let doc_URL: string = `https://indusre.app/api/upload/property/${
        this.all_data.prop_uid
      }/documents/${JSON.parse(this.all_data.prop_doc)[i]}`;

      this.docsFilesUploaded.push(JSON.parse(this.all_data.prop_doc)[i]);
    }
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  closeDialogWithoutSaving() {
    this.dialogRef.close();
  }

  onCloseDialog() {
    this.assignImages();
    this.assignDoc();
    this.dialogRef.close({
      property_name: this.uploaded == true ? this.property_name : undefined,
      property_address:
        this.uploaded == true ? this.property_address : undefined,
      property_building_type:
        this.uploaded == true ? this.property_building_type : undefined,
      property_locality:
        this.uploaded == true ? this.property_locality : undefined,
      // property_gov_id:
      //   this.uploaded == true ? this.property_govt_id : undefined,
      property_in_charge:
        this.uploaded == true ? this.property_in_charge : undefined,
      property_description:
        this.uploaded == true ? this.property_description : undefined,
      property_no_of_units:
        this.uploaded == true ? this.property_no_of_units : undefined,

      property_uploaded_images:
        this.uploaded == true ? this.uploaded_images : undefined,
      property_uploaded_doc:
        this.uploaded == true ? this.uploaded_doc : undefined,
    });
  }

  onFileSelected(files: Array<any>) {
    for (var item of files) {
      this.docsFilesUploaded.push(item);
    }
    this.fileInput.nativeElement.value = "";
  }

  removeUploadedDoc(index) {
    let remove_item = this.docsFilesUploaded.splice(index, 1);

    if (typeof remove_item[0] == "string") {
      this.deleted_doc_array.push(remove_item[0]);
    }
  }

  removeUploadedImg(index) {
    let remove_item = this.imgFilesUploaded.splice(index, 1);
    this.imgFilesBase64Uploaded.splice(index, 1);

    if (typeof remove_item[0] == "string") {
      this.deleted_image_array.push(remove_item[0]);
    }

    console.log(this.deleted_image_array);
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
    let uploaded_doc: File[] = [];
    let exist_doc: string[] = [];
    let uploaded_img: File[] = [];
    let exist_img: string[] = [];

    if (
      this.docsFilesUploaded.length != 0 &&
      this.imgFilesUploaded.length != 0
    ) {
      this.docsFilesUploaded.forEach((value) => {
        if (typeof value == "object") {
          this.new_selected_doc.push(value);
        } else {
          exist_doc.push(value);
        }
      });

      this.imgFilesUploaded.forEach((value) => {
        if (typeof value == "object") {
          this.new_selected_images.push(value);
        } else {
          exist_img.push(value);
        }
      });

      if (
        this.property_name != "" &&
        this.property_building_type != "" &&
        this.property_locality != ""
      ) {
        this.uploading = true;
        let random_id = this.all_data.prop_uid;

        let images_names = [];
        let docs_names = [];

        for (let img of this.new_selected_images) {
          images_names.push(img.name);
        }

        for (let doc of this.new_selected_doc) {
          docs_names.push(doc.name);
        }

        // for (var doc of this.new_selected_doc) {
        //   let doc_name: string;
        //   if (exist_doc.includes(doc.name)) {
        //     let doc_array = doc.name.split(".");
        //     let new_name = doc_array[0] + "_" + uuid.v4();
        //     doc_name = new_name + doc_array[1];
        //     // doc.name = doc_name;
        //   } else {
        //     doc_name = doc.name;
        //   }
        //   images_names.push(doc_name);
        // }

        if (docs_names.length != 0) {
          exist_doc = exist_doc.concat(docs_names);
        }

        if (images_names.length != 0) {
          exist_img = exist_img.concat(images_names);
        }

        console.log(exist_img);

        let data = this.setupData(random_id, exist_img, exist_doc);

        this.propertyService.updateProperty(data).subscribe((value) => {
          if (value == "success") {
            this.uploading_progress = 0;
            let uploadData = this.setupUploadFiles(
              random_id,
              exist_img,
              images_names,
              docs_names
            );
            this.propertyService
              .uploadAllFilesEditProperty(uploadData)
              .pipe(
                map((event) => this.getEventMessage(event)),
                tap((message) => {
                  if (message == "File was completely uploaded!") {
                    this.uploaded = true;
                    this.uploaded_images = exist_img;
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
    old_images_names: any[],
    images_names: any[],
    docs_names: any[]
  ): FormData {
    const formdata: FormData = new FormData();

    var img_count = 0;
    for (let img of this.new_selected_images) {
      formdata.append(`img_${img_count}`, img);
      img_count++;
    }

    formdata.append("old_images_names", JSON.stringify(old_images_names));
    formdata.append("images_names", JSON.stringify(images_names));
    formdata.append("docs_names", JSON.stringify(docs_names));
    formdata.append("deleted_doc", JSON.stringify(this.deleted_doc_array));
    formdata.append("deleted_images", JSON.stringify(this.deleted_image_array));

    var doc_count = 0;
    for (let doc of this.new_selected_doc) {
      formdata.append(`doc_${doc_count}`, doc);
      doc_count++;
    }

    formdata.append("property_id", random_id);

    return formdata;
  }

  setupData(random_id: any, images_names: any[], docs_names: any[]): string {
    var data = {
      property_id: random_id,
      // govt_id: this.property_govt_id,
      property_name: this.property_name,
      address: this.property_address,
      property_type: this.property_building_type,
      locality_name: this.property_locality,
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
