import { HttpEvent, HttpEventType } from "@angular/common/http";
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AdminService } from "app/services/admin.service";
import { catchError, last, map, tap } from "rxjs";
import * as uuid from "uuid";



@Component({
  selector: "view-finance-details-dialog",
  styleUrls: ["./view-finance-details-dialog.scss"],
  templateUrl: "./view-finance-details-dialog.html",
})
export class ViewFinanceDetailsDialog implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewFinanceDetailsDialog>,
    private adminService: AdminService
  ) {}

 
  ngOnInit() {}

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close();
  }


  
}
