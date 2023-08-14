import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { TableFiltersComponent } from "app/components/table-filters/table-filters";
import { ViewFinanceDetailsDialog } from "app/components/view-finance-details-dialog/view-finance-details-dialog";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";

export interface PeriodicElement {
  UnitName: string;
  PaymentMode: string;
  Tenant:string;
  Rent:number;
  PaymentAmount:number;
  PaymentDetails:string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {UnitName: '3 Central Ave', Tenant:'kiran', Rent: 55000, PaymentMode: 'Card', PaymentAmount:20000, PaymentDetails: '12345644434'},
 
];
@Component({
  selector: "admin-financial-report",
  templateUrl: "./admin-financial-report.html",
  styleUrls: ["./admin-financial-report.scss"],
  
})
export class AdminFinancialReport implements OnInit {
  displayedColumns: string[] = ['UnitName', 'Tenant', 'Rent', 'PaymentMode', 'PaymentAmount', 'PaymentDetails'];
  dataSource = ELEMENT_DATA;
 
  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;

  
 

 

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private adminService: AdminService,
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
        height: "43rem",
      })
      .afterClosed()
      .subscribe((res) => {});
  }
  

  async ngOnInit() {
    
  
  }
  
}


