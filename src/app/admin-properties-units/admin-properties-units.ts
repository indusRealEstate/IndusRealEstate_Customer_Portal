import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { AddUnitDialog } from "app/components/add_unit_dialog/add_unit_dialog";
import { EditUnitDialog } from "app/components/edit_unit_dialog/edit_unit_dialog";
import { TableFiltersComponent } from "app/components/table-filters/table-filters";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";
import * as XLSX from "xlsx-js-style";

declare interface Unit {
  "UNIT No.": number;
  "UNIT TYPE": string;
  BUILDING: string;
  FLOORS: string;
  "UNIT SIZE": string;
  "OCCUPANCY STATUS": string;
  OWNER: string;
  TENANT: string;
  BEDROOMS: number;
  BATHROOMS: number;
  PARKING: number;
}

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

  allUnits: any[] = [];
  allUnitsMatTableData: MatTableDataSource<any>;
  ngAfterViewInitInitialize: boolean = false;

  loadingTable: any[] = [1, 2, 3, 4, 5];

  statusMenuOpened: boolean = false;
  flaggedRequest: boolean = false;

  more_menu_unit_all_data: any = "";
  more_menu_unit_loaded: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild("table_filter") table_filter: TableFiltersComponent;

  allProperties: any[] = [];
  allUsers: any[] = [];

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
      if (this.allUnitsMatTableData != undefined) {
        this.allUnitsMatTableData.paginator = this.paginator;
      }
    } else {
      setTimeout(() => {
        if (this.allUnitsMatTableData != undefined) {
          this.allUnitsMatTableData.paginator = this.paginator;
        }
      });
    }
  }

  fetchData() {
    var adminReqDataSession = JSON.parse(
      sessionStorage.getItem("admin_properties_units_session")
    );
    if (adminReqDataSession != null) {
      this.allUnits = adminReqDataSession;
      this.allUnitsMatTableData.data = adminReqDataSession;
      this.isContentLoading = false;
      this.ngAfterViewInitInitialize = true;
    } else {
      this.adminService
        .getallPropertiesUnitsAdmin()
        .subscribe((va: any[]) => {
          this.allUnits = va;
          this.allUnitsMatTableData = new MatTableDataSource(va);
          setTimeout(() => {
            if (this.allUnitsMatTableData != undefined) {
              this.allUnitsMatTableData.paginator = this.paginator;
            }
          });
        })
        .add(() => {
          this.isContentLoading = false;
          if (this.allUnits.length != 0) {
            sessionStorage.setItem(
              "admin_properties_units_session",
              JSON.stringify(this.allUnits)
            );
          }
        });
      sessionStorage.setItem(
        "admin_properties_units_session_time_admin",
        JSON.stringify(new Date().getMinutes())
      );
    }
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
          this.allUnits = adminReqDataSession;
          this.allUnitsMatTableData = new MatTableDataSource(
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
    this.allUnits.length = 0;
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
    this.allUnitsMatTableData.filter = val;
  }

  addUnitDialogOpen() {
    this.dialog
      .open(AddUnitDialog, {
        width: "80%",
        height: "55rem",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res != undefined) {
          if (res.completed == true) {
            this.refreshTable();
            sessionStorage.removeItem("all_users_session");
          }
        }
      });
  }

  openMoreMenu(unit_id) {
    this.more_menu_unit_all_data = "";
    this.adminService
      .getUnitAllData({ id: unit_id })
      .subscribe((value) => {
        this.more_menu_unit_all_data = value;
      })
      .add(() => {
        this.more_menu_unit_loaded = true;
      });
  }

  openEditUnit(index) {
    var data = this.more_menu_unit_all_data;
    this.dialog
      .open(EditUnitDialog, {
        data,
      })
      .afterClosed()
      .subscribe((data) => {
        if (data != undefined) {
          sessionStorage.removeItem("admin_properties_units_session");
          this.allUnits[index].unit_no =
            data.unit_no != undefined
              ? data.unit_no
              : this.allUnits[index].unit_no;
          this.allUnits[index].property_id =
            data.property_id != undefined
              ? data.property_id
              : this.allUnits[index].property_id;
          this.allUnits[index].property_name =
            data.property_name != undefined
              ? data.property_name
              : this.allUnits[index].property_name;
          this.allUnits[index].floor =
            data.floor != undefined ? data.floor : this.allUnits[index].floor;
          this.allUnits[index].size =
            data.size != undefined ? data.size : this.allUnits[index].size;
          this.allUnits[index].owner_id =
            data.owner_id != undefined
              ? data.owner_id
              : this.allUnits[index].owner_id;
          this.allUnits[index].owner =
            data.owner != undefined ? data.owner : this.allUnits[index].owner;
          this.allUnits[index].bedroom =
            data.bedroom != undefined
              ? data.bedroom
              : this.allUnits[index].bedroom;
          this.allUnits[index].bathroom =
            data.bathroom != undefined
              ? data.bathroom
              : this.allUnits[index].bathroom;
        }
      });
  }

  navigateToDetailPage(unit) {
    this.router.navigate(["/admin-property-unit-details"], {
      queryParams: { unit_id: unit.unit_id },
    });
  }

  navigateToPropertyDetailsPage(prop_id) {
    this.router.navigate(["/property-details"], {
      queryParams: { prop_id: prop_id },
    });
  }

  navigateToUserDetailsPage(user_id) {
    this.router.navigate(["/admin-user-details"], {
      queryParams: { user_id: user_id },
    });
  }

  exportExcelFile() {
    var data: Unit[] = [];

    this.allUnits.forEach((unit) => {
      var property = this.allProperties.find(
        (prop) => prop.property_id == unit.property_id
      );
      data.push({
        "UNIT No.": unit.unit_no,
        "UNIT TYPE": unit.unit_type,
        BUILDING: property.property_name,
        FLOORS: unit.floor,
        "UNIT SIZE": `${unit.size} SqFt`,
        "OCCUPANCY STATUS": unit.status,
        OWNER: unit.owner,
        TENANT:
          unit.tenant_id != ""
            ? this.allUsers.find((user) => user.user_id == unit.tenant_id).name
            : "-",
        BEDROOMS: unit.bedroom,
        BATHROOMS: unit.bathroom,
        PARKING: unit.no_of_parking,
      });
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    ws["!cols"] = [
      { wch: 30 },
      { wch: 40 },
      { wch: 35 },
      { wch: 30 },
      { wch: 35 },
      { wch: 40 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
    ];

    ws["!rows"] = [{ hpt: 30 }];

    for (var i in ws) {
      // console.log(ws[i]);
      if (typeof ws[i] != "object") continue;
      let cell = XLSX.utils.decode_cell(i);

      ws[i].s = {
        // styling for all cells
        font: {
          name: "arial",
        },
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: "1", // any truthy value here
        },
        border: {
          right: {
            style: "thin",
            color: "000000",
          },
          left: {
            style: "thin",
            color: "000000",
          },
        },
      };

      if (cell.r == 0) {
        // first row
        ws[i].s = {
          font: {
            name: "Calibri",
            sz: "14",
            bold: true,
          },
          border: {
            bottom: {
              style: "thin",
              color: "000000",
            },
          },
          fill: { fgColor: { rgb: "f8e7b4" } },
          alignment: {
            vertical: "center",
            horizontal: "center",
            wrapText: "1", // any truthy value here
          },
        };
      }

      if (cell.r % 2) {
        // every other row
        ws[i].s.fill = {
          // background color
          patternType: "solid",
          fgColor: { rgb: "fef7e3" },
          bgColor: { rgb: "fef7e3" },
        };
      }
    }

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "Total-Units.xlsx");
  }
}
