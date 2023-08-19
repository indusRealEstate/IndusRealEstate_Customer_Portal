import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ViewFinanceDetailsDialog } from "app/components/view-finance-details-dialog/view-finance-details-dialog";
import { ViewIncomeStatementDialog } from "app/components/view-income-statement-dialog/view-income-statement-dialog";
import { ViewPaymentDetailsMoreDialog } from "app/components/view-payment-details-more-dialog/view-payment-details-more-dialog";
import { AdminService } from "app/services/admin.service";

// const ELEMENT_DATA: PeriodicElement[] = [
//   {UnitName: '3 Central Ave', Tenant:'kiran', Rent: 55000, PaymentMode: 'Card', PaymentAmount:20000, PaymentDetails: '12345644434'},
//   {UnitName: '3 Central Ave', Tenant:'kiran', Rent: 55000, PaymentMode: 'Card', PaymentAmount:20000, PaymentDetails: '12345644434'},

// ];
interface DropDownButtonModel {
  value: string;
  viewValue: string;
}
@Component({
  selector: "admin-report",
  templateUrl: "./admin-report.html",
  styleUrls: ["./admin-report.scss"],
})
export class AdminReport implements OnInit {
  all_data: object | any;
  all_tenant_payment:Object | any;
  tenant_unpaid_payment:Object | any;
  tenant_paid_payment : Object| any;
  displayedColumns: string[] = [
    "UnitName",
    "Tenant",
    "Rent",
    "PaymentMode",
    "PaymentAmount",
    "PaymentDetails",
    "More"
  ];
  dateFilter: DropDownButtonModel[] = [
    { value: "current_month", viewValue: "Current-month" },
    { value: "Last-3-month", viewValue: "Last-3-month" },
    { value: "Last-6-month", viewValue: "Last-6-month" },
    
  ];

  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;
  payment_id: number;
  @ViewChild("paginator") paginator: MatPaginator;
  uid: number;
  allProperties: any[] = [];
  allUnits: any[] = [];
  allUsers: any[] = [];
  allContracts: any[] = [];
  allRequests: any[] = [];

  allMatTableData: MatTableDataSource<any>;
  constructor(
    private appAdminService: AdminService,
    private dialog: MatDialog
  ) {
    // this.isLoading = true;
    this.isContentLoading = true;
    this.getScreenSize();
  }
  dashboardMainCards: any[] = [
    {
      title: "Total Landlords",
      icon: "assets/img/pngs/dashboard/landlord.png",
      url:"/all-users"
    },
    {
      title: "Total Maintenance Requests",
      icon: "assets/img/pngs/dashboard/maintenance.png",
      url:"/admin-requests"
    },
    {
      title: "Total Units",
      icon: "assets/img/pngs/dashboard/unit.png",
      url:"/admin-properties-units"
    },
  ];

  dashboardMainCardsPartTwo: any[] = [
    {
      title: "Total Tenants",
      icon: "assets/img/pngs/dashboard/tenant-2.png",
      url:"/all-users"
    },
    {
      title: "Total Active Contracts",
      icon: "assets/img/pngs/dashboard/contract.png",
     
    },
    {
      title: "Total Buildings",
      icon: "assets/img/pngs/dashboard/property.png",
      url:"/admin-properties"
    },
  ];

 

  screenHeight: number;
  screenWidth: number;
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  ngAfterViewInit() {}

  getAllData() {
    var propertiesDataSession = JSON.parse(
      sessionStorage.getItem("admin_properties_session")
    );

    if (propertiesDataSession == null) {
      this.appAdminService.getallPropertiesAdmin().subscribe((val: any[]) => {
        this.allProperties = val;
      });
    } else {
      this.allProperties = propertiesDataSession;
    }

    var unitsDataSession = JSON.parse(
      sessionStorage.getItem("admin_properties_units_session")
    );

    if (unitsDataSession == null) {
      this.appAdminService
        .getallPropertiesUnitsAdmin()
        .subscribe((val: any[]) => {
          this.allUnits = val;
        });
    } else {
      this.allUnits = unitsDataSession;
    }

    var usersDataSession = JSON.parse(
      sessionStorage.getItem("all_users_session")
    );

    if (usersDataSession == null) {
      this.appAdminService.getAllUsersAdmin().subscribe((val: any[]) => {
        this.allUsers = val;
        
      });
    } else {
      this.allUsers = usersDataSession;
    }

    var leaseDataSession = JSON.parse(
      sessionStorage.getItem("all_lease_session")
    );

   
      this.appAdminService.getAllLeaseAdmin().subscribe((val: any[]) => {
        this.allContracts = val;
      });
   

    this.appAdminService.getAllRequestsAdmin().subscribe((val: any[]) => {
      this.allRequests = val;
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

  financeDetailDialog(id: string, method: string) {
    console.log(id);
    console.log(method);
    let data: object = {
      id: id,
      method: method,
    };
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

  async ngOnInit() {
    this.getAllData();
    
    let data = {};
    this.appAdminService
      .selectTenantsPaymentsDetails(JSON.stringify(data))
      .subscribe((val) => {
        this.all_data = val;
        console.log(this.all_data);
        this.allMatTableData = this.all_data;
        this.allMatTableData = new MatTableDataSource<any>(this.all_data);
        setTimeout(() => {
          if (this.allMatTableData != undefined) {
            this.allMatTableData.paginator = this.paginator;
          } else {
            setTimeout(() => {
              this.allMatTableData.paginator = this.paginator;
            }, 3000);
          }
        });

        console.log(this.all_data);
      });

      this.appAdminService.totalTenantPayment(JSON.stringify(data))
      .subscribe((val) => {
        this.all_tenant_payment = val;
       // console.log(this.all_tenant_payment);
      });

      this.appAdminService.paidTenantPayment(JSON.stringify(data))
      .subscribe((val) => {
        this.tenant_paid_payment = val;
       // console.log(this.tenant_paid_payment);
      });

      this.appAdminService.unpaidTenantPayment(JSON.stringify(data))
      .subscribe((value) => {
        this.tenant_unpaid_payment = value;
        console.log(this.tenant_unpaid_payment);
      });
  }
}
