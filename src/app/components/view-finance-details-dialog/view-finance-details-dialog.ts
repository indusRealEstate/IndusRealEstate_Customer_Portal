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
  method: string = "";
  is_cheque: boolean = false;
  is_online: boolean = false;
  is_cash: boolean = false;
  is_data_loaded: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewFinanceDetailsDialog>,
    private appAdminService: AdminService
  ) {
    //console.log(data.type);
    this.id = data.id;
    this.method = data.method;
    switch (data.method) {
      case "cheque":
        this.is_cheque = true;
        break;
      case "online":
        this.is_online = true;
        break;
      case "cash":
        this.is_cash = true;
        break;
    }
  }

 
  async ngOnInit() {
    let data = {
     id :this.id,
     method: this.method
    };
    this.appAdminService
      .selectPaymentAccordeingToTheMothod(JSON.stringify(data))
      .subscribe((val) => {
        this.all_data = val;
         console.log(this.all_data);
  
  }).add(() => {
    this.is_data_loaded = true;
  });
  
}

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close();
  }


  
}
