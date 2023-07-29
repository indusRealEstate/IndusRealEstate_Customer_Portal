import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { AddPropertyDialog } from "app/components/add_property_dialog/add_property_dialog";
import { AddUserDialog } from "app/components/add_user_dialog/add_user_dialog";
import { TableFiltersComponent } from "app/components/table-filters/table-filters";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";

@Component({
  selector: "all-users",
  templateUrl: "./all-users.html",
  styleUrls: ["./all-users.scss"],
})
export class AllUsersComponent implements OnInit {
  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;

  displayedColumns: string[] = [
    // "name",
    "name",
    "mobileNumber",
    "userType",
    "email",
    "idType",
    "idNumber",
    "nationality",
    "dob",
    "allocated_unit",
    "building",
    "more",
  ];

  allUsers: any[] = [];
  allUsersMatTableData: MatTableDataSource<any>;
  ngAfterViewInitInitialize: boolean = false;

  loadingTable: any[] = [1, 2, 3, 4, 5];

  statusMenuOpened: boolean = false;
  flaggedRequest: boolean = false;

  allProperties: any[] = [];
  allUnits: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild("table_filter") table_filter: TableFiltersComponent;

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
        router.navigate([`/all-users`], {
          queryParams: { uid: user[0]["id"] },
        });
      } else if (e != user[0]["id"]) {
        router.navigate([`/all-users`], {
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
      if (this.allUsersMatTableData != undefined) {
        this.allUsersMatTableData.paginator = this.paginator;
        this.allUsersMatTableData.paginator.pageSize = 10;
      }
    } else {
      setTimeout(() => {
        if (this.allUsersMatTableData != undefined) {
          this.allUsersMatTableData.paginator = this.paginator;
          this.allUsersMatTableData.paginator.pageSize = 10;
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

  fetchData() {
    this.adminService
      .getAllUsersAdmin()
      .subscribe((va: any[]) => {
        console.log(va);
        this.allUsers = va;
        this.allUsersMatTableData = new MatTableDataSource(va);
        setTimeout(() => {
          if (this.allUsersMatTableData != undefined) {
            this.allUsersMatTableData.paginator = this.paginator;
            this.allUsersMatTableData.paginator.pageSize = 10;
          }
        });
      })
      .add(() => {
        this.isContentLoading = false;
        if (this.allUsers.length != 0) {
          sessionStorage.setItem(
            "all_users_session",
            JSON.stringify(this.allUsers)
          );
        }
      });
    sessionStorage.setItem(
      "all_users_session_time_admin",
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
  }

  async ngOnInit() {
    this.getAllData();
    var now = new Date().getMinutes();
    var previous = JSON.parse(
      sessionStorage.getItem("all_users_session_time_admin")
    );

    var adminReqDataSession = JSON.parse(
      sessionStorage.getItem("all_users_session")
    );

    if (previous != null) {
      var diff = now - Number(previous);

      if (diff >= 5) {
        sessionStorage.removeItem("all_users_session");
        this.fetchData();
      } else {
        if (adminReqDataSession != null) {
          this.allUsers = adminReqDataSession;
          this.allUsersMatTableData = new MatTableDataSource(
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
    this.allUsers.length = 0;
  }

  refreshTable() {
    sessionStorage.removeItem("all_users_session");
    this.isContentLoading = true;
    if (this.table_filter != undefined) {
      this.table_filter.flaggedRequestsFilterOn = false;
      this.table_filter.statusFilterOn = false;
      this.table_filter.timeLineFilterOn = false;
    }
    this.fetchData();
  }

  applyFilter(filterValue: any) {
    var val = new String(filterValue).trim().toLowerCase();
    this.allUsersMatTableData.filter = val;
  }

  addUserDialogOpen() {
    this.dialog
      .open(AddUserDialog, {
        width: "75%",
        height: "50rem",
      })
      .afterClosed()
      .subscribe((res) => {});
  }
}
