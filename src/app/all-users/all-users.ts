import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { AddUserDialog } from "app/components/add_user_dialog/add_user_dialog";
import { CautionDialog } from "app/components/caution-dialog/caution-dialog";
import { EditUserDialog } from "app/components/edit_user_dialog/edit_user_dialog";
import { GenerateExcelDialog } from "app/components/generate_excel/generate_excel";
import { TableSearchBarComponent } from "app/components/searchbar-table/searchbar-table";
import { ViewCreatedUserDetailsDialog } from "app/components/view-created-user-details-dialog/view-created-user-details-dialog";
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

  current_sort_option: any = "all";

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(TableSearchBarComponent) searchBar: TableSearchBarComponent;

  tableLength: number = 0;

  constructor(
    private router: Router,
    private rout: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    // this.isLoading = true;
    this.isContentLoading = true;

    this.getScreenSize();

    authenticationService.validateToken().subscribe((res) => {
      if (res != "not-expired") {
        authenticationService.logout();
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

  viewCreatedDetails(user) {
    this.dialog
      .open(ViewCreatedUserDetailsDialog, {
        width: "50%",
        data: {
          details: user,
          type: "user",
        },
      })
      .afterClosed()
      .subscribe((res) => {});
    // console.log(prop);
  }

  deleteUser(user_id: any) {
    var data = {
      title: "Delete User?",
      subtitle:
        "Are you sure you want to delete this user? You can't undo this action.",
      warning:
        "By deleting this user, all the documents and images uploaded will be lost.",
      delete_text: "Delete User",
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
            this.userService
              .deleteUser(user_id)
              .subscribe((res) => {
                console.log(res);
              })
              .add(() => {
                this.refreshTable();
                this.openSnackBar("User deleted successfully", "Close");
              });
          }
        }
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.rout.queryParams.subscribe((q) => {
        if (q.type != undefined) {
          this.changeSortOption(q.type);
        }
      });
    }, 500);
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
      this.pageChangerLoading = true;
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

  emailUser(email) {
    location.href =
      "mailto:" +
      email +
      "?cc=" +
      "sample@sdsd.ae" +
      "&subject=" +
      "test" +
      "&body=" +
      "hi";
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

  editUserDialogOpen(index, user_id) {
    this.dialog
      .open(EditUserDialog, {
        data: user_id,
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
    this.dialog
      .open(GenerateExcelDialog, {
        width: "40%",
        data: "user",
      })
      .afterClosed()
      .subscribe((value) => {});
  }
}
