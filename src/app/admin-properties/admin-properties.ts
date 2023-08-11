import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { AddPropertyDialog } from "app/components/add_property_dialog/add_property_dialog";
import { TableFiltersComponent } from "app/components/table-filters/table-filters";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";

@Component({
  selector: "admin-properties",
  templateUrl: "./admin-properties.html",
  styleUrls: ["./admin-properties.scss"],
})
export class AdminProperties implements OnInit {
  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;

  displayedColumns: string[] = [
    // "name",
    "propertyName",
    "address",
    "propertyType",
    "locality",
    "govPropertyId",
    "more",
  ];

  allProperties: any[] = [];
  allPropertiesMatTableData: MatTableDataSource<any>;
  ngAfterViewInitInitialize: boolean = false;

  loadingTable: any[] = [1, 2, 3, 4, 5];

  statusMenuOpened: boolean = false;
  flaggedRequest: boolean = false;

  userId: any;

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

    this.userId = user[0]["id"];

    this.route.queryParams.subscribe((e) => {
      if (e == null) {
        router.navigate([`/admin-properties`], {
          queryParams: { uid: user[0]["id"] },
        });
      } else if (e != user[0]["id"]) {
        router.navigate([`/admin-properties`], {
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
      }
    } else {
      setTimeout(() => {
        if (this.allPropertiesMatTableData != undefined) {
          this.allPropertiesMatTableData.paginator = this.paginator;
        }
      });
    }
  }

  fetchData() {
    var adminReqDataSession = JSON.parse(
      sessionStorage.getItem("admin_properties_session")
    );
    if (adminReqDataSession != null) {
      this.allProperties = adminReqDataSession;
      this.allPropertiesMatTableData.data = adminReqDataSession;
      this.isContentLoading = false;
      this.ngAfterViewInitInitialize = true;
    } else {
      this.adminService
        .getallPropertiesAdmin()
        .subscribe((va: any[]) => {
          console.log(va);
          this.allProperties = va;
          this.allPropertiesMatTableData = new MatTableDataSource(va);
          setTimeout(() => {
            if (this.allPropertiesMatTableData != undefined) {
              this.allPropertiesMatTableData.paginator = this.paginator;
            }
          });
        })
        .add(() => {
          this.isContentLoading = false;
          if (this.allProperties.length != 0) {
            sessionStorage.setItem(
              "admin_properties_session",
              JSON.stringify(this.allProperties)
            );
          }
        });
      sessionStorage.setItem(
        "admin_properties_session_time_admin",
        JSON.stringify(new Date().getMinutes())
      );
    }
  }

  async ngOnInit() {
    var now = new Date().getMinutes();
    var previous = JSON.parse(
      sessionStorage.getItem("admin_properties_session_time_admin")
    );

    var adminReqDataSession = JSON.parse(
      sessionStorage.getItem("admin_properties_session")
    );

    if (previous != null) {
      var diff = now - Number(previous);

      if (diff >= 5) {
        sessionStorage.removeItem("admin_properties_session");
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
    sessionStorage.removeItem("admin_properties_session");
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

  addPropertyDialogOpen() {
    this.dialog
      .open(AddPropertyDialog, {
        width: "75%",
        height: "43rem",
      })
      .afterClosed()
      .subscribe((res) => {});
  }

  viewPropInfo(data: any) {
    // console.log(data)
    this.router.navigate(["/property-details"], {
      queryParams: {
        prop_id: data.property_id,
      },
    });
  }
}
