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
import { CountryDropdown } from "../country-dropdown/country-dropdown";
import { PaymentService } from "app/services/payment.service";
import { AddPaymentDialog } from "../add_payment_dialog/add_payment_dialog";

@Component({
  // standalone: true,
  selector: "edit_lease_dialog",
  styleUrls: ["./edit_lease_dialog.scss"],
  templateUrl: "./edit_lease_dialog.html",
  // imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class EditLeaseDialog implements OnInit {
  isContentLoading: boolean = true;
  all_data: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditLeaseDialog>,
    private leaseService: LeaseService,
    private paymentService: PaymentService,
    private dialog: MatDialog
  ) {
    leaseService
      .getContractPaymentsCount(
        JSON.stringify({
          contract_id: data,
        })
      )
      .subscribe((count) => {
        this.tottal_added_payments_count = count;
      });
    this.leaseService
      .getAllLeaseData({ id: data })
      .subscribe((value: any) => {
        this.all_data = value;
        console.log(value);
        this.property = value.prop_name;
        this.unit_data = value.unit_no;
        this.tenant = value.tenant_name;
        this.contract_start_date = value.lease_contract_start;
        this.contract_end_date = value.lease_contract_end;
        this.move_in_date = value.lease_move_in;
        this.move_out_date = value.lease_move_out;
        this.notice_period = value.lease_notice_period;
        this.purpose = value.lease_purpose;
        this.dewa = value.lease_dewa_inclusive == "0" ? false : true;
        this.chiller = value.lease_chiller_inclusive == "0" ? false : true;
        this.gas = value.lease_gas_inclusive == "0" ? false : true;
        this.payment_currency = value.lease_payment_currency;
        this.yearly_amount = value.lease_yearly_amount;
        this.rent_amount = value.lease_rent_amount;
        this.no_of_cheques = value.lease_no_of_cheques;
        this.govt_charges = value.lease_govt_charges;
        this.security_deposit = value.lease_security_deposit;

        JSON.parse(value.lease_docs).forEach((doc) => {
          this.docsFilesUploaded.push({ name: doc, old: true });
        });

        if (value.lease_unit_ownership_type == "multiple") {
          this.ownership_type = "multiple";
          this.all_owners = JSON.parse(value.lease_unit_all_owners);
        } else {
          this.owner = value.user_name;
        }
      })
      .add(() => {
        this.isContentLoading = false;
      });
  }

  @ViewChild("fileInput") fileInput: ElementRef;
  @ViewChild("fileInputImage") fileInputImage: ElementRef;

  @ViewChild("country_dropdown") country_dropdown: CountryDropdown;

  docsFilesUploaded: any[] = [];

  docsFilesUploaded_new: File[] = [];

  payment_details_data: any[] = [];

  tottal_added_payments_count: any;

  property: any = "";
  unit_data: any = "";
  owner: any = "Select a Unit";
  tenant: any = "";
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

  dewa: boolean = false;
  chiller: boolean = false;
  gas: boolean = false;

  formNotFilled: boolean = false;
  documentNotAdded: boolean = false;
  uploading: boolean = false;

  uploading_progress: any = 0;

  properties: any[] = [];
  all_units: any[] = [];
  units: any[] = [];
  users: any[] = [];
  all_users: any[] = [];

  removed_existing_docs: any[] = [];

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
      return this.owner;
    }
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close();
  }

  onFileSelected(files: Array<any>) {
    for (var item of files) {
      this.docsFilesUploaded.push(item);
      this.docsFilesUploaded_new.push(item);
    }
    this.fileInput.nativeElement.value = "";
  }

  removeUploadedDoc(index: number, file: any) {
    if (this.docsFilesUploaded_new.includes(file)) {
      var i = this.docsFilesUploaded_new.findIndex((f) => f.name == file.name);
      this.docsFilesUploaded_new.splice(i, 1);
    } else {
      this.removed_existing_docs.push(file);
    }
    this.docsFilesUploaded.splice(index, 1);
  }

  onSubmit() {
    if (this.docsFilesUploaded.length != 0) {
      if (
        this.contract_start_date != "" &&
        this.contract_end_date != "" &&
        this.purpose != "" &&
        this.no_of_cheques != "" &&
        this.yearly_amount != ""
      ) {
        this.uploading = true;
        var random_id = this.data;

        var docs_names = [];
        var docs_names_new = [];

        for (var doc of this.docsFilesUploaded) {
          docs_names.push(doc.name);
          if (doc.old == undefined) {
            docs_names_new.push(doc.name);
          }
        }

        var data = this.setupData(random_id, docs_names);
        this.leaseService.editLease(data).subscribe((val) => {
          console.log(val);
          if (val == "success") {
            if (this.removed_existing_docs.length != 0) {
              this.leaseService
                .deleteRemovedLeaseDocs(
                  JSON.stringify({
                    names: this.removed_existing_docs,
                    id: random_id,
                  })
                )
                .subscribe((res) => {
                  console.log(res);
                });
            }

            if (this.payment_details_data.length != 0) {
              this.submitPaymentDetails();
            }
            var uploadData = this.setupUploadFiles(random_id, docs_names_new);
            this.leaseService
              .uploadAllFilesAddNewLease(uploadData)
              .pipe(
                map((event) => this.getEventMessage(event)),
                tap((message) => {
                  if (message == "File was completely uploaded!") {
                    this.dialogRef.close({
                      completed: true,
                      data: JSON.parse(data),
                    });
                  }
                }),
                last()
              )
              .subscribe((v) => {
                this.onCloseDialog();
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
    for (let doc of this.docsFilesUploaded_new) {
      doc_count++;
      formdata.append(`doc_${doc_count}`, doc);
    }

    formdata.append("contract_id", random_id);

    return formdata;
  }

  setupData(random_id: any, docs_names: any[]): string {
    const start = new Date(this.contract_start_date);
    const end = new Date(this.contract_end_date);
    var data = {
      contract_id: random_id,
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
    this.dialog
      .open(AddPaymentDialog, {
        width: "100%",
        data: {
          contract_id: this.data,
          property_id: this.all_data.prop_uid,
          property_name: this.all_data.prop_name,
          unit_id: this.all_data.unit_id,
          unit_no: this.all_data.unit_no,
          tenant_id: this.all_data.tenant_uid,
          tenant_name: this.all_data.tenant_name,
          type: "lease",
        },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res != undefined) {
          this.payment_details_data.push(res);
          this.tottal_added_payments_count++;
        }
      });
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
              console.log(v, 'payment added');
            });
        }
      });
    });
  }
}
