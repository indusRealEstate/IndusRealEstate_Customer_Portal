import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { AddPropertyDialog } from "app/components/add_property_dialog/add_property_dialog";
import { EditPropertyDialog } from "app/components/edit_property_dialog/edit_property_dialog";
import { TableSearchBarComponent } from "app/components/searchbar-table/searchbar-table";
import { AuthenticationService } from "app/services/authentication.service";
import { PropertiesService } from "app/services/properties.service";
import * as XLSX from "xlsx-js-style";

declare interface Property {
  "PROPERTY NAME": string;
  "PROPERTY ADDRESS": string;
  "PROPERTY TYPE": string;
  LOCALITY: string;
  "TOTAL UNITS": string;
  "PROPERTY IN CHARGE": string;
}

@Component({
  selector: "admin-properties",
  templateUrl: "./admin-properties.html",
  styleUrls: ["./admin-properties.scss"],
})
export class AdminProperties implements OnInit {
  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;
  pageChangerLoading: boolean = false;

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

  more_menu_prop_all_data: any = "";
  more_menu_prop_loaded: boolean = false;

  allUnits: any[] = [];

  userId: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(TableSearchBarComponent) searchBar: TableSearchBarComponent;

  tableLength: number = 0;

  pushSub: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private propertyService: PropertiesService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    // this.isLoading = true;
    this.isContentLoading = true;

    this.getScreenSize();
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    this.userId = user[0]["id"];
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

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  getPropertyType(type) {
    switch (type) {
      case "commercial":
        return "Commercial";
      case "co_living":
        return "Co-Living";
      case "co_working":
        return "Co-Working";
      case "residential":
        return "Residential";
      case "others":
        return "Others";
      default:
        return "Others";
    }
  }

  fetchData(limit?) {
    if (this.searchBar != undefined) {
      this.searchBar.searchText = "";
    }
    this.propertyService
      .getAllPropertiesPagination(limit == undefined ? 10 : limit, 1)
      .subscribe((va: any) => {
        this.allProperties = va.prop;
        this.allPropertiesMatTableData = new MatTableDataSource(va.prop);
        this.tableLength = va.count;
      })
      .add(() => {
        this.isContentLoading = false;
        this.pageChangerLoading = false;
      });
  }

  async ngOnInit() {
    this.fetchData();
  }

  clearAllVariables() {
    this.allProperties.length = 0;
  }

  refreshTable() {
    this.searchBar.searchText != "";
    this.isContentLoading = true;
    this.fetchData();
  }

  searchProperties(filterValue: any) {
    this.pageChangerLoading = true;
    if (filterValue != "") {
      this.propertyService
        .getallPropertiesSearch(
          filterValue,
          this.paginator.pageSize,
          this.paginator.pageIndex + 1
        )
        .subscribe((va: any) => {
          // console.log(va);
          this.allProperties = va.prop;
          this.allPropertiesMatTableData = new MatTableDataSource(va.prop);
          this.tableLength = va.count;
        })
        .add(() => {
          this.pageChangerLoading = false;
        });
    } else {
      this.fetchData(this.paginator.pageSize);
    }
  }

  pageChange(event) {
    this.pageChangerLoading = true;
    if (this.searchBar.searchText != "") {
      this.propertyService
        .getallPropertiesSearchPageChange(
          this.searchBar.searchText,
          event.pageSize,
          event.pageIndex + 1
        )
        .subscribe((va: any) => {
          this.allProperties = va;
          this.allPropertiesMatTableData = new MatTableDataSource(va);
        })
        .add(() => {
          this.pageChangerLoading = false;
        });
    } else {
      this.propertyService
        .getAllPropertiesPagination(event.pageSize, event.pageIndex + 1)
        .subscribe((va: any) => {
          console.log(va);
          this.allProperties = va.prop;
          this.allPropertiesMatTableData = new MatTableDataSource(va.prop);
        })
        .add(() => {
          this.pageChangerLoading = false;
        });
    }
  }

  addPropertyDialogOpen() {
    this.dialog
      .open(AddPropertyDialog)
      .afterClosed()
      .subscribe((res) => {
        if (res != undefined) {
          if (res.completed == true) {
            this.refreshTable();
            this.openSnackBar("New property added successfully", "Close");
          }
        }
      });
  }

  viewPropInfo(data: any) {
    // console.log(data)
    this.router.navigate(["/property-details"], {
      queryParams: {
        prop_id: data.property_id,
      },
    });
  }

  openMoreMenu(prop_id) {
    this.more_menu_prop_all_data = "";
    this.propertyService
      .getPropDetails(JSON.stringify({ prop_id: prop_id }))
      .subscribe((value) => {
        this.more_menu_prop_all_data = value;
      })
      .add(() => {
        this.more_menu_prop_loaded = true;
      });
  }

  openEditProperty(index) {
    if (this.more_menu_prop_all_data != undefined) {
      var data = this.more_menu_prop_all_data;
      this.dialog
        .open(EditPropertyDialog, {
          data,
        })
        .afterClosed()
        .subscribe((value) => {
          if (value != undefined) {
            this.allProperties[index].property_name =
              value.property_name != undefined
                ? value.property_name
                : this.allProperties[index].property_name;
            this.allProperties[index].address =
              value.property_address != undefined
                ? value.property_address
                : this.allProperties[index].address;
            this.allProperties[index].property_type =
              value.property_building_type != undefined
                ? value.property_building_type
                : this.allProperties[index].property_type;

            this.allProperties[index].locality_name =
              value.property_locality != undefined
                ? value.property_locality
                : this.allProperties[index].locality_name;

            this.openSnackBar("Property updated successfully", "Close");
          }
        });
    }
  }

  exportExcelFile() {
    var data: Property[] = [];

    this.allProperties.forEach((prop) => {
      data.push({
        "PROPERTY NAME": prop.property_name,
        "PROPERTY ADDRESS": prop.address,
        "PROPERTY TYPE": prop.property_type,
        LOCALITY: prop.locality_name,
        "TOTAL UNITS": "",
        "PROPERTY IN CHARGE": prop.property_in_charge,
      });
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    ws["!cols"] = [
      { wch: 30 },
      { wch: 40 },
      { wch: 30 },
      { wch: 30 },
      { wch: 35 },
      { wch: 40 },
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
    XLSX.writeFile(wb, "Total-Properties.xlsx");
  }
}
