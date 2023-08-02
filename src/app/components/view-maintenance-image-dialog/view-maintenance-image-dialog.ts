import { Component, Inject, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
  MatDialogModule
} from "@angular/material/dialog";




@Component({
  selector: "view-maintenance-image-dialog",
  styleUrls: ["./view-maintenance-image-dialog.scss"],
  templateUrl: "./view-maintenance-image-dialog.html",
  
})
export class ViewMaintenanceImageDialog implements OnInit {
 
  constructor(
    // private dialogRef: MatDialogRef,
    public dialogRef: MatDialogRef<ViewMaintenanceImageDialog>,
  ) {
   
    
  }

  ngAfterViewInit() {}
  ngOnInit() {
  
  }

  onCloseDialog() {
    this.dialogRef.close({
      
    });
  }
}
