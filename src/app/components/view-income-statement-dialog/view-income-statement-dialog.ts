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

interface Staff {
  value: string;
  viewValue: string;
}

@Component({
  selector: "view-income-statement-dialog",
  styleUrls: ["./view-income-statement-dialog.scss"],
  templateUrl: "./view-income-statement-dialog.html",
})
export class ViewIncomeStatementDialog implements OnInit {
  staff: Staff[] = [
    {value: 'Property', viewValue: 'Property'},
    {value: 'Unit', viewValue: 'Unit'},
    {value: 'Lease', viewValue: 'Lease'},
    {value: 'User', viewValue: 'User'},
  ];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewIncomeStatementDialog>,
    private adminService: AdminService
  ) {}

 
  ngOnInit() {}

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close();
  }


  
}
