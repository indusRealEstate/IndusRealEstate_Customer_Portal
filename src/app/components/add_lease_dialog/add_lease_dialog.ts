import { HttpEvent, HttpEventType } from "@angular/common/http";
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { LeaseService } from "app/services/lease.service";
import { last, map, tap } from "rxjs";
import * as uuid from "uuid";
import { CountryDropdown } from "../country-dropdown/country-dropdown";
import { PaginatorDialog } from "../paginator-dialog/paginator-dialog";
import { AddPaymentDialog } from "../add_payment_dialog/add_payment_dialog";
import { PaymentService } from "app/services/payment.service";
import { formatDate } from "@angular/common";

@Component({
  // standalone: true,
  selector: "add_lease_dialog",
  styleUrls: ["./add_lease_dialog.scss"],
  templateUrl: "./add_lease_dialog.html",
  // imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class AddLeaseDialog implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddLeaseDialog>,
    private leaseService: LeaseService,
    private paymentService: PaymentService,
    private dialog: MatDialog
  ) {
    if (data != undefined) {
      this.selected_property = {
        id: data.prop_id,
        name: data.prop_name,
      };

      this.unit_data = {
        id: data.unit_id,
        no: data.unit_no,
      };

      if (data.ownership_type == "multiple") {
        this.ownership_type = "multiple";
        this.all_owners = data.all_owners;
      } else {
        this.owner = {
          name: data.owner_name,
          id: data.owner_id,
        };
      }
    }

    this.contract_id = uuid.v4();
  }

  @ViewChild("fileInput") fileInput: ElementRef;
  @ViewChild("fileInputImage") fileInputImage: ElementRef;

  @ViewChild("country_dropdown") country_dropdown: CountryDropdown;

  docsFilesUploaded: File[] = [];

  payment_details_data: any[] = [];

  contract_id: any;

  unit_data: any;
  owner: any;
  contract_start_date: any = "";
  contract_end_date: any = "";
  move_in_date: any = "";
  move_out_date: any = "";
  notice_period: any = "";
  purpose: any = "";
  payment_currency: any = "";
  payment_method: any = "";
  rent_amount: any = "";
  no_of_cheques: any = "";
  govt_charges: any = "";
  security_deposit: any = "";
  yearly_amount: any = "";

  selected_property: any;
  tenant_data: any;

  property_not_selected: boolean = false;

  payment_add__details_not_selected: boolean = false;

  dewa: boolean = false;
  chiller: boolean = false;
  gas: boolean = false;

  formNotFilled: boolean = false;
  documentNotAdded: boolean = false;
  uploading: boolean = false;

  uploading_progress: any = 0;

  notice_period_lists: any[] = [
    { value: "1", viewValue: "1 Month" },
    { value: "2", viewValue: "2 Months" },
    { value: "3", viewValue: "3 Months" },
    { value: "4", viewValue: "4 Months" },
    { value: "5", viewValue: "5 Months" },
    { value: "6", viewValue: "6 Months" },
    { value: "7", viewValue: "7 Months" },
    { value: "8", viewValue: "8 Months" },
    { value: "9", viewValue: "9 Months" },
    { value: "10", viewValue: "10 Months" },
    { value: "11", viewValue: "11 Months" },
    { value: "12", viewValue: "12 Months" },
  ];

  purpose_list: any[] = [
    { value: "commercial", viewValue: "Commercial" },
    { value: "residential", viewValue: "Residential" },
    { value: "industrial", viewValue: "Industrial" },
  ];

  currency_list: any[] = [
    { value: "aed", viewValue: "AED" },
    { value: "usd", viewValue: "USD" },
    { value: "other", viewValue: "Other" },
  ];

  payment_method_list: any[] = [
    { value: "cheque", viewValue: "Cheque" },
    { value: "cash", viewValue: "Cash" },
    { value: "online", viewValue: "Online" },
  ];

  no_of_cheques_list: any[] = [
    { value: "1", viewValue: "1 Cheque" },
    { value: "2", viewValue: "2 Cheques" },
    { value: "3", viewValue: "3 Cheques" },
    { value: "4", viewValue: "4 Cheques" },
    { value: "5", viewValue: "5 Cheques" },
    { value: "6", viewValue: "6 Cheques" },
    { value: "7", viewValue: "7 Cheques" },
    { value: "8", viewValue: "8 Cheques" },
    { value: "9", viewValue: "9 Cheques" },
    { value: "10", viewValue: "10 Cheques" },
    { value: "11", viewValue: "11 Cheques" },
    { value: "12", viewValue: "12 Cheques" },
    { value: "13", viewValue: "13 Cheques" },
    { value: "14", viewValue: "14 Cheques" },
    { value: "15", viewValue: "15 Cheques" },
  ];

  all_owners: any[] = [];
  ownership_type: any = "single";

  getOwnerValue() {
    if (this.ownership_type == "multiple") {
      return `${this.all_owners.length} Owners`;
    } else {
      if (this.owner == undefined) {
        return "Select a Unit";
      } else {
        return this.owner.name;
      }
    }
  }

  addPaginatorDialog(type: string) {
    if (type == "unit" && this.selected_property == undefined) {
      this.property_not_selected = true;

      setTimeout(() => {
        this.property_not_selected = false;
      }, 3000);
    } else {
      this.dialog
        .open(PaginatorDialog, {
          width: "50%",
          data: {
            type: type,
            user_type: type == "user" ? "tenant" : undefined,
            prop:
              this.selected_property != undefined
                ? this.selected_property.id
                : undefined,
          },
        })
        .afterClosed()
        .subscribe((res) => {
          if (res != undefined) {
            if (type == "property") {
              this.selected_property = {
                id: res.property_id,
                name: res.property_name,
              };
              this.unit_data = undefined;
              this.owner = undefined;
            } else if (type == "unit") {
              this.unit_data = {
                id: res.unit_id,
                no: res.unit_no,
              };

              if (res.owner_type == "multiple") {
                this.ownership_type = "multiple";
                this.all_owners = JSON.parse(res.all_owners);
              } else {
                this.owner = {
                  id: res.owner_id,
                  name: res.owner,
                };
              }
            } else if (type == "user") {
              this.tenant_data = {
                id: res.user_id,
                name: res.name,
              };
            }
          }
        });
    }
  }

  ngOnInit() {}

  onCloseDialog() {
    this.dialogRef.close();
  }

  onFileSelected(files: Array<any>) {
    for (var item of files) {
      this.docsFilesUploaded.push(item);
    }
    this.fileInput.nativeElement.value = "";
  }

  removeUploadedDoc(index) {
    this.docsFilesUploaded.splice(index, 1);
  }

  onSubmit() {
    if (this.docsFilesUploaded.length != 0) {
      if (
        this.selected_property != undefined &&
        this.unit_data != undefined &&
        this.tenant_data != undefined &&
        this.contract_start_date != "" &&
        this.contract_end_date != "" &&
        this.purpose != "" &&
        this.no_of_cheques != "" &&
        this.yearly_amount != ""
      ) {
        this.uploading = true;

        var docs_names = [];

        for (var doc of this.docsFilesUploaded) {
          docs_names.push(doc.name);
        }

        var data = this.setupData(this.contract_id, docs_names);
        this.leaseService.addNewLease(data).subscribe((val) => {
          if (val == "success") {
            if (this.payment_details_data.length != 0) {
              this.submitPaymentDetails();
            }
            var uploadData = this.setupUploadFiles(
              this.contract_id,
              docs_names
            );
            this.leaseService
              .uploadAllFilesAddNewLease(uploadData)
              .pipe(
                map((event) => this.getEventMessage(event)),
                tap((message) => {
                  if (message == "File was completely uploaded!") {
                    this.dialogRef.close({ completed: true });
                  }
                }),
                last()
              )
              .subscribe((v) => {
                console.log(v);
              });
          }
        });
      } else {
        this.formNotFilled = true;
        setTimeout(() => {
          this.formNotFilled = false;
        }, 3000);
      }
    } else {
      this.documentNotAdded = true;
      setTimeout(() => {
        this.documentNotAdded = false;
      }, 3000);
    }
  }

  setupUploadFiles(random_id: any, docs_names: any[]): FormData {
    const formdata: FormData = new FormData();

    formdata.append("docs_names", JSON.stringify(docs_names));

    var doc_count = 0;
    for (let doc of this.docsFilesUploaded) {
      doc_count++;
      formdata.append(`doc_${doc_count}`, doc);
    }

    formdata.append("contract_id", random_id);

    return formdata;
  }

  setupData(random_id: any, docs_names: any[]): string {
    const start = new Date(this.contract_start_date);
    const end = new Date(this.contract_end_date);
    var timeStamp = formatDate(new Date(), "yyyy-MM-dd HH:mm:ss", "en");
    var data = {
      contract_id: random_id,
      property_id: this.selected_property.id,
      property_name: this.selected_property.name,
      unit_id: this.unit_data.id,
      unit_no: this.unit_data.no,
      ownership_type: this.ownership_type,
      all_owners: JSON.stringify(this.all_owners),
      owner_id: this.owner != undefined ? this.owner.id : "",
      owner_name: this.owner != undefined ? this.owner.name : "",
      tenant_id: this.tenant_data.id,
      tenant_name: this.tenant_data.name,
      status: "active",
      contract_start: new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate(),
        start.getHours(),
        start.getMinutes() - start.getTimezoneOffset()
      ).toISOString(),
      contract_end: new Date(
        end.getFullYear(),
        end.getMonth(),
        end.getDate(),
        end.getHours(),
        end.getMinutes() - end.getTimezoneOffset()
      ).toISOString(),
      move_in: this.move_in_date,
      move_out: this.move_out_date,
      notice_period: this.notice_period,
      purpose: this.purpose,
      yearly_amount: this.yearly_amount,
      payment_currency: this.payment_currency,
      rent_amount: this.rent_amount,
      no_of_cheques: this.no_of_cheques,
      govt_charges: this.govt_charges,
      security_deposit: this.security_deposit,
      documents: JSON.stringify(docs_names),
      dewa: this.dewa == false ? 0 : 1,
      chiller: this.chiller == false ? 0 : 1,
      gas: this.gas == false ? 0 : 1,
      created_date: timeStamp,
      created_user_id: JSON.parse(localStorage.getItem("currentUser")).id,
    };

    return JSON.stringify(data);
  }

  /** Return distinct message for sent, upload progress, & response events */
  private getEventMessage(event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.Sent:
        return `Uploading file `;

      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        const percentDone = event.total
          ? Math.round((100 * event.loaded) / event.total)
          : 0;

        this.uploading_progress = percentDone;
        return `File is ${percentDone}% uploaded.`;

      case HttpEventType.Response:
        this.uploading = false;
        return `File was completely uploaded!`;

      default:
        return `File surprising upload event: ${event.type}.`;
    }
  }

  addPayments() {
    if (
      this.selected_property != undefined &&
      this.tenant_data != undefined &&
      this.unit_data != undefined
    ) {
      this.dialog
        .open(AddPaymentDialog, {
          width: "100%",
          data: {
            contract_id: this.contract_id,
            property_id: this.selected_property.id,
            property_name: this.selected_property.name,
            unit_id: this.unit_data.id,
            unit_no: this.unit_data.no,
            tenant_id: this.tenant_data.id,
            tenant_name: this.tenant_data.name,
            type: "lease",
          },
        })
        .afterClosed()
        .subscribe((res) => {
          if (res != undefined) {
            this.payment_details_data.push(res);
          }
        });
    } else {
      this.payment_add__details_not_selected = true;
      setTimeout(() => {
        this.payment_add__details_not_selected = false;
      }, 3000);
    }
  }

  submitPaymentDetails() {
    // var count = 0;
    this.payment_details_data.forEach((pd) => {
      this.paymentService.addNewPayment(pd.data).subscribe((val) => {
        if (val == "success") {
          this.paymentService
            .uploadAllFilesAddNewPayment(pd.upload_data)
            .pipe(
              map((event) => this.getEventMessage(event)),
              tap((message) => {
                if (message == "File was completely uploaded!") {
                }
              }),
              last()
            )
            .subscribe((v) => {
              console.log(v);
            });
        }
      });
    });
  }
}
