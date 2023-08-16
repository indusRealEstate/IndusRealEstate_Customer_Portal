import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { TableFiltersComponent } from "app/components/table-filters/table-filters";
import { ViewFinanceDetailsDialog } from "app/components/view-finance-details-dialog/view-finance-details-dialog";
import { ViewIncomeStatementDialog } from "app/components/view-income-statement-dialog/view-income-statement-dialog";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";


// const ELEMENT_DATA: PeriodicElement[] = [
//   {UnitName: '3 Central Ave', Tenant:'kiran', Rent: 55000, PaymentMode: 'Card', PaymentAmount:20000, PaymentDetails: '12345644434'},
//   {UnitName: '3 Central Ave', Tenant:'kiran', Rent: 55000, PaymentMode: 'Card', PaymentAmount:20000, PaymentDetails: '12345644434'},
 
// ];
@Component({
  selector: "admin-financial-report",
  templateUrl: "./admin-financial-report.html",
  styleUrls: ["./admin-financial-report.scss"],
  
})
export class AdminFinancialReport implements OnInit {
  all_data: object | any;
  displayedColumns: string[] = ['UnitName', 'Tenant', 'Rent', 'PaymentMode', 'PaymentAmount', 'PaymentDetails'];
 
 
  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;
  payment_id: number;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private appAdminService: AdminService,
    private dialog: MatDialog
  ) {
    // this.isLoading = true;
    this.isContentLoading = true;

    this.getScreenSize();
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

  }

  screenHeight: number;
  screenWidth: number;
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  ngAfterViewInit() {
   
  }

  financeDetailDialog() {
    this.dialog
      .open(ViewFinanceDetailsDialog, {
        width: "75%",
        height: "46rem",
      })
      .afterClosed()
      .subscribe((res) => {});
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
    let data = {
     
    };
    this.appAdminService
      .selectTenantsPaymentsDetails(JSON.stringify(data))
      .subscribe((val) => {
        this.all_data = val;

         console.log(this.all_data);
         //console.log(this.all_data.t_amount);
  
  });
  
}

}
