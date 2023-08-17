import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { ViewFinanceDetailsDialog } from "app/components/view-finance-details-dialog/view-finance-details-dialog";
import { ViewIncomeStatementDialog } from "app/components/view-income-statement-dialog/view-income-statement-dialog";
import { ViewPaymentDetailsMoreDialog } from "app/components/view-payment-details-more-dialog/view-payment-details-more-dialog";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { user } from "@angular/fire/auth";


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
  displayedColumns: string[] = ['UnitName', 'Tenant', 'Rent', 'PaymentMode', 'PaymentAmount', 'PaymentDetails','More'];
  allMatTableData: MatTableDataSource<any>;
  ngAfterViewInitInitialize: boolean = false;
 
  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;
  payment_id: number;
  @ViewChild('paginator') paginator: MatPaginator;
  uid: number;
  allProperties: any[] = [];
  allUnits: any[] = [];
  allUsers: any[] = [];
  allContracts: any[] = [];
  allRequests: any[] = [];
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

  dashboardMainCards: any[] = [
    {
      title: "Total Landlords",
      icon: "assets/img/pngs/dashboard/landlord.png",
    },
    {
      title: "Total Maintenance Requests",
      icon: "assets/img/pngs/dashboard/maintenance.png",
    },
    {
      title: "Total Units",
      icon: "assets/img/pngs/dashboard/unit.png",
    },
  ];
  dashboardMainCardsPartTwo: any[] = [
    {
      title: "Total Tenants",
      icon: "assets/img/pngs/dashboard/tenant-2.png",
    },
    {
      title: "Total Active Contracts",
      icon: "assets/img/pngs/dashboard/contract.png",
    },
    {
      title: "Total Buildings",
      icon: "assets/img/pngs/dashboard/property.png",
    },
  ];

  screenHeight: number;
  screenWidth: number;
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  ngAfterViewInit() {
    
  }
  
  financeDetailDialog(id: string, type: string) {
    console.log(id)
    console.log(type)
    let data: object = {
      id : id,
      method: type
    }
    this.dialog
      .open(ViewFinanceDetailsDialog, {
        width: "50%",
        height: "20rem",
        data
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
  
  viewProperty(data:any) {
    this.router.navigate(["/admin-properties"], {
      queryParams: {
        
      },
    });
  }

  

  
  async ngOnInit() {
    let data = {
     
    };
    this.appAdminService
      .selectTenantsPaymentsDetails(JSON.stringify(data))
      .subscribe((val) => {
        this.all_data = val;
        console.log(this.all_data);
        this.allMatTableData = this.all_data;
        this.allMatTableData = new MatTableDataSource<any>(
          this.all_data
        );
        setTimeout(() => {
          if (this.allMatTableData != undefined) {
            this.allMatTableData.paginator = this.paginator;
          } else {
            setTimeout(() => {
              this.allMatTableData.paginator = this.paginator;
            }, 3000);
          }
        });

         console.log(this.allMatTableData);
         //console.log(this.all_data.t_amount);

        //  for(let item of this.all_data){
        //   console.log(item.t_amount);
        //  }
  
  });
  this.appAdminService.getAllRequestsAdmin().subscribe((val: any[]) => {
    this.allRequests = val;
  });

  this.appAdminService.getAllLeaseAdmin().subscribe((val: any[]) => {
    this.allContracts = val;
  });

  this.appAdminService.getallPropertiesAdmin().subscribe((val: any[]) => {
    this.allProperties = val;
  });

  // this.appAdminService.getAllLeaseAdmin().subscribe((val: any[]) => {
  //   this.allContracts = val;
  // });
  this.appAdminService.getAllUsersAdmin().subscribe((val: any[]) => {
    this.allUsers = val;
  });
  this.appAdminService.getallPropertiesUnitsAdmin().subscribe((val: any[]) => {
    this.allUnits = val;
  });
}
getStatsCount(title) {
  switch (title) {
    case "Total Landlords":
      return this.allUsers.filter((user) => user.user_type == "owner").length;
    case "Total Maintenance Requests":
      return this.allRequests.length;
    case "Total Units":
      return this.allUnits.length;
    case "Total Tenants":
      return this.allUsers.filter((user) => user.user_type == "tenant")
        .length;
    case "Total Active Contracts":
      return this.allContracts.filter((contrct) => contrct.status == "active")
        .length;
    case "Total Buildings":
      return this.allProperties.length;
    default:
      break;
  }
}

}
