import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { TableFiltersComponent } from "app/components/table-filters/table-filters";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";

export interface PeriodicElement {
  weight: number;
  symbol: string;
  Tenant:string;
  Rent:number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {Tenant: 'kiran', Rent: 55000, weight: 1.0079, symbol: 'H'},
  {Tenant: 'kiran', Rent: 55000, weight: 4.0026, symbol: 'He'},
  {Tenant: 'kiran', Rent: 55000, weight: 6.941, symbol: 'Li'},
  {Tenant: 'kiran', Rent: 55000, weight: 9.0122, symbol: 'Be'},
  {Tenant: 'kiran', Rent: 55000, weight: 9.0122, symbol: 'Be'},
 
 
  
];
@Component({
  selector: "admin-financial-report",
  templateUrl: "./admin-financial-report.html",
  styleUrls: ["./admin-financial-report.scss"],
  
})
export class AdminFinancialReport implements OnInit {
  displayedColumns: string[] = ['Tenant', 'Rent', 'weight', 'symbol'];
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

  

  

  

  async ngOnInit() {
    
  }

  
}
