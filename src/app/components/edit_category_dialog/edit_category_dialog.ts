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
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { RequestService } from "app/services/request.service";
import { UnitsService } from "app/services/units.service";

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
  unitsFilter: string[] = [];

  categoryData: any[] = [];

  categories_props: any[] = [];

  @ViewChild("inputBox") inputBox!: ElementRef;

  units: any[] = [{ testfield: true }];
  unit_id: any = "";

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

  selected_unit: object = {
    value: "",
    viewValue: "",
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditCategoryDialog>,
    private unitsService: UnitsService,
    private requestService: RequestService,
    private formBuilder: FormBuilder
  ) {
    this.category_data = data;
    this.name = data.name;
    this.id = data.id;
    this.image = data.icon;
    this.status = data.status !== "0" ? true : false;

    this.category_name = data.name;
    this.category_icon = data.icon;

    this.preview_image = `https://indusre.app/api/upload/category/${this.image}`;

    this.unitsService.getallUnitTypes().subscribe((val: any[]) => {
      console.log(val);

      var count = 0;
      val.forEach((unit) => {
        this.units.push({
          value: unit.id,
          viewValue: unit.type,
        });
        count++;
      });

      console.log(this.units);

      if (count == val.length) {
        this.unitsFilter = [...this.units];

        let data_filter = this.units.filter(
          (item) => item.value == data.unit_type
        );

        this.selected_unit = {
          value: data_filter[0].value,
          viewValue: data_filter[0].viewValue,
        };

        this.unit_id = data_filter[0].value;
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
    this.unitsFilter = [...this.units];
  }

  focusOnInput($event) {
    this.inputBox.nativeElement.focus();
    $event.stopPropagation();
    $event.preventDefault();
  }

  searchBuilding(searchText, $event) {
    $event.stopPropagation();
    if (searchText == "") {
      this.unitsFilter = [...this.units];
    } else {
      var val = new String(searchText).trim().toLowerCase();
      var data = this.units.filter((prop) =>
        String(prop.viewValue).toLowerCase().startsWith(val)
      );

      this.unitsFilter.splice(1, this.unitsFilter.length - 1);
      data.forEach((p) => {
        this.unitsFilter.push(p);
      });
    }
  }

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close({
      form_submit: this.form_submit,
      status: this.msg_status,
      msg: this.form_submit ? this.alert_msg : undefined,
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

    this.requestService
      .changeCategoryStatus(json_format)
      .subscribe((value: any) => {
        console.log(value);
        // this.selectAllCategories()
        this.dialogRef.close();
      });
  }

  delete_item(data: any) {
    this.display_msg = true;
    this.requestService.deleteServiceCategory(data).subscribe((value: any) => {
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
    if (this.category_name !== "" && this.unit_id !== "") {
      this.input_array = [];

      let image_array = this.image_selected
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
        unit_type: this.unit_id,
      });

      this.requestService
        .updateCategory(JSON.stringify(this.input_array))
        .subscribe((value: any) => {
          this.alert_msg = value.msg;
          this.msg_status = value.status > 0 ? true : false;
          this.preview_image = "";
          this.image_selected = false;
          this.form_submit = true;

          this.unit_id = "";
          this.category_name = "";
          this.category_icon = undefined;
          this.onCloseDialog();
        });
    }
  }
}
