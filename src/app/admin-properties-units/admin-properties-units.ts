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
import { AuthenticationService } from "app/services/authentication.service";
import { UnitsService } from "app/services/units.service";
import * as XLSX from "xlsx-js-style";

import * as FileSaver from "file-saver";
import { GenerateExcelDialog } from "app/components/generate_excel/generate_excel";

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
    "size",
    "status",
    "tenant",
    "premises",
    "plot",
    "type",
    "more",
  ];

  allUnits: any[] = [];
  allUnitsMatTableData: MatTableDataSource<any>;
  ngAfterViewInitInitialize: boolean = false;

  loadingTable: any[] = [1, 2, 3, 4, 5];

  statusMenuOpened: boolean = false;
  flaggedRequest: boolean = false;

  // more_menu_unit_all_data: any = "";
  // more_menu_unit_loaded: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild("table_filter") table_filter: TableFiltersComponent;

  @ViewChild(TableSearchBarComponent) searchBar: TableSearchBarComponent;

  current_sort_option: any = "all";

  allProperties: any[] = [];
  allUsers: any[] = [];

  tableLength: number = 0;

  unitTypes: any[] = [];

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private unitService: UnitsService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    // this.isLoading = true;
    this.isContentLoading = true;

    this.getScreenSize();
    this.unitService.getallUnitTypes().subscribe((val: any[]) => {
      val.forEach((unit_type) => {
        this.unitTypes.push({
          value: unit_type.id,
          viewValue: unit_type.type,
        });
      });
    });
  }

  getUnitType(unit_type_id) {
    if (this.unitTypes.length != 0) {
      return this.unitTypes.find((type) => type.value == unit_type_id)
        .viewValue;
    } else {
      return "Loading..";
    }
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

      this.unitService
        .getallUnitsFilter(
          option,
          this.paginator.pageSize,
          this.paginator.pageIndex + 1
        )
        .subscribe((va: any) => {
          // console.log(va);
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

  fetchData(limit?) {
    if (this.searchBar != undefined) {
      this.searchBar.searchText = "";
    }
    this.unitService
      .getallPropertiesUnits(limit == undefined ? 10 : limit, 1)
      .subscribe((va: any) => {
        // console.log(va);
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
      // console.log("search");
      this.unitService
        .getallUnitsSearchPageChange(
          this.searchBar.searchText,
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
      if (this.current_sort_option != "all") {
        this.unitService
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
        this.unitService
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
      this.unitService
        .getallPropertiesUnitsSearch(
          filterValue,
          this.paginator.pageSize,
          this.paginator.pageIndex + 1
        )
        .subscribe((va: any) => {
          // console.log(va);
          this.allUnits = va.units;
          this.allUnitsMatTableData = new MatTableDataSource(va.units);
          this.tableLength = va.count;
        })
        .add(() => {
          this.pageChangerLoading = false;
        });
    } else {
      this.fetchData(this.paginator.pageSize);
    }
  }

  addUnitDialogOpen() {
    this.dialog
      .open(AddUnitDialog, {
        width: "100%",
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((res) => {
        if (res != undefined) {
          if (res.completed == true) {
            this.refreshTable();
            this.openSnackBar("New Unit added successfully", "Close");
          }
        }
      });
  }

  // openMoreMenu(unit_id) {
  //   this.more_menu_unit_all_data = "";
  //   this.unitService
  //     .getUnitAllData({ id: unit_id })
  //     .subscribe((value) => {
  //       this.more_menu_unit_all_data = value;
  //     })
  //     .add(() => {
  //       this.more_menu_unit_loaded = true;
  //     });
  // }

  openEditUnit(index, unit_id) {
    this.dialog
      .open(EditUnitDialog, {
        width: "100%",
        data: unit_id,
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
    this.router.navigate(["/property-unit-details"], {
      queryParams: { unit_id: unit.unit_id },
    });
  }

  navigateToPropertyDetailsPage(prop_id) {
    this.router.navigate(["/property-details"], {
      queryParams: { prop_id: prop_id },
    });
  }

  navigateToUserDetailsPage(user_id, auth) {
    this.router.navigate(["/user-details"], {
      queryParams: { user_id: user_id, auth: auth },
    });
  }

  exportExcelFile() {
    this.dialog
      .open(GenerateExcelDialog, {
        width: "40%",
        data: "unit",
      })
      .afterClosed()
      .subscribe((value) => {});
  }
}
