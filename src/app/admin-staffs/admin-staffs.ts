import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { AddPropertyDialog } from "app/components/add_property_dialog/add_property_dialog";
import { TableFiltersComponent } from "app/components/table-filters/table-filters";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";
import * as XLSX from "xlsx-js-style";

declare interface Staff {
  "STAFF NAME": string;
  ADDRESS: string;
  "PHONE NO.": string;
  "EMAIL ADDRESS": string;
  NATIONALITY: string;
  "ASSIGNED UNIT": string;
}

@Component({
  selector: "admin-staffs",
  templateUrl: "./admin-staffs.html",
  styleUrls: ["./admin-staffs.scss"],
})
export class AdminStaffs implements OnInit {
  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;

  displayedColumns: string[] = [
    // "name",
    "name",
    "address",
    "phone",
    "email",
    "nationality",
    "more",
  ];

  allStaffs: any[] = [];
  allStaffsMatTableData: MatTableDataSource<any>;
  ngAfterViewInitInitialize: boolean = false;

  loadingTable: any[] = [1, 2, 3, 4, 5];

  statusMenuOpened: boolean = false;
  flaggedRequest: boolean = false;

  more_menu_prop_all_data: any = "";
  more_menu_prop_loaded: boolean = false;

  allUnits: any[] = [];

  // userId: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild("table_filter") table_filter: TableFiltersComponent;

  pushSub: any;

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
      if (this.allStaffsMatTableData != undefined) {
        this.allStaffsMatTableData.paginator = this.paginator;
      }
    } else {
      setTimeout(() => {
        if (this.allStaffsMatTableData != undefined) {
          this.allStaffsMatTableData.paginator = this.paginator;
        }
      });
    }
  }

  fetchData() {
    var adminReqDataSession = JSON.parse(
      sessionStorage.getItem("admin_staffs_session")
    );
    if (adminReqDataSession != null) {
      this.allStaffs = adminReqDataSession;
      this.allStaffsMatTableData.data = adminReqDataSession;
      this.isContentLoading = false;
      this.ngAfterViewInitInitialize = true;
    } else {
      this.adminService
        .getallStaffsAdmin()
        .subscribe((va: any[]) => {
          this.allStaffs = va;
          this.allStaffsMatTableData = new MatTableDataSource(va);
          setTimeout(() => {
            if (this.allStaffsMatTableData != undefined) {
              this.allStaffsMatTableData.paginator = this.paginator;
            }
          });
        })
        .add(() => {
          this.isContentLoading = false;
          if (this.allStaffs.length != 0) {
            sessionStorage.setItem(
              "admin_staffs_session",
              JSON.stringify(this.allStaffs)
            );
          }
        });
      sessionStorage.setItem(
        "admin_staffs_session_time_admin",
        JSON.stringify(new Date().getMinutes())
      );
    }
  }

  async ngOnInit() {
    var now = new Date().getMinutes();
    var previous = JSON.parse(
      sessionStorage.getItem("admin_staffs_session_time_admin")
    );

    var adminReqDataSession = JSON.parse(
      sessionStorage.getItem("admin_staffs_session")
    );

    if (previous != null) {
      var diff = now - Number(previous);

      if (diff >= 5) {
        sessionStorage.removeItem("admin_staffs_session");
        this.fetchData();
      } else {
        if (adminReqDataSession != null) {
          this.allStaffs = adminReqDataSession;
          this.allStaffsMatTableData = new MatTableDataSource(
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
    this.allStaffs.length = 0;
  }

  refreshTable() {
    sessionStorage.removeItem("admin_staffs_session");
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
    this.allStaffsMatTableData.filter = val;
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

  viewStaffInfo(data: any) {
    // console.log(data)
    // this.router.navigate(["/property-details"], {
    //   queryParams: {
    //     prop_id: data.property_id,
    //   },
    // });
  }

  openEditStaff(data, index) {
    // this.dialog
    //   .open(EditPropertyDialog, {
    //     data,
    //   })
    //   .afterClosed()
    //   .subscribe((value) => {
    //     if (value != undefined) {
    //       sessionStorage.removeItem("admin_staffs_session");
    //       this.allStaffs[index].property_name =
    //         value.property_name != undefined
    //           ? value.property_name
    //           : this.allStaffs[index].property_name;
    //       this.allStaffs[index].address =
    //         value.property_address != undefined
    //           ? value.property_address
    //           : this.allStaffs[index].address;
    //       this.allStaffs[index].property_type =
    //         value.property_building_type != undefined
    //           ? value.property_building_type
    //           : this.allStaffs[index].property_type;
    //       this.allStaffs[index].locality_name =
    //         value.property_locality != undefined
    //           ? value.property_locality
    //           : this.allStaffs[index].locality_name;
    //       this.openSnackBar("Property updated successfully", "Close");
    //     }
    //   });
  }

  exportExcelFile() {
    var data: Staff[] = [];

    this.allStaffs.forEach((staff) => {
      data.push({
        "STAFF NAME": staff.name,
        ADDRESS: staff.address,
        "PHONE NO.": `${staff.countrycode} ${staff.phone}`,
        "EMAIL ADDRESS": staff.email,
        NATIONALITY: staff.nationality,
        "ASSIGNED UNIT": "",
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
    XLSX.writeFile(wb, "Total-Staffs.xlsx");
  }
}
