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
import { ChatService } from "app/services/chat.service";

@Component({
  selector: "edit_category_dialog",
  styleUrls: ["./edit_category_dialog.scss"],
  templateUrl: "./edit_category_dialog.html",
})
export class EditCategoryDialog implements OnInit {
  form_submit: boolean = false;

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
  id: Number;
  name: string;
  image: string;
  status: boolean;
  category_data: object;

  preview_image: string;
  file_size: Number;
  image_selected: boolean = false;

  main_array: any[];
  msg: string;
  item_deleted: boolean = false;
  display_msg: boolean = false;
  is_active : boolean = false;

  edit_show: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditCategoryDialog>,
    private apiService: ApiService,
    private apiAdminService: AdminService,
    private chatService: ChatService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog?: MatDialog
  ) {
    this.category_data = data;
    this.name = data.name;
    this.id = data.id;
    this.image = data.icon;
    this.status = (data.status !== "0") ? true : false;

    this.preview_image = `https://indusre.app/api/upload/category/${this.image}`;
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
      let image_array = this.preview_image.split(";base64,");
      let image_data = image_array[1];
      let image_type = image_array[0].split("/")[1];

      this.input_array.push({
        id: this.id,
        name: this.categoryForm.value["categoryName"],
        icon: image_data,
        size: this.file_size,
        type: image_type,
        icon_available: 1
      });
    } else {
      this.input_array.push({
        id: this.id,
        name: this.categoryForm.value["categoryName"],
        icon_available: 0
      });
    }

    this.json_format = JSON.stringify(this.input_array);

    this.apiAdminService
      .updateCategory (this.json_format)
      .subscribe((value: any) => {
        
        this.alert_msg = value.msg;
        this.form_submit = value.status > 0 ? true : false;
        this.categoryForm.reset();
        this.image_selected = false;
        setTimeout(()=>{
          this.onCloseDialog();
        },2000)
        
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

    console.log();
  }

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close({
      data: this.form_submit,
    });
  }

  stauts_change(event,id){
    // console.log(event.checked);

    let status = (event.checked == true) ? 1 : 0;
    let data = {
      "status" : status,
      "id" : id
    }
    let json_format = JSON.stringify(data);

    this.apiAdminService.changeCategoryStatus(json_format).subscribe((value:any)=>{
      console.log(value);
      // this.selectAllCategories()
    })

  }

  edit_item(){
    // let data = this.category_data;
    // this.dialog.open(EditCategoryDialog, {
    //   data
    // }).afterClosed().subscribe((val)=>{
    //   // this.selectAllCategories()
    // });
    this.edit_show = true;
  }

  delete_item(data:any){
    this.display_msg = true
    this.apiAdminService.deleteServiceCategory(data).subscribe((value:any)=>{
      if(value.status == 1){
        this.msg = value.msg;
        this.item_deleted = true;
        // this.selectAllCategories()
      }
      else{
        this.msg = value.msg;
        this.item_deleted = false;
      }
    })
    setTimeout(()=>{
      this.display_msg = false;
    },2000)
  }
}
