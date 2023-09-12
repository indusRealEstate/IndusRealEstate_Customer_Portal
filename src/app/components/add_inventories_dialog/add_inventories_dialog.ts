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
  selector: "add_inventories_dialog",
  styleUrls: ["./add_inventories_dialog.scss"],
  templateUrl: "./add_inventories_dialog.html",
})
export class AddInventoriesDialog implements OnInit {
  unit_id: string = "";
  updated: boolean = false;
  msg: string = "";
  inventory_place: string = "";
  inventory_name: string = "";
  inventory_count: string = "";
  inventory_array: object[] = [];
  permission: boolean = false;
  name_empty: boolean = false;
  place_empty: boolean = false;
  count_empty: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddInventoriesDialog>,
    private unitService: UnitsService,
    private requestService: RequestService,
    private formBuilder: FormBuilder
  ) {
    this.unit_id = data.unit_id;
  }

  checkPermission(event) {
    if (event.key == "Enter") {
      this.name_empty =
        this.inventory_name !== "" || this.inventory_name !== null
          ? false
          : true;
      this.place_empty =
        this.inventory_place !== "" || this.inventory_place !== null
          ? false
          : true;
      this.count_empty =
        this.inventory_count !== "" || this.inventory_count !== null
          ? false
          : true;
    }
    this.permission =
      this.inventory_place !== "" &&
      this.inventory_name !== "" &&
      this.inventory_count !== "" &&
      this.inventory_place !== null &&
      this.inventory_name !== null &&
      this.inventory_count !== null
        ? true
        : false;
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  addInventories() {
    if (this.permission) {
      let data = {
        inventory_name: this.inventory_name,
        inventory_place: this.inventory_place,
        inventory_count: this.inventory_count,
      };
      this.inventory_array.push(data);
      this.inventory_name = "";
      this.inventory_place = "";
      this.inventory_count = "";
      this.permission = false;
      console.log(this.inventory_array);
    }
  }

  deleteInventories(index) {
    this.inventory_array.splice(index, 1);
  }

  updateInventories() {
    if (this.inventory_array.length > 0) {
      let data = {
        unit_id: this.unit_id,
        inventories: JSON.stringify(this.inventory_array),
      };
      this.unitService.updateInventories(data).subscribe((data: any) => {
        this.msg = data.msg;
        this.onCloseDialog();
      });
    }
  }

  onCloseDialog() {
    this.dialogRef.close({
      msg:this.msg,
      inventories: this.inventory_array
    });
    this.inventory_array = [];
  }
}
