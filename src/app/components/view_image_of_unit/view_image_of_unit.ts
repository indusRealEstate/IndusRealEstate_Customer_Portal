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
  selector: "add_category_dialog",
  styleUrls: ["./view_image_of_unit.scss"],
  templateUrl: "./view_image_of_unit.html",
})
export class ViewImageOfUnit implements OnInit {



  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewImageOfUnit>,
    private apiService: ApiService,
    private apiAdminService: AdminService,
    private chatService: ChatService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog?: MatDialog
  ) {
  }



  get_image_data(event) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {}

  onCloseDialog() {
  }
}
