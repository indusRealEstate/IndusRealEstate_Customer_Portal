import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { AddLeaseDialog } from "app/components/add_lease_dialog/add_lease_dialog";
import { CautionDialog } from "app/components/caution-dialog/caution-dialog";
import { EditLeaseDialog } from "app/components/edit_lease_dialog/edit_lease_dialog";
import { GenerateExcelDialog } from "app/components/generate_excel/generate_excel";
import { ReniewContractDialog } from "app/components/reniew-contract-dialog/reniew-contract-dialog";
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
    // "moveIn",
    // "moveOut",
    "contractStartDate",
    "contractEndDate",
    "rentYearly",
    "deposit",
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

  pageChangerLoading: boolean = false;
  @ViewChild(TableSearchBarComponent) searchBar: TableSearchBarComponent;

  tableLength: number = 0;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private leaseService: LeaseService,
    private _snackBar: MatSnackBar,
    private rout: ActivatedRoute,
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

  ngAfterViewInit() {
    setTimeout(() => {
      this.rout.queryParams.subscribe((q) => {
        if (q.type != undefined) {
          this.changeSortOption(q.type);
        }
      });
    }, 800);
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

  getLeaseExpiry(end: any) {
    var start_date = new Date();
    var end_date = new Date(end);

    var difference_In_Time = end_date.getTime() - start_date.getTime();

    var difference_In_Days = difference_In_Time / (1000 * 3600 * 24);

    if (difference_In_Days < 0) {
      return `Expired ${Math.round(Math.abs(difference_In_Days))} days ago.`;
    } else {
      return `${Math.round(difference_In_Days)} Days left`;
    }
  }

  getLeaseExpiryStyleClass(end: any) {
    var start_date = new Date();
    var end_date = new Date(end);

    var difference_In_Time = end_date.getTime() - start_date.getTime();

    var difference_In_Days = difference_In_Time / (1000 * 3600 * 24);

    if (difference_In_Days < 0) {
      return "lease-expired-date";
    } else {
      return "lease-expiry-date";
    }
  }

  reniewContract(contract_id) {
    this.dialog
      .open(ReniewContractDialog, {
        width: "70%",
        data: contract_id,
        //height: "40rem",
      })
      .afterClosed()
      .subscribe((res) => {});
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

  // openMoreMenu(lease_id) {
  //   this.more_menu_lease_all_data = "";
  //   this.leaseService
  //     .getAllLeaseData({ id: lease_id })
  //     .subscribe((value) => {
  //       this.more_menu_lease_all_data = value;
  //     })
  //     .add(() => {
  //       this.more_menu_lease_loaded = true;
  //     });
  // }

  openEditLease(index, lease_id) {
    this.dialog
      .open(EditLeaseDialog, {
        width: "100%",
        data: lease_id,
      })
      .afterClosed()
      .subscribe((value) => {
        if (value != undefined) {
          this.updateData(value, index);
        }
      });
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
    this.router.navigate(["/property-unit-details"], {
      queryParams: { unit_id: unit_id },
    });
  }

  navigateToUserDetailsPage(user_id, auth) {
    this.router.navigate(["/user-details"], {
      queryParams: { user_id: user_id, auth: auth },
    });
  }

  viewDetails(data: string) {
    this.router.navigate(["/contract-details"], {
      queryParams: { contact_id: data },
    });
  }

  exportExcelFile() {
    this.dialog
      .open(GenerateExcelDialog, {
        width: "40%",
        data: "contract",
      })
      .afterClosed()
      .subscribe((value) => {});
  }
}
