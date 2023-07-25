import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { AddUnitDialog } from "app/components/add_unit_dialog/add_unit_dialog";
import { TableFiltersComponent } from "app/components/table-filters/table-filters";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";

@Component({
  selector: "admin-properties-units",
  templateUrl: "./admin-properties-units.html",
  styleUrls: ["./admin-properties-units.scss"],
})
export class AdminPropertiesUnits implements OnInit {
  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;

  displayedColumns: string[] = [
    // "name",
    "unitNo",
    "propertyName",
    "floor",
    "size",
    "status",
    "ownerName",
    "bedroom",
    "bathroom",
    "more",
  ];

  allProperties: any[] = [];
  allPropertiesMatTableData: MatTableDataSource<any>;
  ngAfterViewInitInitialize: boolean = false;

  loadingTable: any[] = [1, 2, 3, 4, 5];

  statusMenuOpened: boolean = false;
  flaggedRequest: boolean = false;

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
        router.navigate([`/admin-properties-units`], {
          queryParams: { uid: user[0]["id"] },
        });
      } else if (e != user[0]["id"]) {
        router.navigate([`/admin-properties-units`], {
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
      if (this.allPropertiesMatTableData != undefined) {
        this.allPropertiesMatTableData.paginator = this.paginator;
        this.allPropertiesMatTableData.paginator._changePageSize(10);
      }
    } else {
      setTimeout(() => {
        if (this.allPropertiesMatTableData != undefined) {
          this.allPropertiesMatTableData.paginator = this.paginator;
          this.allPropertiesMatTableData.paginator._changePageSize(10);
        }
      });
    }
  }

  fetchData() {
    var adminReqDataSession = JSON.parse(
      sessionStorage.getItem("admin_properties_units_session")
    );
    if (adminReqDataSession != null) {
      this.allProperties = adminReqDataSession;
      this.allPropertiesMatTableData.data = adminReqDataSession;
      this.isContentLoading = false;
      this.ngAfterViewInitInitialize = true;
    } else {
      this.adminService
        .getallPropertiesUnitsAdmin()
        .subscribe((va: any[]) => {
          console.log(va);
          this.allProperties = va;
          this.allPropertiesMatTableData = new MatTableDataSource(va);
          setTimeout(() => {
            if (this.allPropertiesMatTableData != undefined) {
              this.allPropertiesMatTableData.paginator = this.paginator;
              this.allPropertiesMatTableData.paginator._changePageSize(10);
            }
          });
        })
        .add(() => {
          this.isContentLoading = false;
          if (this.allProperties.length != 0) {
            sessionStorage.setItem(
              "admin_properties_units_session",
              JSON.stringify(this.allProperties)
            );
          }
        });
      sessionStorage.setItem(
        "admin_properties_units_session_time_admin",
        JSON.stringify(new Date().getMinutes())
      );
    }
  }

  async ngOnInit() {
    var now = new Date().getMinutes();
    var previous = JSON.parse(
      sessionStorage.getItem("admin_properties_units_session_time_admin")
    );

    var adminReqDataSession = JSON.parse(
      sessionStorage.getItem("admin_properties_units_session")
    );

    if (previous != null) {
      var diff = now - Number(previous);

      if (diff >= 5) {
        sessionStorage.removeItem("admin_properties_units_session");
        this.fetchData();
      } else {
        if (adminReqDataSession != null) {
          this.allProperties = adminReqDataSession;
          this.allPropertiesMatTableData = new MatTableDataSource(
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
    this.allProperties.length = 0;
  }

  refreshTable() {
    sessionStorage.removeItem("admin_properties_units_session");
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
    this.allPropertiesMatTableData.filter = val;
  }

  addUnitDialogOpen() {
    this.dialog
      .open(AddUnitDialog, {
        width: "80%",
        height: "50rem",
      })
      .afterClosed()
      .subscribe((res) => {});
  }
}
