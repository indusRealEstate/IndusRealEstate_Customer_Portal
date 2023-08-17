import { Component, HostListener, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ViewFinanceDetailsDialog } from "app/components/view-finance-details-dialog/view-finance-details-dialog";
import { ViewIncomeStatementDialog } from "app/components/view-income-statement-dialog/view-income-statement-dialog";
import { AdminService } from "app/services/admin.service";

// const ELEMENT_DATA: PeriodicElement[] = [
//   {UnitName: '3 Central Ave', Tenant:'kiran', Rent: 55000, PaymentMode: 'Card', PaymentAmount:20000, PaymentDetails: '12345644434'},
//   {UnitName: '3 Central Ave', Tenant:'kiran', Rent: 55000, PaymentMode: 'Card', PaymentAmount:20000, PaymentDetails: '12345644434'},

// ];
@Component({
  selector: "admin-report",
  templateUrl: "./admin-report.html",
  styleUrls: ["./admin-report.scss"],
})
export class AdminReport implements OnInit {
  all_data: object | any;
  displayedColumns: string[] = [
    "UnitName",
    "Tenant",
    "Rent",
    "PaymentMode",
    "PaymentAmount",
    "PaymentDetails",
  ];

  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;
  payment_id: number;

  constructor(
    private appAdminService: AdminService,
    private dialog: MatDialog
  ) {
    // this.isLoading = true;
    this.isContentLoading = true;

    this.getScreenSize();
  }

  screenHeight: number;
  screenWidth: number;
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  ngAfterViewInit() {}

  financeDetailDialog(id: string, type: string) {
    let data: object = {
      id: id,
      type: type,
    };
    this.dialog
      .open(ViewFinanceDetailsDialog, {
        data,
      })
      .afterClosed()
      .subscribe((value) => {
        //console.log(value)
      });
  }

  incomeStatementDialog() {
    this.dialog
      .open(ViewIncomeStatementDialog, {
        width: "75%",
        height: "46rem",
      })
      .afterClosed()
      .subscribe((res) => {});
  }

  async ngOnInit() {
    let data = {};
    this.appAdminService
      .selectTenantsPaymentsDetails(JSON.stringify(data))
      .subscribe((val) => {
        this.all_data = val;

        console.log(this.all_data);
        //console.log(this.all_data.t_amount);

        //  for(let item of this.all_data){
        //   console.log(item.t_amount);
        //  }
      });
  }
}
