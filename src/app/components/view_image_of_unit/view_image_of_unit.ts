import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "add_category_dialog",
  styleUrls: ["./view_image_of_unit.scss"],
  templateUrl: "./view_image_of_unit.html",
})
export class ViewImageOfUnit implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewImageOfUnit>
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {}

  onCloseDialog() {}
}
