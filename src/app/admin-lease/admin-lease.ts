import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { AddLeaseDialog } from "app/components/add_lease_dialog/add_lease_dialog";
import { AddUserDialog } from "app/components/add_user_dialog/add_user_dialog";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";

@Component({
  selector: "admin-lease",
  templateUrl: "./admin-lease.html",
  styleUrls: ["./admin-lease.scss"],
})
export class AllLeasesComponent implements OnInit {
  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;

  displayedColumns: string[] = [
    // "name",
    "contractId",
    "buliding",
    "unitNo",
    "status",
    "leaseExpiry",
    "owner",
    "tenant",
    "moveIn",
    "moveOut",
    "contractStartDate",
    "contractEndDate",
    "deposit",
    "rentAmount",
    "more",
  ];

  allLease: any[] = [];
  allLeaseMatTableData: MatTableDataSource<any>;
  ngAfterViewInitInitialize: boolean = false;

  loadingTable: any[] = [1, 2, 3, 4, 5];

  statusMenuOpened: boolean = false;
  flaggedRequest: boolean = false;

  allProperties: any[] = [];
  allUnits: any[] = [];
  allUsers: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

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

    this.route.queryParams.subscribe((e) => {
      if (e == null) {
        router.navigate([`/admin-lease`], {
          queryParams: { uid: user[0]["id"] },
        });
      } else if (e != user[0]["id"]) {
        router.navigate([`/admin-lease`], {
          queryParams: { uid: user[0]["id"] },
        });
      }
    });
  }

  screenHeight: number;
  screenWidth: number;
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  ngAfterViewInit() {
    if (this.ngAfterViewInitInitialize == true) {
      if (this.allLeaseMatTableData != undefined) {
        this.allLeaseMatTableData.paginator = this.paginator;
        this.allLeaseMatTableData.paginator.pageSize = 10;
      }
    } else {
      setTimeout(() => {
        if (this.allLeaseMatTableData != undefined) {
          this.allLeaseMatTableData.paginator = this.paginator;
          this.allLeaseMatTableData.paginator.pageSize = 10;
        }
      });
    }
  }

  getbuildingName(prop_id) {
    if (this.allProperties != null) {
      var property = this.allProperties.find(
        (prop) => prop.property_id == prop_id
      );
      return property.property_name;
    } else {
      return "loading..";
    }
  }

  getUnitNo(unit_id) {
    if (this.allUnits != null) {
      var unit = this.allUnits.find((u) => u.unit_id == unit_id);
      return unit.unit_no;
    } else {
      return "loading..";
    }
  }

  getUserName(user_id) {
    if (this.allUsers != null) {
      var user = this.allUsers.find((u) => u.user_id == user_id);
      return user.name;
    } else {
      return "loading..";
    }
  }

  getLeaseExpiry(start: any, end: any) {
    var start_date = new Date(start);
    var end_date = new Date(end);

    var difference_In_Time = end_date.getTime() - start_date.getTime();

    var difference_In_Days = difference_In_Time / (1000 * 3600 * 24);

    return `${difference_In_Days} Days left`;
  }

  fetchData() {
    this.adminService
      .getAllLeaseAdmin()
      .subscribe((va: any[]) => {
        console.log(va);
        this.allLease = va;
        this.allLeaseMatTableData = new MatTableDataSource(va);
        setTimeout(() => {
          if (this.allLeaseMatTableData != undefined) {
            this.allLeaseMatTableData.paginator = this.paginator;
            this.allLeaseMatTableData.paginator.pageSize = 10;
          }
        });
      })
      .add(() => {
        this.isContentLoading = false;
        if (this.allLease.length != 0) {
          sessionStorage.setItem(
            "all_lease_session",
            JSON.stringify(this.allLease)
          );
        }
      });
    sessionStorage.setItem(
      "all_lease_session_time_admin",
      JSON.stringify(new Date().getMinutes())
    );
  }

  getAllData() {
    var propertiesDataSession = JSON.parse(
      sessionStorage.getItem("admin_properties_session")
    );

    if (propertiesDataSession == null) {
      this.adminService.getallPropertiesAdmin().subscribe((val: any[]) => {
        this.allProperties = val;
      });
    } else {
      this.allProperties = propertiesDataSession;
    }

    var unitsDataSession = JSON.parse(
      sessionStorage.getItem("admin_properties_units_session")
    );

    if (unitsDataSession == null) {
      this.adminService.getallPropertiesUnitsAdmin().subscribe((val: any[]) => {
        this.allUnits = val;
      });
    } else {
      this.allUnits = unitsDataSession;
    }

    var usersDataSession = JSON.parse(
      sessionStorage.getItem("all_users_session")
    );

    if (usersDataSession == null) {
      this.adminService.getAllUsersAdmin().subscribe((val: any[]) => {
        this.allUsers = val;
      });
    } else {
      this.allUsers = usersDataSession;
    }
  }

  async ngOnInit() {
    this.getAllData();
    var now = new Date().getMinutes();
    var previous = JSON.parse(
      sessionStorage.getItem("all_lease_session_time_admin")
    );

    var adminReqDataSession = JSON.parse(
      sessionStorage.getItem("all_lease_session")
    );

    if (previous != null) {
      var diff = now - Number(previous);

      if (diff >= 5) {
        sessionStorage.removeItem("all_lease_session");
        this.fetchData();
      } else {
        if (adminReqDataSession != null) {
          this.allLease = adminReqDataSession;
          this.allLeaseMatTableData = new MatTableDataSource(
            adminReqDataSession
          );
          this.isContentLoading = false;
          this.ngAfterViewInitInitialize = true;
        } else {
          this.fetchData();
        }
      }
    } else {
      this.fetchData();
    }
  }

  clearAllVariables() {
    this.allLease.length = 0;
  }

  refreshTable() {
    sessionStorage.removeItem("all_lease_session");
    this.isContentLoading = true;

    this.fetchData();
  }

  applyFilter(filterValue: any) {
    var val = new String(filterValue).trim().toLowerCase();
    this.allLeaseMatTableData.filter = val;
  }

  addUserDialogOpen() {
    this.dialog
      .open(AddLeaseDialog, {
        width: "80%",
        height: "50rem",
      })
      .afterClosed()
      .subscribe((res) => {});
  }
}
