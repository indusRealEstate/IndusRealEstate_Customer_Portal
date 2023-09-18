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
import { PaymentService } from "app/services/payment.service";
import { last, map, tap } from "rxjs";
import * as uuid from "uuid";
import { CountryDropdown } from "../country-dropdown/country-dropdown";
import { PaginatorDialog } from "../paginator-dialog/paginator-dialog";

@Component({
  // standalone: true,
  selector: "add_payment_dialog",
  styleUrls: ["./add_payment_dialog.scss"],
  templateUrl: "./add_payment_dialog.html",
  // imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class AddPaymentDialog implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddPaymentDialog>,
    private paymentService: PaymentService,
    private dialog: MatDialog
  ) {
    if (data != undefined) {
      this.contract_id = data.contract_id;
      this.unit_data = {
        id: data.unit_id,
        no: data.unit_no,
      };

      this.selected_property = {
        id: data.property_id,
        name: data.property_name,
      };

      this.tenant_data = {
        id: data.tenant_id,
        name: data.tenant_name,
      };
    }

    this.payment_id = uuid.v4();
  }

  @ViewChild("fileInput") fileInput: ElementRef;
  @ViewChild("fileInputImage") fileInputImage: ElementRef;

  @ViewChild("country_dropdown") country_dropdown: CountryDropdown;

  docsFilesUploaded: File[] = [];

  payment_id: any;

  unit_data: any;
  purpose: any = "";
  payment_method: any;
  payment_status: any = "";
  amount: any = "";
  selected_property: any;

  issued_date: any;

  owner: any;
  tenant_data: any;

  contract_id: any;

  cheque_no: any;
  cheque_name: any = "";
  cheque_date: any;

  cash_details: any;

  bank_name: any;
  bank_branch: any;
  bank_no: any;
  bank_iban: any;
  bank_holder_name: any;

  no_of_cheques: any = "";

  property_not_selected: boolean = false;

  formNotFilled: boolean = false;
  documentNotAdded: boolean = false;
  uploading: boolean = false;

  uploading_progress: any = 0;
  transaction_id: any;

  added_cheques: any[] = [];

  purpose_list: any[] = [
    { value: "rent", viewValue: "Rent" },
    { value: "security_deposit", viewValue: "Security Deposit" },
    { value: "maintenance", viewValue: "Maintenance" },
    { value: "admin_fee", viewValue: "Admin Fee" },
    { value: "other", viewValue: "Other" },
  ];

  payment_status_list: any[] = [
    { value: "paid", viewValue: "Paid" },
    { value: "unpaid", viewValue: "Unpaid" },
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
            payment: true,
            prop:
              this.selected_property != undefined
                ? this.selected_property.id
                : undefined,
          },
        })
        .afterClosed()
        .subscribe((res) => {
          if (res != undefined) {
            // console.log(res);
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

              this.owner = {
                id: res.owner_id,
                name: res.owner,
              };

              this.tenant_data = {
                id: res.tenant_id,
                name: res.tenant_name,
              };

              this.contract_id = res.lease_id;
            }
          }
        });
    }
  }

  checkPaymentMethodDetailsNotEmpty() {
    if (this.payment_method == "cheque") {
      if (this.no_of_cheques == "" || this.added_cheques.length == 0) {
        return false;
      } else {
        return true;
      }
    } else if (this.payment_method == "online") {
      if (
        this.bank_name != undefined &&
        this.bank_holder_name != undefined &&
        this.bank_no != undefined &&
        this.purpose != "" &&
        this.payment_status != "" &&
        this.amount != "" &&
        this.transaction_id != ""
      ) {
        return true;
      } else {
        return false;
      }
    } else if (this.payment_method == "cash") {
      if (
        this.cash_details != undefined &&
        this.purpose != "" &&
        this.payment_status != "" &&
        this.amount != ""
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

  addCheque() {
    if (
      this.cheque_no != "" &&
      this.cheque_date != "" &&
      this.purpose != "" &&
      this.payment_status != "" &&
      this.amount != ""
    ) {
      this.added_cheques.push({
        no: this.cheque_no,
        name: this.cheque_name,
        date: this.cheque_date,
        purpose: this.purpose_list.find((p) => p.value == this.purpose)
          .viewValue,
        status: this.payment_status_list.find(
          (s) => s.value == this.payment_status
        ).viewValue,

        amount: this.amount,
      });

      setTimeout(() => {
        this.cheque_no = "";
        this.cheque_name = "";
        this.cheque_date = "";
        this.purpose = "";
        this.payment_status = "";
        this.amount = "";
      }, 100);
    }
  }

  deleteCheque(index) {
    this.added_cheques.splice(index, 1);
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
    if (this.data != undefined) {
      if (this.data.type == "lease") {
        if (this.docsFilesUploaded.length != 0) {
          if (
            this.selected_property != undefined &&
            this.unit_data != undefined &&
            this.tenant_data != undefined &&
            this.payment_method != "" &&
            this.checkPaymentMethodDetailsNotEmpty() != false
          ) {
            var docs_names = [];

            for (var doc of this.docsFilesUploaded) {
              docs_names.push(doc.name);
            }

            var setup_data = this.setupData(this.payment_id, docs_names);
            var uploadData = this.setupUploadFiles(this.payment_id, docs_names);

            this.dialogRef.close({
              data: JSON.parse(setup_data),
              upload_data: uploadData,
              docs: this.docsFilesUploaded,
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
    } else {
      if (this.docsFilesUploaded.length != 0) {
        if (
          this.selected_property != undefined &&
          this.unit_data != undefined &&
          this.tenant_data != undefined &&
          this.payment_method != "" &&
          this.checkPaymentMethodDetailsNotEmpty() != false
        ) {
          this.uploading = true;

          var docs_names = [];

          for (var doc of this.docsFilesUploaded) {
            docs_names.push(doc.name);
          }

          var data = this.setupData(this.payment_id, docs_names);
          this.paymentService.addNewPayment(data).subscribe((val) => {
            if (val == "success") {
              var uploadData = this.setupUploadFiles(
                this.payment_id,
                docs_names
              );
              this.paymentService
                .uploadAllFilesAddNewPayment(uploadData)
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
  }

  setupUploadFiles(random_id: any, docs_names: any[]): FormData {
    const formdata: FormData = new FormData();

    formdata.append("docs_names", JSON.stringify(docs_names));

    var doc_count = 0;
    for (let doc of this.docsFilesUploaded) {
      doc_count++;
      formdata.append(`doc_${doc_count}`, doc);
    }

    formdata.append("payment_id", random_id);

    return formdata;
  }

  getMethodDetails(method) {
    switch (method) {
      case "cheque":
        return this.added_cheques;
      case "online":
        return {
          bank_name: this.bank_name,
          branch: this.bank_branch,
          ac_no: this.bank_no,
          bank_holder_name: this.bank_holder_name,
          iban: this.bank_iban,
          status: this.payment_status,
          purpose: this.purpose,
          amount: this.amount,
          transaction_id: this.transaction_id,
        };
      case "cash":
        return {
          details: this.cash_details,
          status: this.payment_status,
          purpose: this.purpose,
          amount: this.amount,
        };
      default:
        break;
    }
  }

  setupData(random_id: any, docs_names: any[]): string {
    var data = {
      payment_id: random_id,
      tenant_id: this.tenant_data.id,
      tenant_name: this.tenant_data.name,
      contract_id: this.contract_id,
      unit_id: this.unit_data.id,
      unit_no: this.unit_data.no,
      property_id: this.selected_property.id,
      property_name: this.selected_property.name,
      payment_method: this.payment_method,
      no_of_cheques: this.no_of_cheques,
      documents: JSON.stringify(docs_names),
      date: new Date(),
      method_details: this.getMethodDetails(this.payment_method),
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
}
