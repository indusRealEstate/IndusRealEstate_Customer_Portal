import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { AddLeaseDialog } from "app/components/add_lease_dialog/add_lease_dialog";
import { CautionDialog } from "app/components/caution-dialog/caution-dialog";
import { EditLeaseDialog } from "app/components/edit_lease_dialog/edit_lease_dialog";
import { TableSearchBarComponent } from "app/components/searchbar-table/searchbar-table";
import { AuthenticationService } from "app/services/authentication.service";
import { LeaseService } from "app/services/lease.service";
import * as XLSX from "xlsx-js-style";

declare interface Lease {
  UNIT: number;
  "TYPE OF APARTMENT": string;
  "AREA (SQ/FT)": string;
  TENANT: string;
  "PHONE NO": string;
  "EMAIL ID": string;
  "CONTRACT START": string;
  "CONTRACT END": string;
  "CONTRACT PERIOD (MONTHS)": string;
  "CONTRACT VALUE (AED)": string;
  "NO. OF CHEQUES": string;
  "SECURITY DEPOSIT (AED)": string;
}

@Component({
  selector: "admin-lease",
  templateUrl: "./admin-lease.html",
  styleUrls: ["./admin-lease.scss"],
})
export class AllLeasesComponent implements OnInit {
  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;

  displayedColumns: string[] = [
    // "name",
    "contractId",
    "buliding",
    "unitNo",
    "status",
    "leaseExpiry",
    "owner",
    "tenant",
    "moveIn",
    "moveOut",
    "contractStartDate",
    "contractEndDate",
    "deposit",
    "rentAmount",
    "more",
  ];

  allLease: any[] = [];
  allLeaseMatTableData: MatTableDataSource<any>;
  ngAfterViewInitInitialize: boolean = false;

  loadingTable: any[] = [1, 2, 3, 4, 5];

  statusMenuOpened: boolean = false;
  flaggedRequest: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  current_sort_option: any = "all";

  more_menu_lease_all_data: any = "";
  more_menu_lease_loaded: boolean = false;

  pageChangerLoading: boolean = false;
  @ViewChild(TableSearchBarComponent) searchBar: TableSearchBarComponent;

  tableLength: number = 0;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private leaseService: LeaseService,
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

      this.leaseService
        .getallContractsFilter(
          option,
          this.paginator.pageSize,
          this.paginator.pageIndex + 1
        )
        .subscribe((va: any) => {
          // console.log(va);
          this.allLease = va.lease;
          this.allLeaseMatTableData = new MatTableDataSource(va.lease);
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

  ngAfterViewInit() {
    if (this.ngAfterViewInitInitialize == true) {
      if (this.allLeaseMatTableData != undefined) {
        this.allLeaseMatTableData.paginator = this.paginator;
      }
    } else {
      setTimeout(() => {
        if (this.allLeaseMatTableData != undefined) {
          this.allLeaseMatTableData.paginator = this.paginator;
        }
      });
    }
  }

  getLeaseExpiry(end: any) {
    var start_date = new Date();
    var end_date = new Date(end);

    var difference_In_Time = end_date.getTime() - start_date.getTime();

    var difference_In_Days = difference_In_Time / (1000 * 3600 * 24);

    return `${Math.round(difference_In_Days)} Days left`;
  }

  fetchData(limit?) {
    if (this.searchBar != undefined) {
      this.searchBar.searchText = "";
    }
    this.leaseService
      .getAllContractsAdminPagination(limit == undefined ? 10 : limit, 1)
      .subscribe((va: any) => {
        // console.log(va);
        this.allLease = va.lease;
        this.allLeaseMatTableData = new MatTableDataSource(va.lease);
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
      this.leaseService
        .getallContractsSearchPageChange(
          this.searchBar.searchText,
          event.pageSize,
          event.pageIndex + 1
        )
        .subscribe((va: any) => {
          this.allLease = va;
          this.allLeaseMatTableData = new MatTableDataSource(va);
        })
        .add(() => {
          this.pageChangerLoading = false;
        });
    } else {
      if (this.current_sort_option != "all") {
        this.leaseService
          .getallContractsFilterPageChange(
            this.current_sort_option,
            event.pageSize,
            event.pageIndex + 1
          )
          .subscribe((va: any) => {
            // console.log(va);
            this.allLease = va;
            this.allLeaseMatTableData = new MatTableDataSource(va);
            // this.tableLength = va.count;
          })
          .add(() => {
            this.pageChangerLoading = false;
          });
      } else {
        this.leaseService
          .getAllContractsAdminPagination(event.pageSize, event.pageIndex + 1)
          .subscribe((va: any) => {
            console.log(va);
            this.allLease = va.lease;
            this.allLeaseMatTableData = new MatTableDataSource(va.lease);
          })
          .add(() => {
            this.pageChangerLoading = false;
          });
      }
    }
  }

  async ngOnInit() {
    this.fetchData();
  }

  clearAllVariables() {
    this.allLease.length = 0;
  }

  refreshTable() {
    this.current_sort_option = "all";
    this.isContentLoading = true;

    this.fetchData();
  }

  searchContracts(filterValue: any) {
    this.current_sort_option = "all";
    this.pageChangerLoading = true;
    if (filterValue != "") {
      this.leaseService
        .getallContractsSearch(
          filterValue,
          this.paginator.pageSize,
          this.paginator.pageIndex + 1
        )
        .subscribe((va: any) => {
          // console.log(va);
          this.allLease = va.lease;
          this.allLeaseMatTableData = new MatTableDataSource(va.lease);
          this.tableLength = va.count;
        })
        .add(() => {
          this.pageChangerLoading = false;
        });
    } else {
      this.fetchData(this.paginator.pageSize);
    }
  }

  addLeaseDialogOpen() {
    this.dialog
      .open(AddLeaseDialog, {
        width: "90%",
        height: "auto",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res != undefined) {
          if (res.completed == true) {
            this.refreshTable();
            this.openSnackBar("New Lease added successfully", "Close");
          }
        }
      });
  }

  openMoreMenu(lease_id) {
    this.more_menu_lease_all_data = "";
    this.leaseService
      .getAllLeaseData({ id: lease_id })
      .subscribe((value) => {
        this.more_menu_lease_all_data = value;
      })
      .add(() => {
        this.more_menu_lease_loaded = true;
      });
  }

  openEditLease(index) {
    if (this.more_menu_lease_all_data != undefined) {
      var data = this.more_menu_lease_all_data;
      this.dialog
        .open(EditLeaseDialog, {
          data,
        })
        .afterClosed()
        .subscribe((value) => {
          if (value != undefined) {
            this.updateData(value, index);
          }
        });
    }
  }

  openCautionDialog(lease_id, unit_id, tenant_id) {
    var data = {
      title: "Terminate contract?",
      subtitle:
        "Are you sure you want to terminate this contract? You can't undo this action.",
      warning:
        "By terminating this agreement, Unit will be designated as empty and current tenant's lease would be revoked.",
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
            this.terminateLease(lease_id, unit_id, tenant_id);
            this.refreshTable();
            this.openSnackBar("Lease terminated successfully", "Close");
          }
        }
      });
  }

  terminateLease(lease_id, unit_id, tenant_id) {
    this.leaseService
      .terminateLease(
        JSON.stringify({
          lease_id: lease_id,
          unit_id: unit_id,
          tenant_id: tenant_id,
        })
      )
      .subscribe((res) => {
        console.log(res);
      });
  }

  updateData(data, index) {
    var updated_data = data.data;

    this.allLease[index].contract_end = updated_data.contract_end;
    this.allLease[index].move_in = updated_data.move_in;
    this.allLease[index].move_out = updated_data.move_out;
    this.allLease[index].contract_start = updated_data.contract_start;
    this.allLease[index].security_deposit = updated_data.security_deposit;
    this.allLease[index].rent_amount = updated_data.rent_amount;

    this.openSnackBar("Lease updated successfully", "Close");
  }

  navigateToPropertyDetailsPage(prop_id) {
    this.router.navigate(["/property-details"], {
      queryParams: { prop_id: prop_id },
    });
  }

  navigateToUnitDetailPage(unit_id) {
    this.router.navigate(["/admin-property-unit-details"], {
      queryParams: { unit_id: unit_id },
    });
  }

  navigateToUserDetailsPage(user_id) {
    this.router.navigate(["/admin-user-details"], {
      queryParams: { user_id: user_id },
    });
  }

  viewDetails(data: string) {
    this.router.navigate(["/admin-lease-details"], {
      queryParams: { contact_id: data },
    });
  }

  exportExcelFile() {
    var data: Lease[] = [];

    this.allLease.forEach((lease) => {
      var unit = "";
      var tenant = "";
      data.push({
        UNIT: 0,
        "TYPE OF APARTMENT": "",
        "AREA (SQ/FT)": "",
        TENANT: "",
        "PHONE NO": "",
        "EMAIL ID": "",
        "CONTRACT START": lease.contract_start,
        "CONTRACT END": lease.contract_end,
        "CONTRACT PERIOD (MONTHS)": "12",
        "CONTRACT VALUE (AED)": lease.yearly_amount,
        "NO. OF CHEQUES": lease.no_of_cheques,
        "SECURITY DEPOSIT (AED)": lease.security_deposit,
      });
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    ws["!cols"] = [
      { wch: 15 },
      { wch: 30 },
      { wch: 25 },
      { wch: 25 },
      { wch: 25 },
      { wch: 30 },
      { wch: 30 },
      { wch: 40 },
      { wch: 40 },
      { wch: 30 },
      { wch: 35 },
      { wch: 35 },
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
    XLSX.writeFile(wb, "Total-Lease-Contracts.xlsx");
  }
}
