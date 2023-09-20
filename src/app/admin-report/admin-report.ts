import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { ViewIncomeStatementDialog } from "app/components/view-income-statement-dialog/view-income-statement-dialog";
import { ViewPaymentDetailsMoreDialog } from "app/components/view-payment-details-more-dialog/view-payment-details-more-dialog";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";
import { PaymentService } from "app/services/payment.service";
import { RequestService } from "app/services/request.service";

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
  all_tenant_payment: Object | any;
  tenant_unpaid_payment: Object | any;
  tenant_paid_payment: Object | any;
  displayedColumns: string[] = [
    "UnitName",
    "Tenant",
    "Rent",
    "PaymentMode",
    "PaymentAmount",
    "PaymentDetails",
    "More",
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
  allProperties_length: number = 0;
  allUnits_length: number = 0;
  allUnits_vacant_length: number = 0;
  allUnits_occupied_length: number = 0;
  allUsers_landlord_length: any[] = [];
  allUsers_tenant_length: any[] = [];
  allContracts_active_length: number = 0;
  allRequests: any[] = [];

  allMatTableData: MatTableDataSource<any>;

  constructor(
    private adminService: AdminService,
    private requestService: RequestService,
    private paymentService: PaymentService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private dialog: MatDialog
  ) {
    // this.isLoading = true;
    this.isContentLoading = true;
    this.getScreenSize();

    authenticationService.validateToken().subscribe((res) => {
      if (res != "not-expired") {
        authenticationService.logout();
      }
    });
  }
  dashboardMainCards: any[] = [
    {
      title: "Total Landlords",
      icon: "assets/img/pngs/dashboard/landlord.png",
      url: "/all-users",
      queryparam: "owner",
    },
    {
      title: "Total Maintenance Requests",
      icon: "assets/img/pngs/dashboard/maintenance.png",
      url: "/requests",
    },
    {
      title: "Total Units",
      icon: "assets/img/pngs/dashboard/unit.png",
      url: "/properties-units",
    },
  ];

  dashboardMainCardsPartTwo: any[] = [
    {
      title: "Total Tenants",
      icon: "assets/img/pngs/dashboard/tenant-2.png",
      url: "/all-users",
      queryparam: "tenant",
    },
    {
      title: "Total Active Contracts",
      icon: "assets/img/pngs/dashboard/contract.png",
      url: "/contracts",
      queryparam: "active",
    },
    {
      title: "Total Buildings",
      icon: "assets/img/pngs/dashboard/property.png",
      url: "/properties",
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
    this.adminService.getallDataDashboard().subscribe((res) => {
      this.allContracts_active_length = res.all_active_contracts;
      this.allProperties_length = res.all_buildings;
      this.allUnits_length = res.all_units;
      this.allUnits_vacant_length = res.vacant_units;
      this.allUnits_occupied_length = res.occupied_units;
      this.allUsers_landlord_length = res.landlords;
      this.allUsers_tenant_length = res.tenants;
    });

    this.requestService.getAllRequestsAdminCount().subscribe((val: any[]) => {
      this.allRequests = val;
    });
  }

  getStatsCount(title) {
    switch (title) {
      case "Total Landlords":
        return this.allUsers_landlord_length;
      case "Total Maintenance Requests":
        return this.allRequests;
      case "Total Units":
        return this.allUnits_length;
      case "Total Tenants":
        return this.allUsers_tenant_length;
      case "Total Active Contracts":
        return this.allContracts_active_length;
      case "Total Buildings":
        return this.allProperties_length;
      default:
        break;
    }
  }

  financeDetailDialog(id: string, method: string) {
    this.dialog.open(ViewPaymentDetailsMoreDialog, {
      width: "75vw",
      height: "50vh",
      data: {
        id: id,
        method: method,
        parent: "Report",
        sub_parent: "All Payments",
        child: "Payment Details",
      },
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
    this.paymentService
      .selectTenantsPaymentsDetails(JSON.stringify(data))
      .subscribe((val) => {
        this.all_data = val;
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
      })
      .add(() => {
        this.isContentLoading = false;
      });

    this.paymentService
      .totalTenantPayment(JSON.stringify(data))
      .subscribe((val) => {
        this.all_tenant_payment = val;
        // console.log(this.all_tenant_payment);
      });

    this.paymentService
      .paidTenantPayment(JSON.stringify(data))
      .subscribe((val) => {
        this.tenant_paid_payment = val;
        // console.log(this.tenant_paid_payment);
      });

    this.paymentService
      .unpaidTenantPayment(JSON.stringify(data))
      .subscribe((value) => {
        this.tenant_unpaid_payment = value;
      });
  }
}
