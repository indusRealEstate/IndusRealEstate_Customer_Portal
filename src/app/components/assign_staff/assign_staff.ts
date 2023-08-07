import {
  Component,
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
  selector: "app_dialog_assign_staff",
  styleUrls: ["./assign_staff.scss"],
  templateUrl: "./assign_staff.html",
})
export class DialogAssignStaff implements OnInit {
  @Output() valueEmitter: EventEmitter<boolean> = new EventEmitter();
  // @ViewChild("msg") msg;

  form_submit: boolean = false;

  assignForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  invaliduser: boolean = false;
  error_message_name: string;
  error_message_icon: string;
  isName: boolean = false;
  isJob: boolean = false;
  input_array: object[] = [];
  json_format: string;
  alert_msg: object;
  select_user: string = "";
  assign_job: string = "";
  msg: string = "";
  status: boolean = false;

  preview_image: string;
  file_size: Number;
  image_selected: boolean = false;
  request_id: string;

  all_users: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogAssignStaff>,
    private apiService: ApiService,
    private apiAdminService: AdminService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog?: MatDialog
  ) {
    this.request_id = data["id"];
    // console.log(this.request_id);
  }

  get f() {
    return this.assignForm.controls;
  }

  submit() {
    this.input_array = [];

    let user = this.select_user.split("->");

    let job = this.f.job_type.value;

    let data = {
      request_id : this.request_id,
      id: user[0],
      job: job,
    };

    console.log(this.msg);

    this.apiAdminService.assignStaff(JSON.stringify(data)).subscribe((value:any)=>{
      if(value.status > 0){
        this.msg = value.msg;
        this.status = true;
      }
      else{
        this.msg = value.msg;
        this.status = false;
      }

      setTimeout(() => {
        let user = this.select_user.split("->");
        this.dialogRef.close({
          data:{
            user_id: user[0],
            user_name: user[1],
            job: this.f.job_type.value
          }
        });
      }, 2000);
    })
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
    this.apiAdminService.selectStaff().subscribe((value) => {
      this.all_users = value;
      // console.log(value);
    });
    this.assignForm = this.formBuilder.group({
      assigned_user: ["", Validators.required],
      job_type: ["", Validators.required],
    });
  }

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close({
      data: this.form_submit,
    });
  }
}
