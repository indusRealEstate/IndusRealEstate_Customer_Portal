import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { AddUserDialog } from "app/components/add_user_dialog/add_user_dialog";
import { TableFiltersComponent } from "app/components/table-filters/table-filters";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";
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

  allProperties: any[] = [];
  allUnits: any[] = [];

  fetching_all_units_under_landlord: boolean = true;

  all_units_landlord: any[] = [];

  current_sort_option: any = "all";

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
  }

  screenHeight: number;
  screenWidth: number;
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  changeSortOption(option: string) {
    this.current_sort_option = option;
    if (option != "all") {
      this.allUsersMatTableData.data = this.allUsers.filter(
        (user) => user.user_type == option
      );
    } else {
      this.allUsersMatTableData.data = this.allUsers;
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
      if (this.allUsersMatTableData != undefined) {
        this.allUsersMatTableData.paginator = this.paginator;
      }
    } else {
      setTimeout(() => {
        if (this.allUsersMatTableData != undefined) {
          this.allUsersMatTableData.paginator = this.paginator;
        }
      });
    }
  }

  fetchingAllUnitsLandlord(user_id) {
    this.all_units_landlord.length = 0;
    if (this.allUnits != null) {
      var count = 0;
      this.allUnits.forEach((unit) => {
        var prop = this.allProperties.find(
          (pr) => pr.property_id == unit.property_id
        );
        if (user_id == unit.owner_id) {
          this.all_units_landlord.push({ unit: unit, prop: prop });
        }
        count++;
      });

      if (count == this.allUnits.length) {
        // setTimeout(() => {
        this.fetching_all_units_under_landlord = false;
        // }, 1000);
      }
    }
  }

  // getbuildingName(prop_id) {
  //   if (this.allProperties != null) {
  //     var property = this.allProperties.find(
  //       (prop) => prop.property_id == prop_id
  //     );
  //     if (property != undefined) {
  //       return property.property_name;
  //     } else {
  //       return "loading..";
  //     }
  //   } else {
  //     return "loading..";
  //   }
  // }

  getUnitNo(unit_id, user_type) {
    if (this.allUnits != null) {
      if (user_type == "tenant") {
        var unit = this.allUnits.find((u) => u.unit_id == unit_id);

        if (unit != undefined) {
          var prop = this.allProperties.find(
            (pr) => pr.property_id == unit.property_id
          );
          if (prop != undefined) {
            return `${unit.unit_no}, ${prop.property_name}, ${prop.address}`;
          } else {
            return "loading..";
          }
        } else {
          return "loading..";
        }
      } else {
        var all_units: any[] = JSON.parse(unit_id);
        if (all_units != undefined) {
          return `${all_units.length} ${
            all_units.length == 1 ? "Unit" : "Units"
          }`;
        } else {
          return "loading..";
        }
      }
    } else {
      return "loading..";
    }
  }

  fetchData() {
    this.adminService
      .getAllUsersAdmin()
      .subscribe((va: any[]) => {
        this.allUsers = va;
        this.allUsersMatTableData = new MatTableDataSource(va);
        setTimeout(() => {
          if (this.allUsersMatTableData != undefined) {
            this.allUsersMatTableData.paginator = this.paginator;
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
    this.current_sort_option = "all";
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
      .subscribe((res) => {
        if (res != undefined) {
          if (res.completed == true) {
            this.refreshTable();
          }
        }
      });
  }

  navigateToUnitDetailPage(unit_id, userType, user_id) {
    if (userType == "tenant") {
      this.router.navigate(["/admin-property-unit-details"], {
        queryParams: { unit_id: unit_id },
      });
    } else {
      this.fetchingAllUnitsLandlord(user_id);
    }
  }

  navigateToUnitDetailPageFromUnitsListLandlord(unit_id) {
    this.router.navigate(["/admin-property-unit-details"], {
      queryParams: { unit_id: unit_id },
    });
  }

  navigateToPropertyDetailsPage(prop_id) {
    this.router.navigate(["/property-details"], {
      queryParams: { prop_id: prop_id },
    });
  }

  viewUser(data: any) {
    this.router.navigate(["/admin-user-details"], {
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
