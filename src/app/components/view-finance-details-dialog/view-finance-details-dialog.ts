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
  all_data: Object | any;
  id: string = "";
  type: string = "";


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewFinanceDetailsDialog>,
    private appAdminService: AdminService
  ) {
    console.log(data);
    this.id = data.id;
    this.type = data.type;


  }

 
  async ngOnInit() {
    let data = {
     id :this.id,
     type: this.type
    };
    this.appAdminService
      .paymentsDetails(JSON.stringify(data))
      .subscribe((val) => {
        this.all_data = val;
         console.log(this.all_data);
         //console.log(this.all_data.t_amount);

        //  for(let item of this.all_data){
        //   console.log(item.t_amount);
        //  }
  
  });
  
}

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close();
  }


  
}
