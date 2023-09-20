import { Component, HostListener, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { CautionDialog } from "app/components/caution-dialog/caution-dialog";
import { EditLeaseDialog } from "app/components/edit_lease_dialog/edit_lease_dialog";
import { PaymentDetailsDialog } from "app/components/payment-details-dialog/payment-details-dialog";
import { ReniewContractDialog } from "app/components/reniew-contract-dialog/reniew-contract-dialog";
import { AuthenticationService } from "app/services/authentication.service";
import { DownloadService } from "app/services/download.service";
import { LeaseService } from "app/services/lease.service";
import { PaymentService } from "app/services/payment.service";
import * as FileSaver from "file-saver";

@Component({
  selector: "admin-lease-details",
  templateUrl: "./admin-lease-details.html",
  styleUrls: ["./admin-lease-details.scss"],
})
export class AdminLeaseDetail implements OnInit {
  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;
  all_data: object | any;
  contract_id: string;
  property_images: string[] = [];
  prop_doc: string[] = [];
  lease_doc: string[] = [];
  selectDoc: string = "";
  isSelect: boolean = false;

  activatedRoute: any;
  screenHeight: number;
  screenWidth: number;
  amenities: string[] = [];

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private leaseService: LeaseService,
    private downloadService: DownloadService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private paymentService: PaymentService
  ) {
    this.isContentLoading = true;

    this.route.queryParams.subscribe((param) => {
      this.contract_id = param.contract_id;
    });

    this.getScreenSize();

    authenticationService.validateToken().subscribe((res) => {
      if (res != "not-expired") {
        authenticationService.logout();
      }
    });
  }

  payment_table_length: any = 0;
  paymentsMatTableDataSource: MatTableDataSource<any>;
  pageChangePaymentTable: boolean = false;

  displayedColumns: string[] = ["id", "mode", "no_of_cheques", "date"];

  paymentTablePageChange(event) {
    this.pageChangePaymentTable = true;
    this.paymentService
      .getAllPaymentsByContract(
        this.contract_id,
        event.pageSize,
        event.pageIndex + 1
      )
      .subscribe((res) => {
        this.paymentsMatTableDataSource = new MatTableDataSource<any>(
          res.payments
        );
      })
      .add(() => {
        this.pageChangePaymentTable = false;
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      verticalPosition: "top",
      horizontalPosition: "right",
      duration: 3000,
    });
  }

  all_owners: any[] = [];
  ownership_type: any = "single";

  navigateUserDetails(user_id, auth) {
    this.router.navigate(["/user-details"], {
      queryParams: {
        user_id: user_id,
        auth: auth,
      },
    });
  }

  async ngOnInit() {
    this.leaseService
      .getAllLeaseData({ id: this.contract_id })
      .subscribe((value: any) => {
        this.isContentLoading = true;
        this.all_data = value;
        console.log(this.all_data);

        if (value.lease_unit_ownership_type == "multiple") {
          this.ownership_type = "multiple";
          this.all_owners = JSON.parse(value.lease_unit_all_owners);
        }

        for (let i = 0; i < JSON.parse(this.all_data.lease_docs).length; i++) {
          this.lease_doc.push(JSON.parse(this.all_data.lease_docs)[i]);
        }
        for (
          let i = 0;
          i < JSON.parse(this.all_data.unit_amenties).length;
          i++
        ) {
          this.amenities.push(JSON.parse(this.all_data.unit_amenties)[i]);
        }
      })
      .add(() => {
        this.isContentLoading = false;
      });

    this.pageChangePaymentTable = true;
    this.paymentService
      .getAllPaymentsByContract(this.contract_id, 5, 1)
      .subscribe((res) => {
        this.paymentsMatTableDataSource = new MatTableDataSource<any>(
          res.payments
        );
        this.payment_table_length = res.count;
      })
      .add(() => {
        this.pageChangePaymentTable = false;
      });
  }

  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  openProperty() {
    this.router.navigate(["/property-details"], {
      queryParams: {
        prop_id: this.all_data.prop_uid,
      },
    });
  }

  downloadDoc() {
    if (this.selectDoc != "") {
      this.downloadService
        .downloadFile(
          `contract/${this.all_data.lease_contract_id}/documents/${this.selectDoc}`
        )
        .subscribe((res: any) => {
          // console.log(res);
          FileSaver.saveAs(res, this.selectDoc);
        });
    }
  }

  openMoreMenu() {
    var start_date = new Date();
    var end = "";
    if (this.all_data != undefined) {
      end = this.all_data.lease_contract_end;
    }
    var end_date = new Date(end);

    var difference_In_Time = end_date.getTime() - start_date.getTime();

    var difference_In_Days = difference_In_Time / (1000 * 3600 * 24);

    if (difference_In_Days < 0) {
      this.reniewContract();
    } else {
      this.openCautionDialog();
    }
  }

  getExpiryText() {
    var start_date = new Date();
    var end = "";
    if (this.all_data != undefined) {
      end = this.all_data.lease_contract_end;
    }
    var end_date = new Date(end);

    var difference_In_Time = end_date.getTime() - start_date.getTime();

    var difference_In_Days = difference_In_Time / (1000 * 3600 * 24);

    if (difference_In_Days < 0) {
      return "Reniew Contract";
    } else {
      return "Terminate Contract";
    }
  }

  reniewContract() {
    this.dialog
      .open(ReniewContractDialog, {
        width: "70%",
        data: this.all_data.lease_contract_id,
        //height: "40rem",
      })
      .afterClosed()
      .subscribe((res) => {});
  }

  openCautionDialog() {
    var data = {
      title: "Terminate contract?",
      subtitle:
        "Are you sure you want to terminate this contract? You can't undo this action.",
      warning:
        "By terminating this agreement, Unit will be designated as empty and current tenant's lease would be revoked.",
      delete_text: "Terminate Contract",
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
            this.terminateLease(
              this.all_data.lease_contract_id,
              this.all_data.lease_unit_id,
              this.all_data.lease_tenant_id
            );
            this.openSnackBar("Lease terminated successfully", "Close");
            this.router.navigate(["/admin-lease"]);
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

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  openEditLease() {
    this.dialog
      .open(EditLeaseDialog, {
        width: "100%",
        data: this.all_data.lease_contract_id,
      })
      .afterClosed()
      .subscribe((value) => {
        if (value != undefined) {
          this.updateData(value);
        }
      });
  }

  updateData(data) {
    sessionStorage.removeItem("all_lease_session");
    var updated_data = data.data;

    this.all_data.lease_chiller_inclusive =
      updated_data.chiller == 1 ? "1" : "0";
    this.all_data.lease_contract_end = updated_data.contract_end;
    this.all_data.lease_contract_start = updated_data.contract_start;
    this.all_data.lease_dewa_inclusive = updated_data.dewa == 1 ? "1" : "0";
    this.all_data.lease_docs = updated_data.documents;
    this.all_data.lease_gas_inclusive = updated_data.gas == 1 ? "1" : "0";
    this.all_data.lease_govt_charges = updated_data.govt_charges;
    this.all_data.lease_move_in = updated_data.move_in;
    this.all_data.lease_move_out = updated_data.move_out;
    this.all_data.lease_no_of_cheques = updated_data.no_of_cheques;
    this.all_data.lease_notice_period = updated_data.notice_period;
    this.all_data.lease_payment_currency = updated_data.payment_currency;
    this.all_data.lease_purpose = updated_data.purpose;
    this.all_data.lease_rent_amount = updated_data.rent_amount;
    this.all_data.lease_security_deposit = updated_data.security_deposit;
    this.all_data.lease_yearly_amount = updated_data.yearly_amount;

    this.openSnackBar("Lease updated successfully", "Close");
  }

  // ngAfterViewInit() {
  //   if (this.ngAfterViewInitInitialize == true) {
  //     if (this.allPropertiesMatTableData != undefined) {
  //       this.allPropertiesMatTableData.paginator = this.paginator;
  //       this.allPropertiesMatTableData.paginator._changePageSize(10);
  //     }
  //   } else {
  //     setTimeout(() => {
  //       if (this.allPropertiesMatTableData != undefined) {
  //         this.allPropertiesMatTableData.paginator = this.paginator;
  //         this.allPropertiesMatTableData.paginator._changePageSize(10);
  //       }
  //     });
  //   }
  // }

  viewImageOfUnit(data: string) {
    let constainer = document.getElementById("full-screen-image");
    constainer.style.display = "flex";
    constainer.style.width = "100vw";
    constainer.style.height = "100vh";
    constainer.style.backgroundColor = "#000000bd";
    constainer.style.position = "fixed";
    constainer.style.zIndex = "1000";
    constainer.style.top = "0";
    constainer.style.left = "0";
    let image = document.getElementById("image");
    image.setAttribute("src", data);
    image.style.width = "75vw";
    image.style.height = "75vh";
    image.style.objectFit = "cover";
    image.style.objectPosition = "bottom";
    image.style.margin = "auto";
  }

  onCloseDialog() {
    let constainer = document.getElementById("full-screen-image");
    constainer.style.display = "none";
  }

  call_person() {
    location.href = `tell:${
      this.all_data.user_country_code_number + this.all_data.user_mobile_number
    }`;
  }
  email_person() {
    location.href =
      "mailto:" +
      this.all_data.user_email +
      "?cc=" +
      "sample@sdsd.ae" +
      "&subject=" +
      "test" +
      "&body=" +
      "hi";
  }

  call_tenant_person() {
    location.href = `tell:${
      this.all_data.tenant_country_code_number +
      this.all_data.tenant_mobile_number
    }`;
  }
  email_tenant_person() {
    location.href =
      "mailto:" +
      this.all_data.tenant_email +
      "?cc=" +
      "sample@sdsd.ae" +
      "&subject=" +
      "test" +
      "&body=" +
      "hi";
  }

  navigateToUnit(unit) {
    this.router.navigate(["/property-unit-details"], {
      queryParams: { unit_id: unit },
    });
  }
}
