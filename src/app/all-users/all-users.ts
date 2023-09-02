import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { AddUserDialog } from "app/components/add_user_dialog/add_user_dialog";
import { EditUserDialog } from "app/components/edit_user_dialog/edit_user_dialog";
import { TableSearchBarComponent } from "app/components/searchbar-table/searchbar-table";
import { AuthenticationService } from "app/services/authentication.service";
import { UserService } from "app/services/user.service";
import * as XLSX from "xlsx-js-style";

declare interface User {
  NAME: string;
  "MOBILE No.": string;
  "ALTERNATIVE MOBILE No.": string;
  "USER TYPE": string;
  EMAIL: string;
  "ALTERNATIVE EMAIL": string;
  "ID TYPE": string;
  "ID NUMBER": string;
  "DATE OF BIRTH": string;
  NATIONALITY: string;
  GENDER: string;
  "ALLOCATED UNIT": string;
}

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
    "more",
  ];

  allUsers: any[] = [];
  allUsersMatTableData: MatTableDataSource<any>;
  ngAfterViewInitInitialize: boolean = false;

  loadingTable: any[] = [1, 2, 3, 4, 5];

  statusMenuOpened: boolean = false;
  flaggedRequest: boolean = false;

  pageChangerLoading: boolean = false;

  allProperties: any[] = [];
  allUnits: any[] = [];

  all_units_landlord: any[] = [];
  more_menu_user_all_data: any = "";
  more_menu_user_loaded: boolean = false;

  current_sort_option: any = "all";

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(TableSearchBarComponent) searchBar: TableSearchBarComponent;

  tableLength: number = 0;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
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

      this.userService
        .getallUsersFilter(
          option,
          this.paginator.pageSize,
          this.paginator.pageIndex + 1
        )
        .subscribe((va: any) => {
          // console.log(va);
          this.allUsers = va.users;
          this.allUsersMatTableData = new MatTableDataSource(va.users);
          this.tableLength = va.count;
        })
        .add(() => {
          this.pageChangerLoading = false;
        });
    } else {
      this.fetchData(this.paginator.pageSize);
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
    this.userService
      .getAllUsersAdminPagination(limit == undefined ? 10 : limit, 1)
      .subscribe((va: any) => {
        // console.log(va);
        this.allUsers = va.users;
        this.allUsersMatTableData = new MatTableDataSource(va.users);
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
      this.userService
        .getallUsersSearchPageChange(
          this.searchBar.searchText,
          event.pageSize,
          event.pageIndex + 1
        )
        .subscribe((va: any) => {
          this.allUsers = va;
          this.allUsersMatTableData = new MatTableDataSource(va);
        })
        .add(() => {
          this.pageChangerLoading = false;
        });
    } else {
      if (this.current_sort_option != "all") {
        this.userService
          .getallUsersFilterPageChange(
            this.current_sort_option,
            event.pageSize,
            event.pageIndex + 1
          )
          .subscribe((va: any) => {
            // console.log(va);
            this.allUsers = va;
            this.allUsersMatTableData = new MatTableDataSource(va);
            // this.tableLength = va.count;
          })
          .add(() => {
            this.pageChangerLoading = false;
          });
      } else {
        this.userService
          .getAllUsersAdminPagination(event.pageSize, event.pageIndex + 1)
          .subscribe((va: any) => {
            console.log(va);
            this.allUsers = va.users;
            this.allUsersMatTableData = new MatTableDataSource(va.users);
          })
          .add(() => {
            this.pageChangerLoading = false;
          });
      }
    }
  }

  getPropertyAddresses(unit_raw, userType) {
    if (userType == "tenant") {
      return JSON.parse(unit_raw)["address"];
    } else {
      return `${JSON.parse(unit_raw).length} Units`;
    }
  }

  async ngOnInit() {
    this.fetchData();
  }

  clearAllVariables() {
    this.allUsers.length = 0;
  }

  refreshTable() {
    this.searchBar.searchText = "";
    this.current_sort_option = "all";
    this.isContentLoading = true;
    this.fetchData();
  }

  searchUsers(filterValue: any) {
    this.current_sort_option = "all";
    this.pageChangerLoading = true;
    if (filterValue != "") {
      this.userService
        .getallUsersSearch(
          filterValue,
          this.paginator.pageSize,
          this.paginator.pageIndex + 1
        )
        .subscribe((va: any) => {
          // console.log(va);
          this.allUsers = va.users;
          this.allUsersMatTableData = new MatTableDataSource(va.users);
          this.tableLength = va.count;
        })
        .add(() => {
          this.pageChangerLoading = false;
        });
    } else {
      this.fetchData(this.paginator.pageSize);
    }
  }

  addUserDialogOpen() {
    this.dialog
      .open(AddUserDialog, {
        width: "75%",
        height: "50rem",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res != undefined) {
          if (res.completed == true) {
            this.refreshTable();
            this.openSnackBar("New User added successfully", "Close");
          }
        }
      });
  }

  openMoreMenu(user_id) {
    this.more_menu_user_all_data = "";
    this.userService
      .getUserDetailsForEdit({ user_id: user_id })
      .subscribe((res) => {
        this.more_menu_user_all_data = res;
      })
      .add(() => {
        this.more_menu_user_loaded = true;
      });
  }

  editUserDialogOpen(index) {
    this.dialog
      .open(EditUserDialog, {
        data: this.more_menu_user_all_data,
        width: "75%",
        height: "50rem",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res != undefined) {
          this.updateData(res, index);
        }
      });
  }

  updateData(data, index) {
    if (data.data != undefined) {
      var updated_data = data.data;
      console.log(updated_data);

      this.allUsers[index].name = updated_data.name;
      this.allUsers[index].country_code_number =
        updated_data.country_code_number;
      this.allUsers[index].mobile_number = updated_data.mobile_number;
      this.allUsers[index].email = updated_data.email;
      this.allUsers[index].id_type = updated_data.id_type;
      this.allUsers[index].id_number = updated_data.id_number;
      this.allUsers[index].nationality = updated_data.nationality;
      this.allUsers[index].dob = updated_data.dob;
    }
    this.openSnackBar("User updated successfully", "Close");
  }

  navigateToUnitDetailPage(unit_raw, userType, user_id) {
    if (userType == "tenant") {
      this.router.navigate(["/property-unit-details"], {
        queryParams: { unit_id: JSON.parse(unit_raw)["id"] },
      });
    } else {
      this.all_units_landlord = JSON.parse(unit_raw);
    }
  }

  navigateToUnitDetailPageFromUnitsListLandlord(unit_id) {
    this.router.navigate(["/property-unit-details"], {
      queryParams: { unit_id: unit_id },
    });
  }

  navigateToPropertyDetailsPage(prop_id) {
    this.router.navigate(["/property-details"], {
      queryParams: { prop_id: prop_id },
    });
  }

  viewUser(data: any) {
    this.router.navigate(["/user-details"], {
      queryParams: {
        user_id: data.user_id,
        auth: data.user_type,
      },
    });
  }

  getArrayUnits(units: any[]) {
    var all_units = "";

    units.forEach((u) => {
      all_units = all_units + "   " + u;
    });

    return all_units;
  }

  exportExcelFile() {
    var data: User[] = [];

    this.allUsers.forEach((user) => {
      var units_val: any[] = [];
      var unit_val: any = "";

      if (user.user_type == "owner") {
        var arr: any[] = JSON.parse(user.allocated_unit);
        arr.forEach((a) => {
          var unit = this.allUnits.find((unit) => unit.unit_id == a);
          if (unit != undefined) {
            console.log(unit);
            var building = this.allProperties.find(
              (prop) => prop.property_id == unit.property_id
            );

            if (building != undefined) {
              console.log(building);
              units_val.push(
                `${unit.unit_no} - ${building.property_name}, ${building.address}`
              );
            }
          }
        });
      } else if (user.user_type == "tenant") {
        var unit = this.allUnits.find(
          (unit) => unit.unit_id == user.allocated_unit
        );
        if (unit != undefined) {
          var building = this.allProperties.find(
            (prop) => prop.property_id == unit.property_id
          );
          unit_val = `${unit.unit_no} - ${building.property_name}, ${building.address}`;
        }
      }

      data.push({
        NAME: user.name,
        "MOBILE No.": `${user.country_code_number} ${user.mobile_number}`,
        "ALTERNATIVE MOBILE No.":
          user.alternative_mobile_number != ""
            ? `${user.country_code_alternative_number} ${user.alternative_mobile_number}`
            : "-",
        "USER TYPE": user.user_type,
        EMAIL: user.email,
        "ALTERNATIVE EMAIL":
          user.alternative_email != "" ? user.alternative_email : "-",
        "ID TYPE": user.id_type,
        "ID NUMBER": user.id_number,
        "DATE OF BIRTH": user.dob,
        NATIONALITY: user.nationality,
        GENDER: user.gender,
        "ALLOCATED UNIT":
          user.allocated_unit != ""
            ? user.user_type == "owner"
              ? this.getArrayUnits(units_val)
              : unit_val
            : "-",
      });
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    ws["!cols"] = [
      { wch: 30 },
      { wch: 35 },
      { wch: 50 },
      { wch: 30 },
      { wch: 25 },
      { wch: 40 },
      { wch: 30 },
      { wch: 30 },
      { wch: 40 },
      { wch: 35 },
      { wch: 25 },
      { wch: 40 },
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
    XLSX.writeFile(wb, "Total-Users.xlsx");
  }
}
