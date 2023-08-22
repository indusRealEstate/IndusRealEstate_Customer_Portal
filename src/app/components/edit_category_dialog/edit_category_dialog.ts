import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AdminService } from "app/services/admin.service";
import { ApiService } from "app/services/api.service";

@Component({
  selector: "edit_category_dialog",
  styleUrls: ["./edit_category_dialog.scss"],
  templateUrl: "./edit_category_dialog.html",
})
export class EditCategoryDialog implements OnInit {
  @Output() valueEmitter: EventEmitter<boolean> = new EventEmitter();

  form_submit: boolean = false;
  msg_status: boolean = false;
  category_name: string = "";
  category_icon: string = undefined;

  categoryForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  invaliduser: boolean = false;
  error_message_name: string;
  error_message_icon: string;
  isEmptyCategoryName: boolean = false;
  isEmptyCategoryIcon: boolean = false;
  input_array: object[] = [];
  json_format: string;
  alert_msg: object;

  parent: string;
  sub_parent: string;
  child: string;

  preview_image: string;
  file_size: Number;
  image_selected: boolean = false;

  searchTextValue: string = "";
  propertiesFilter: string[] = [];

  categoryData: any[] = [];

  categories_props: any[] = [];

  @ViewChild("inputBox") inputBox!: ElementRef;

  properties: any[] = [{ testfield: true }];
  property_id: any = "";

  id: Number;
  name: string;
  image: string;
  status: boolean;
  category_data: object;

  main_array: any[];
  msg: string;
  item_deleted: boolean = false;
  display_msg: boolean = false;
  is_active: boolean = false;

  edit_show: boolean = false;

  selected_property: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditCategoryDialog>,
    private apiService: ApiService,
    private apiAdminService: AdminService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog?: MatDialog
  ) {
    console.log(data);
    this.category_data = data;
    this.name = data.name;
    this.id = data.id;
    this.image = data.icon;
    this.status = data.status !== "0" ? true : false;

    this.category_name = data.name;
    this.category_icon = data.icon;

    this.preview_image = `https://indusre.app/api/upload/category/${this.image}`;

    this.apiAdminService.getallPropertiesAdmin().subscribe((val: any[]) => {
      var count = 0;
      val.forEach((prop) => {
        this.properties.push({
          value: prop.property_id,
          viewValue: prop.property_name,
        });
        count++;
      });

      if (count == val.length) {
        this.propertiesFilter = [...this.properties];
        let data_filter = this.properties.filter(
          (item) => item.value == data.prop_id
        );
        this.selected_property = {
          value: data_filter[0].value,
          viewValue: data_filter[0].viewValue,
        };

        this.property_id = data_filter[0].value;
        console.log(this.selected_property.value);
      }
    });
  }

  get f() {
    return this.categoryForm.controls;
  }

  get_image_data(event) {
    const file = (event.target as HTMLInputElement).files[0];
    const file_size = file.size;
    this.file_size = file_size;
    const reader = new FileReader();
    reader.onload = () => {
      // console.log(reader.result as string);
      this.preview_image = reader.result as string;
    };
    reader.readAsDataURL(file);

    this.image_selected = true;
  }

  ngOnInit() {
    this.categoryForm = this.formBuilder.group({
      categoryName: ["", Validators.required],
      categoryIcon: ["", Validators.required],
    });

    console.log();
  }

  resetMatSelect() {
    this.searchTextValue = "";
    this.propertiesFilter = [...this.properties];
  }

  focusOnInput($event) {
    this.inputBox.nativeElement.focus();
    $event.stopPropagation();
    $event.preventDefault();
  }

  searchBuilding(searchText, $event) {
    $event.stopPropagation();
    if (searchText == "") {
      this.propertiesFilter = [...this.properties];
    } else {
      var val = new String(searchText).trim().toLowerCase();
      var data = this.properties.filter((prop) =>
        String(prop.viewValue).toLowerCase().startsWith(val)
      );

      this.propertiesFilter.splice(1, this.propertiesFilter.length - 1);
      data.forEach((p) => {
        this.propertiesFilter.push(p);
      });
    }
  }

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close({
      data: this.form_submit,
    });
  }

  stauts_change(event, id) {
    // console.log(event.checked);

    let status = event.checked == true ? 1 : 0;
    let data = {
      status: status,
      id: id,
    };
    let json_format = JSON.stringify(data);

    this.apiAdminService
      .changeCategoryStatus(json_format)
      .subscribe((value: any) => {
        console.log(value);
        // this.selectAllCategories()
        this.dialogRef.close();
      });
  }

  delete_item(data: any) {
    this.display_msg = true;
    this.apiAdminService.deleteServiceCategory(data).subscribe((value: any) => {
      if (value.status == 1) {
        this.alert_msg = value.msg;
        this.item_deleted = true;
        this.form_submit = true;
        // this.selectAllCategories()
        // console.log(this.msg);
      } else {
        this.msg = value.msg;
        this.item_deleted = false;
      }
    });
    setTimeout(() => {
      this.display_msg = false;
      this.dialogRef.close();
    }, 2000);
  }

  submit() {
    if (this.category_name !== "" && this.property_id !== "") {
      this.input_array = [];

      let image_array =
      this.image_selected
          ? this.preview_image.split(";base64,")
          : undefined;
      let image_data = image_array != undefined ? image_array[1] : undefined;
      let image_type =
        image_array != undefined ? image_array[0].split("/")[1] : undefined;

      this.input_array.push({
        id: this.id,
        name: this.category_name,
        icon: image_array != undefined ? image_data : "",
        size: image_array != undefined ? this.file_size : "",
        type: image_type != undefined ? image_type : "",
        icon_available: image_array != undefined ? 1 : 0,
        property: this.property_id,
      });

      this.apiAdminService
        .updateCategory(JSON.stringify(this.input_array))
        .subscribe((value: any) => {
          console.log(value);
          this.alert_msg = value.msg;
          this.msg_status = value.status > 0 ? true : false;
          this.preview_image = "";
          this.image_selected = false;
          this.form_submit = true;

          this.property_id = "";
          this.category_name = "";
          this.category_icon = undefined;
          // this.onCloseDialog();
        });
    }
  }
}
