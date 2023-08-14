import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AdminService } from "app/services/admin.service";
import { ApiService } from "app/services/api.service";

@Component({
  selector: "view_all_unit_inventories",
  styleUrls: ["./view_all_unit_inventories.scss"],
  templateUrl: "./view_all_unit_inventories.html",
})
export class ViewAllUnitInventories implements OnInit {

  unit_inventories_array: object[] = [];
  unit_id: string;
  inventory_obj: object = {
    name:"",
    place:"",
    count:"",
  }
  

  constructor( 
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewAllUnitInventories>,
    private apiService: ApiService,
    private apiAdminService: AdminService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog?: MatDialog
  ) {
    for(let i = 0; i < data.inventories.length; i++){
      this.unit_inventories_array.push(data.inventories[i]);
    }
    this.unit_id = data.id;

    console.log(typeof this.unit_inventories_array);
  }


  ngOnInit() {
    
  }

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close({
      
    });
  }

}
