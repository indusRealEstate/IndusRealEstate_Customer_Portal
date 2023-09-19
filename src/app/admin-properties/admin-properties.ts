import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { AddPropertyDialog } from "app/components/add_property_dialog/add_property_dialog";
import { CautionDialog } from "app/components/caution-dialog/caution-dialog";
import { EditPropertyDialog } from "app/components/edit_property_dialog/edit_property_dialog";
import { GenerateExcelDialog } from "app/components/generate_excel/generate_excel";
import { TableSearchBarComponent } from "app/components/searchbar-table/searchbar-table";
import { AuthenticationService } from "app/services/authentication.service";
import { PropertiesService } from "app/services/properties.service";

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

  // more_menu_prop_all_data: any = "";
  // more_menu_prop_loaded: boolean = false;

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

  deleteProperty(prop_id: any) {
    var data = {
      title: "Delete Property?",
      subtitle:
        "Are you sure you want to delete this property? You can't undo this action.",
      warning:
        "By deleting this property, all the documents and images uploaded will be lost.",
      delete_text: "Delete Property",
    };
    this.dialog
      .open(CautionDialog, {
        width: "45%",
        data,
      })
      .afterClosed()
      .subscribe((value) => {
        if (value != undefined) {
          if (value == true) {
            this.propertyService
              .deleteProperty(prop_id)
              .subscribe((res) => {
                console.log(res);
              })
              .add(() => {
                this.refreshTable();
                this.openSnackBar("Property deleted successfully", "Close");
              });
          }
        }
      });
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

  // openMoreMenu(prop_id) {
  //   this.more_menu_prop_all_data = "";
  //   this.propertyService
  //     .getPropDetails(JSON.stringify({ prop_id: prop_id }))
  //     .subscribe((value) => {
  //       this.more_menu_prop_all_data = value;
  //     })
  //     .add(() => {
  //       this.more_menu_prop_loaded = true;
  //     });
  // }

  openEditProperty(index, prop_id) {
    // if (this.more_menu_prop_all_data != undefined) {
    //   var data = this.more_menu_prop_all_data;
    this.dialog
      .open(EditPropertyDialog, {
        width: "100%",
        data: prop_id,
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
    // }
  }

  exportExcelFile() {
    this.dialog
      .open(GenerateExcelDialog, {
        width: "40%",
        data: "property",
      })
      .afterClosed()
      .subscribe((value) => {});
  }
}
