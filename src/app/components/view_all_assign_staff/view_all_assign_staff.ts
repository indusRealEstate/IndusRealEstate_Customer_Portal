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
  selector: "view_all_assign_staff",
  styleUrls: ["./view_all_assign_staff.scss"],
  templateUrl: "./view_all_assign_staff.html",
})
export class ViewAllAsignStaff implements OnInit {
  @Output() valueEmitter: EventEmitter<boolean> = new EventEmitter();
  request_id: string;
  assign_staff: object[] = [];

  preview_image: string;
  file_size: Number;
  image_selected: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewAllAsignStaff>,
    private apiService: ApiService,
    private apiAdminService: AdminService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog?: MatDialog
  ) {
    for (let i = 0; i < JSON.parse(data.staff_assigned).length; i++) {
      let info = {
        name: JSON.parse(data.staff_assigned)[i].user_name,
        user_id: JSON.parse(data.staff_assigned)[i].user_id,
        job: JSON.parse(data.staff_assigned)[i].job,
        date_and_time: JSON.parse(data.staff_assigned)[i].date_and_time,
      };
      this.assign_staff.push(info);
    }
    console.log(this.assign_staff);
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

  ngOnInit() {}

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close({});
  }
}
