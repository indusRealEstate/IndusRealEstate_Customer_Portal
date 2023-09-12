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
  selector: "add_amenities_dialog",
  styleUrls: ["./add_amenities_dialog.scss"],
  templateUrl: "./add_amenities_dialog.html",
})
export class AddAmenitiesDialog implements OnInit {
  amenities: string = "";
  amenities_array: string[] = [];
  unit_id: string = "";
  updated: boolean = false;
  msg: string = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddAmenitiesDialog>,
    private unitService: UnitsService,
    private requestService: RequestService,
    private formBuilder: FormBuilder
  ) {
    this.unit_id = data.unit_id;
  }

  ngOnInit() {}

  addAmenies() {
    this.amenities_array.push(this.amenities);
  }

  amenitiesInput(event) {
    if (event.key === "Enter") {
      this.addAmenies();
      this.amenities = "";
    }
  }

  deleteAmenities(index) {
    this.amenities_array.splice(index, 1);
  }

  updateAmenies() {
    let data = {
      unit_id: this.unit_id,
      amenities: JSON.stringify(this.amenities_array),
    };
    this.unitService.updateAmenities(data).subscribe((value: any) => {
      let status = value.status;
      let msg = value.msg;
      // this.updated = true;
      this.msg = msg;
      this.onCloseDialog();
    });
  }

  ngAfterViewInit() {}
  // this.alert_msg = value.msg;
  // this.form_submit
  onCloseDialog() {
    this.dialogRef.close({
      amenities: JSON.stringify(this.amenities_array),
      msg: this.msg
    });
    this.amenities_array = [];
  }
}
