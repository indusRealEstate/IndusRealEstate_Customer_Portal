import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { AddUnitDialog } from "app/components/add_unit_dialog/add_unit_dialog";
import { EditUnitDialog } from "app/components/edit_unit_dialog/edit_unit_dialog";
import { TableSearchBarComponent } from "app/components/searchbar-table/searchbar-table";
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

  pageChangerLoading: boolean = false;

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

  @ViewChild(TableSearchBarComponent) searchBar: TableSearchBarComponent;

  current_sort_option: any = "all";

  allProperties: any[] = [];
  allUsers: any[] = [];

  tableLength: number = 0;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private adminService: AdminService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    // this.isLoading = true;
    this.isContentLoading = true;

    this.getScreenSize();
  }

  screenHeight: number;
  screenWidth: number;
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      verticalPosition: "top",
      horizontalPosition: "right",
      duration: 3000,
    });
  }

  changeSortOption(option: string) {
    this.current_sort_option = option;
    this.searchBar.searchText = "";
    if (option != "all") {
      this.pageChangerLoading = true;

      this.adminService
        .getallUnitsFilter(
          option,
          this.paginator.pageSize,
          this.paginator.pageIndex + 1
        )
        .subscribe((va: any) => {
          console.log(va);
          this.allUnits = va.units;
          this.allUnitsMatTableData = new MatTableDataSource(va.units);
          this.tableLength = va.count;
        })
        .add(() => {
          this.pageChangerLoading = false;
        });
    } else {
      this.fetchData();
    }
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
    this.adminService
      .getallPropertiesUnits(10, 1)
      .subscribe((va: any) => {
        console.log(va);
        this.allUnits = va.units;
        this.allUnitsMatTableData = new MatTableDataSource(va.units);
        this.tableLength = va.count;
      })
      .add(() => {
        this.isContentLoading = false;
        this.pageChangerLoading = false;
      });
  }

  pageChange(event) {
    this.pageChangerLoading = true;
    if (this.searchBar.searchText != "") {
      console.log("search");
      this.adminService
        .getallUnitsSearchPageChange(
          this.searchBar.searchText,
          event.pageSize,
          event.pageIndex + 1
        )
        .subscribe((va: any) => {
          console.log(va);
          this.allUnits = va;
          this.allUnitsMatTableData = new MatTableDataSource(va);
          // this.tableLength = va.count;
        })
        .add(() => {
          this.pageChangerLoading = false;
        });
    } else {
      if (this.current_sort_option != "all") {
        this.adminService
          .getallUnitsFilterPageChange(
            this.current_sort_option,
            event.pageSize,
            event.pageIndex + 1
          )
          .subscribe((va: any) => {
            // console.log(va);
            this.allUnits = va;
            this.allUnitsMatTableData = new MatTableDataSource(va);
            // this.tableLength = va.count;
          })
          .add(() => {
            this.pageChangerLoading = false;
          });
      } else {
        this.adminService
          .getallPropertiesUnits(event.pageSize, event.pageIndex + 1)
          .subscribe((va: any) => {
            // console.log(va);
            this.allUnits = va.units;
            this.allUnitsMatTableData = new MatTableDataSource(va.units);
            // this.tableLength = va.count;
          })
          .add(() => {
            this.pageChangerLoading = false;
          });
      }
    }
  }

  // getAllData() {
  //   var propertiesDataSession = JSON.parse(
  //     sessionStorage.getItem("admin_properties_session")
  //   );

  //   if (propertiesDataSession == null) {
  //     this.adminService.getallPropertiesAdmin().subscribe((val: any[]) => {
  //       this.allProperties = val;
  //     });
  //   } else {
  //     this.allProperties = propertiesDataSession;
  //   }

  //   var usersDataSession = JSON.parse(
  //     sessionStorage.getItem("all_users_session")
  //   );

  //   if (usersDataSession == null) {
  //     this.adminService.getAllUsersAdmin().subscribe((val: any[]) => {
  //       this.allUsers = val;
  //     });
  //   } else {
  //     this.allUsers = usersDataSession;
  //   }
  // }

  async ngOnInit() {
    // this.getAllData();
    this.fetchData();
  }

  clearAllVariables() {
    this.allUnits.length = 0;
  }

  refreshTable() {
    this.current_sort_option = "all";
    this.isContentLoading = true;
    if (this.table_filter != undefined) {
      this.table_filter.flaggedRequestsFilterOn = false;
      this.table_filter.statusFilterOn = false;
      this.table_filter.timeLineFilterOn = false;
    }
    this.fetchData();
  }

  searchUnit(filterValue: any) {
    this.current_sort_option = "all";
    this.pageChangerLoading = true;
    if (filterValue != "") {
      this.adminService
        .getallPropertiesUnitsSearch(
          filterValue,
          this.paginator.pageSize,
          this.paginator.pageIndex + 1
        )
        .subscribe((va: any) => {
          console.log(va);
          this.allUnits = va.units;
          this.allUnitsMatTableData = new MatTableDataSource(va.units);
          this.tableLength = va.count;
        })
        .add(() => {
          this.pageChangerLoading = false;
        });
    } else {
      this.fetchData();
    }
  }

  addUnitDialogOpen() {
    this.dialog
      .open(AddUnitDialog, {
        width: "100%",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res != undefined) {
          if (res.completed == true) {
            this.refreshTable();
            sessionStorage.removeItem("all_users_session");
            this.openSnackBar("New Unit added successfully", "Close");
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
        width: "100%",
        data,
      })
      .afterClosed()
      .subscribe((data) => {
        if (data != undefined) {
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

          this.openSnackBar("Unit updated successfully", "Close");
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
