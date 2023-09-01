import {
  Component,
  Inject,
  OnInit
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

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
  all_data: Object |any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewIncomeStatementDialog>,
  ) {}

  
  ngOnInit() {
  
  }

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close();
  }


  
}
