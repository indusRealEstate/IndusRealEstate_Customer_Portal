import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { AddPaymentDialog } from "app/components/add_payment_dialog/add_payment_dialog";
import { CautionDialog } from "app/components/caution-dialog/caution-dialog";
import { EditPaymentDialog } from "app/components/edit_payment_dialog/edit_payment_dialog";
import { GenerateExcelDialog } from "app/components/generate_excel/generate_excel";
import { PaymentDetailsDialog } from "app/components/payment-details-dialog/payment-details-dialog";
import { TableSearchBarComponent } from "app/components/searchbar-table/searchbar-table";
import { AuthenticationService } from "app/services/authentication.service";
import { PaymentService } from "app/services/payment.service";

@Component({
  selector: "admin-payments",
  templateUrl: "./admin-payments.html",
  styleUrls: ["./admin-payments.scss"],
})
export class AdminPayments implements OnInit {
  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;
  pageChangerLoading: boolean = false;

  displayedColumns: string[] = [
    // "name",
    "id",
    "unit",
    "tenant",
    "method",
    "property",
    "date",
    "more",
  ];

  allPayments: any[] = [];
  allPaymentsMatTableData: MatTableDataSource<any>;
  ngAfterViewInitInitialize: boolean = false;

  loadingTable: any[] = [1, 2, 3, 4, 5];

  statusMenuOpened: boolean = false;
  flaggedRequest: boolean = false;

  // userId: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(TableSearchBarComponent) searchBar: TableSearchBarComponent;

  tableLength: number = 0;

  pushSub: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private paymentService: PaymentService,
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

  fetchData(limit?) {
    if (this.searchBar != undefined) {
      this.searchBar.searchText = "";
    }
    this.paymentService
      .getAllPaymentsPagination(limit == undefined ? 10 : limit, 1)
      .subscribe((va: any) => {
        this.allPayments = va.payments;
        this.allPaymentsMatTableData = new MatTableDataSource(va.payments);
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
    this.allPayments.length = 0;
  }

  refreshTable() {
    this.searchBar.searchText != "";
    this.isContentLoading = true;
    this.fetchData();
  }

  searchPayments(filterValue: any) {
    this.pageChangerLoading = true;
    if (filterValue != "") {
      this.paymentService
        .getallPaymentsSearch(
          filterValue,
          this.paginator.pageSize,
          this.paginator.pageIndex + 1
        )
        .subscribe((va: any) => {
          // console.log(va);
          this.allPayments = va.payments;
          this.allPaymentsMatTableData = new MatTableDataSource(va.payments);
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
      this.paymentService
        .getallPaymentsSearchPageChange(
          this.searchBar.searchText,
          event.pageSize,
          event.pageIndex + 1
        )
        .subscribe((va: any) => {
          this.allPayments = va;
          this.allPaymentsMatTableData = new MatTableDataSource(va);
        })
        .add(() => {
          this.pageChangerLoading = false;
        });
    } else {
      this.paymentService
        .getAllPaymentsPagination(event.pageSize, event.pageIndex + 1)
        .subscribe((va: any) => {
          console.log(va);
          this.allPayments = va.payments;
          this.allPaymentsMatTableData = new MatTableDataSource(va.payments);
        })
        .add(() => {
          this.pageChangerLoading = false;
        });
    }
  }

  addPaymentDialogOpen() {
    this.dialog
      .open(AddPaymentDialog, {
        width: "100%",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res != undefined) {
          if (res.completed == true) {
            this.refreshTable();
            this.openSnackBar("New payment added successfully", "Close");
          }
        }
      });
  }

  deletePayment(prop_id: any) {
    var data = {
      title: "Delete Payment?",
      subtitle:
        "Are you sure you want to delete this payment? You can't undo this action.",
      warning:
        "By deleting this payment, all the documents and images uploaded will be lost.",
      delete_text: "Delete Payment",
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
            this.paymentService
              .deletePayment(prop_id)
              .subscribe((res) => {
                console.log(res);
              })
              .add(() => {
                this.refreshTable();
                this.openSnackBar("Payment deleted successfully", "Close");
              });
          }
        }
      });
  }

  viewPaymentDetails(payment_id: any, method) {
    this.dialog
      .open(PaymentDetailsDialog, {
        width: "100%",
        data: {
          id: payment_id,
          method: method,
        },
      })
      .afterClosed()
      .subscribe((value) => {});
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

  openEditPayment(index, payment_id, method) {
    // if (this.more_menu_prop_all_data != undefined) {
    //   var data = this.more_menu_prop_all_data;
    this.dialog
      .open(EditPaymentDialog, {
        width: "100%",
        data: {
          id: payment_id,
          method: method,
        },
      })
      .afterClosed()
      .subscribe((value) => {
        if (value != undefined) {
          this.openSnackBar("Payment updated successfully", "Close");
        }
      });
    // }
  }

  exportExcelFile() {
    this.dialog
      .open(GenerateExcelDialog, {
        width: "40%",
        data: "payment",
      })
      .afterClosed()
      .subscribe((value) => {});
  }

  navigateToProprety(prop_id: any) {
    this.router.navigate(["/property-details"], {
      queryParams: {
        prop_id: prop_id,
      },
    });
  }

  navigateToUnit(unit_id: any) {
    this.router.navigate(["/property-unit-details"], {
      queryParams: { unit_id: unit_id },
    });
  }

  navigateToUserDetails(user_id: any, auth) {
    this.router.navigate(["/user-details"], {
      queryParams: { user_id: user_id, auth: auth },
    });
  }
}
