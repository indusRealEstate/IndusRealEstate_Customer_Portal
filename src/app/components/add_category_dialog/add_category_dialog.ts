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
  selector: "add_category_dialog",
  styleUrls: ["./add_category_dialog.scss"],
  templateUrl: "./add_category_dialog.html",
})
export class AddCategoryDialog implements OnInit {
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddCategoryDialog>,
    private apiService: ApiService,
    private apiAdminService: AdminService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog?: MatDialog
  ) {
    this.apiAdminService.getallUnitTypes().subscribe((val: any[]) => {

      val.forEach((unit) => {
        this.units.push({
          value: unit.id,
          viewValue: unit.type,
        });
      });
    });

    console.log(this.units);
  }

  get f() {
    return this.categoryForm.controls;
  }

  get_image_data(event) {
    const file = (event.target as HTMLInputElement).files[0];
    const file_size = typeof event == "object" ? file.size : undefined;
    this.file_size = file_size != undefined ? file_size : undefined;
    this.category_icon = typeof event == "object" ? file.name : undefined;
    if (typeof event == "object") {
      const reader = new FileReader();
      reader.onload = () => {
        // console.log(reader.result as string);
        this.preview_image = reader.result as string;
      };
      reader.readAsDataURL(file);

      this.image_selected = true;
    }
    else{
      this.preview_image = undefined;
    }
  }

  resetMatSelect() {
    this.searchTextValue = "";
    this.unitsFilter = [...this.units];
  }

  selectunit(event) {
    this.unitsFilter = this.units;
    // console.log(event.value);
    if (event.value == "all" || event.value == undefined) {
      this.categories_props = this.categoryData;
    } else {
      this.categories_props = this.categoryData.filter(
        (catg) => catg.prop_id == event.value
      );
    }
  }

  ngOnInit() {
    this.categoryForm = this.formBuilder.group({
      categoryName: ["", Validators.required],
      categoryIcon: ["", Validators.required],
    });
  }

  ngAfterViewInit() {}
  // this.alert_msg = value.msg;
  // this.form_submit
  onCloseDialog() {
    this.dialogRef.close({
      form_submit: this.form_submit,
      status : this.msg_status,
      msg: this.form_submit ? this.alert_msg : undefined,
    });

    this.form_submit = false;
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

  submit() {
    if (
      this.unit_id !== "" &&
      this.category_name !== "" &&
      this.category_icon != undefined &&
      this.preview_image != undefined
    ) {
      console.log(this.unit_id);
      this.input_array = [];

      let image_array = this.preview_image.split(";base64,");
      let image_data = image_array[1];
      let image_type = image_array[0].split("/")[1];

      this.input_array.push({
        name: this.category_name,
        icon: image_data,
        size: this.file_size,
        type: image_type,
        unit: this.unit_id,
      });

      this.apiAdminService
        .insertCategory(JSON.stringify(this.input_array))
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

    // if (this.categoryForm.value["categoryName"] == "") {
    //   this.error_message_name = "Category name can not be empty";
    //   this.isEmptyCategoryName = true;

    //   return false;
    // } else {
    //   this.isEmptyCategoryName = false;
    // }

    // if (this.f.categoryIcon.value == "") {
    //   this.error_message_icon = "Category icon can not be empty";
    //   this.isEmptyCategoryIcon = true;

    //   return false;
    // } else {
    //   this.isEmptyCategoryIcon = false;
    // }
  }
}
