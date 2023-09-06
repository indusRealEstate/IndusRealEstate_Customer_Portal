import { HttpEvent, HttpEventType } from "@angular/common/http";
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { UnitsService } from "app/services/units.service";
import { last, map, tap } from "rxjs";
import * as uuid from "uuid";
import { PaginatorDialog } from "../paginator-dialog/paginator-dialog";

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
  unitTypes: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddUnitDialog>,
    private unitsService: UnitsService,
    private dialog: MatDialog
  ) {
    this.unitsService.getallUnitTypes().subscribe((val: any[]) => {
      val.forEach((unit_type) => {
        this.unitTypes.push({
          value: unit_type.id,
          viewValue: unit_type.type,
        });
      });
    });
  }

  @ViewChild("fileInput") fileInput: ElementRef;
  @ViewChild("fileInputImage") fileInputImage: ElementRef;

  docsFilesUploaded: File[] = [];
  imgFilesBase64Uploaded: any[] = [];
  imgFilesUploaded: File[] = [];

  amenties: any[] = [];
  inventories: any[] = [];

  selected_property: any;
  unit_type: any = "";
  unit_number: any = "";
  owner: any;
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

  uploading_progress: any = 0;

  properties: any[] = [];

  users: any[] = [];

  locality: DropDownButtonModel[] = [
    { value: "0", viewValue: "Al Barsha" },
    { value: "1", viewValue: "Dubai Internet City" },
    { value: "2", viewValue: "Nad Al Sheba" },
    { value: "3", viewValue: "Nashama Town Square" },
    { value: "4", viewValue: "JVC" },
  ];

  addPaginatorDialog(type: string) {
    this.dialog
      .open(PaginatorDialog, {
        width: "60%",
        data: {
          type: type,
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res != undefined) {
          // console.log(res);
          if (type == "property") {
            this.selected_property = {
              id: res.property_id,
              name: res.property_name,
            };
          } else {
            this.owner = {
              id: res.user_id,
              name: res.name,
            };
          }
        }
      });
  }

  getUserType(user_type) {
    if (user_type == "new_user") {
      return "New User";
    } else if (user_type == "tenant") {
      return "Resident";
    } else if (user_type == "owner") {
      return "Property Owner";
    }
  }

  ngOnInit() {}

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

  addInventories(unit_id) {
    if (this.inventories.length != 0) {
      var data = {
        unit_id: unit_id,
        data: this.inventories,
      };

      this.unitsService.addInventory(JSON.stringify(data)).subscribe((res) => {
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
        this.selected_property != undefined &&
        this.unit_type != "" &&
        this.unit_number != "" &&
        this.owner != undefined
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
        this.unitsService.addUnit(data).subscribe((val) => {
          console.log(val);
          if (val == "success") {
            this.addInventories(random_id);
            var uploadData = this.setupUploadFiles(
              random_id,
              images_names,
              docs_names
            );
            this.unitsService
              .uploadAllFilesAddUnit(uploadData)
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
      property_id: this.selected_property.id,
      property_name: this.selected_property.name,
      unit_type: this.unit_type,
      floor: this.floors,
      size: this.unit_size,
      status: "vacant",
      bedroom: this.bedrooms,
      bathroom: this.bathrooms,
      no_of_parking: this.number_of_parking,
      owner: this.owner.name,
      tenant_id: "",
      lease_id: "",
      images: JSON.stringify(images_names),
      documents: JSON.stringify(docs_names),
      amenties: JSON.stringify(this.amenties),
      user_id: this.owner.id,
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
