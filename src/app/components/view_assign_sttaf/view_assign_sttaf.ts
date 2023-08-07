import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
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
  selector: "app_view_assign_sttaf",
  styleUrls: ["./view_assign_sttaf.scss"],
  templateUrl: "./view_assign_sttaf.html",
})
export class ViewAssignStaff implements OnInit {
  @Output() valueEmitter: EventEmitter<boolean> = new EventEmitter();

  form_submit: boolean = false;
  category_name: string;
  category_icon: string;

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

  preview_image: string;
  file_size: Number;
  image_selected: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewAssignStaff>,
    private apiService: ApiService,
    private apiAdminService: AdminService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog?: MatDialog
  ) {
    this.category_name = data["category_name"];
    this.category_icon = data["icon"];
  }

  get f() {
    return this.categoryForm.controls;
  }

  submit() {
    this.input_array = [];

    if (this.categoryForm.value["categoryName"] == "") {
      this.error_message_name = "Category name can not be empty";
      this.isEmptyCategoryName = true;

      return false;
    } else {
      this.isEmptyCategoryName = false;
    }

    if (this.f.categoryIcon.value == "") {
      this.error_message_icon = "Category icon can not be empty";
      this.isEmptyCategoryIcon = true;

      return false;
    } else {
      this.isEmptyCategoryIcon = false;
    }

    let image_array = this.preview_image.split(";base64,");
    let image_data = image_array[1];
    let image_type = image_array[0].split("/")[1];

    this.input_array.push({
      name: this.categoryForm.value["categoryName"],
      icon: image_data,
      size: this.file_size,
      type: image_type,
    });

    this.json_format = JSON.stringify(this.input_array);

    this.apiAdminService
      .insertCategory(this.json_format)
      .subscribe((value: any) => {
        this.categoryForm.reset;

        this.alert_msg = value.msg;
        this.form_submit = value.status > 0 ? true : false;
        this.categoryForm.reset();
        this.preview_image = "";
        this.image_selected = false;
        this.valueEmitter.emit(this.form_submit);
        this.onCloseDialog();
      });
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
  }

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close({
      data: this.form_submit,
    });
  }
}
