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
  ) {}

  @ViewChild("fileInput") fileInput: ElementRef;
  @ViewChild("fileInputImage") fileInputImage: ElementRef;

  @ViewChild("country_dropdown") country_dropdown: CountryDropdown;

  docsFilesUploaded: File[] = [];

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
  cheque_name: any;
  cheque_date: any;

  cash_details: any;

  bank_name: any;
  bank_branch: any;
  bank_no: any;
  bank_iban: any;
  bank_holder_name: any;

  property_not_selected: boolean = false;

  formNotFilled: boolean = false;
  documentNotAdded: boolean = false;
  uploading: boolean = false;

  uploading_progress: any = 0;

  purpose_list: any[] = [
    { value: "rent", viewValue: "Rent" },
    { value: "security_deposit", viewValue: "Security Deposit" },
    { value: "maintenance", viewValue: "Maintenance" },
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
      if (
        this.cheque_no != undefined &&
        this.cheque_name != undefined &&
        this.cheque_date != undefined
      ) {
        return true;
      } else {
        return false;
      }
    } else if (this.payment_method == "online") {
      if (
        this.bank_name != undefined &&
        this.bank_holder_name != undefined &&
        this.bank_no != undefined
      ) {
        return true;
      } else {
        return false;
      }
    } else if (this.payment_method == "cash") {
      if (this.cash_details != undefined) {
        return true;
      } else {
        return false;
      }
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
        this.purpose != "" &&
        this.payment_method != "" &&
        this.payment_status != "" &&
        this.amount != "" &&
        this.checkPaymentMethodDetailsNotEmpty() != false
      ) {
        this.uploading = true;
        var random_id = uuid.v4();

        var docs_names = [];

        for (var doc of this.docsFilesUploaded) {
          docs_names.push(doc.name);
        }

        var data = this.setupData(random_id, docs_names);
        this.paymentService.addNewPayment(data).subscribe((val) => {
          if (val == "success") {
            var uploadData = this.setupUploadFiles(random_id, docs_names);
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
        return {
          cheque_no: this.cheque_no,
          cheque_date: this.cheque_date,
          name_on_cheque: this.cheque_name,
        };
      case "online":
        return {
          bank_name: this.bank_name,
          branch: this.bank_branch,
          ac_no: this.bank_no,
          bank_holder_name: this.bank_holder_name,
          iban: this.bank_iban,
        };
      case "cash":
        return {
          details: this.cash_details,
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
      amount: this.amount,
      purpose: this.purpose,
      payment_method: this.payment_method,
      status: this.payment_status,
      documents: JSON.stringify(docs_names),
      date: this.issued_date,
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
