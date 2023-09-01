import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from "@angular/material/dialog";
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: "view_all_unit_inventories",
  styleUrls: ["./view_all_unit_inventories.scss"],
  templateUrl: "./view_all_unit_inventories.html",
})
export class ViewAllUnitInventories implements OnInit {
  unit_inventories_array: object[] = [];
  unit_id: string;
  inventory_obj: object = {
    name: "",
    place: "",
    count: "",
  };

  parent: string;
  sub_parent: string;
  child: string;
  is_data_loaded: boolean = false;
  data_source: MatTableDataSource<any>;
  displayedColumns: string[] = ["inventory_name","inventory_place","inventory_count"];
  displayPreloadCol: string[] = ["Inventory name","Inventory place", "Inventory count"];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewAllUnitInventories>,
  ) {
    for (let i = 0; i < data.inventories.length; i++) {
      this.unit_inventories_array.push(data.inventories[i]);
    }
    // setTimeout(()=>{
      this.data_source = new MatTableDataSource<any>(this.unit_inventories_array)
      
    // }, 2000);

    this.unit_id = data.id;
    this.parent = data.parent;
    this.sub_parent = data.sub_parent;
    this.child = data.child;

    console.log(this.unit_inventories_array);
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.is_data_loaded = true;
  }

  onCloseDialog() {
    this.dialogRef.close({});
  }
}
