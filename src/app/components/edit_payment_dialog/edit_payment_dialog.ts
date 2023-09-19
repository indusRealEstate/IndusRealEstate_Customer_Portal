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
import { CountryDropdown } from "../country-dropdown/country-dropdown";
import { PaginatorDialog } from "../paginator-dialog/paginator-dialog";

@Component({
  // standalone: true,
  selector: "edit_payment_dialog",
  styleUrls: ["./edit_payment_dialog.scss"],
  templateUrl: "./edit_payment_dialog.html",
  // imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class EditPaymentDialog implements OnInit {
  isContentLoading: boolean = true;
  docsFilesUploaded: any[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditPaymentDialog>,
    private paymentService: PaymentService,
    private dialog: MatDialog
  ) {
    paymentService
      .getPaymentAllDetails(
        JSON.stringify({
          payment_id: data.id,
          method: data.method,
        })
      )
      .subscribe((res) => {
        console.log(res);

        this.selected_property = {
          id: res.property_id,
          name: res.property_name,
        };

        this.unit_data = {
          id: res.unit_id,
          no: res.unit_no,
        };

        this.tenant_data = {
          id: res.tenant_uid,
          name: res.tenant_name,
        };

        this.contract_id = res.contract_id;

        this.no_of_cheques = res.payment_no_of_cheques;

        this.payment_method = res.payment_method;
        this.issued_date = res.payment_date;

        if (res.payment_method == "online") {
          this.bank_name = res.payment_bank_name;
          this.bank_branch = res.payment_bank_branch;
          this.bank_no = res.payment_bank_ac_no;
          this.bank_iban = res.payment_bank_iban;
          this.bank_holder_name = res.payment_bank_holder_name;
          this.amount = res.payment_online_amount;
          this.purpose = res.payment_online_purpose;
          this.payment_status = res.payment_online_status;
          this.transaction_id = res.payment_bank_transaction_id;
        } else if (res.payment_method == "cash") {
          this.cash_details = res.payment_cash_details;
          this.amount = res.payment_cash_amount;
          this.purpose = res.payment_cash_purpose;
          this.payment_status = res.payment_cash_status;
        }

        JSON.parse(res.payment_documents).forEach((doc) => {
          this.docsFilesUploaded.push({ name: doc, old: true });
        });

        if (res.payment_method == "cheque") {
          res.cheques.forEach((ch) => {
            this.added_cheques.push({
              no: ch.cheque_no,
              name: ch.name_on_cheque,
              date: ch.cheque_date,
              purpose: this.purpose_list.find((p) => p.viewValue == ch.purpose)
                .viewValue,
              status: this.payment_status_list.find(
                (s) => s.viewValue == ch.status
              ).viewValue,

              amount: ch.amount,
              old: true,
              id: ch.id,
            });
          });
        }
      })
      .add(() => {
        this.isContentLoading = false;
      });
  }

  @ViewChild("fileInput") fileInput: ElementRef;
  @ViewChild("fileInputImage") fileInputImage: ElementRef;

  @ViewChild("country_dropdown") country_dropdown: CountryDropdown;

  docsFilesUploaded_new: File[] = [];
  removed_existing_docs: any[] = [];
  added_cheques: any[] = [];

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
  bank_issued_date: any;

  property_not_selected: boolean = false;

  formNotFilled: boolean = false;
  documentNotAdded: boolean = false;
  uploading: boolean = false;

  uploading_progress: any = 0;

  no_of_cheques: any = "";

  removed_cheques: any[] = [];

  new_cheques: any[] = [];

  transaction_id: any;

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
        this.purpose != "" &&
        this.payment_status != "" &&
        this.amount != "" &&
        this.transaction_id != "" &&
        this.bank_issued_date != ""
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

      if (this.edit_index != undefined) {
        this.added_cheques[this.edit_index] = {
          no: this.cheque_no,
          name: this.cheque_name,
          date: this.cheque_date,
          purpose: this.purpose_list.find((p) => p.value == this.purpose)
            .viewValue,
          status: this.payment_status_list.find(
            (s) => s.value == this.payment_status
          ).viewValue,

          amount: this.amount,
        };

        if(this.added_cheques[this.edit_index].old == undefined){
          var index = this.new_cheques.findIndex((nc)=> nc.no == this.added_cheques[this.edit_index].no);
          this.new_cheques[index] = {
            no: this.cheque_no,
            name: this.cheque_name,
            date: this.cheque_date,
            purpose: this.purpose_list.find((p) => p.value == this.purpose)
              .viewValue,
            status: this.payment_status_list.find(
              (s) => s.value == this.payment_status
            ).viewValue,
  
            amount: this.amount,
          };
        }

        this.edit_index = undefined;
      } else {
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
          old: false,
        });
  
        this.new_cheques.push({
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
      }
      

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

  deleteCheque(index, cheque) {
    this.added_cheques.splice(index, 1);

    if (cheque.old == true) {
      this.removed_cheques.push(cheque.id);
    } else {
      this.new_cheques.splice(index, 1);
    }
  }

  edit_index: any;

  editCheque(index, cheque) {
    this.edit_index = index;
    this.added_cheques[index].edit = true;
    this.cheque_no = cheque.no;
    this.cheque_name = cheque.name;
    this.cheque_date = cheque.date;
    this.purpose = this.purpose_list.find(
      (pr) => pr.viewValue == cheque.purpose
    ).value;
    this.payment_status = this.payment_status_list.find(
      (st) => st.viewValue == cheque.status
    ).value;
    this.amount = cheque.amount;
  }

  ngOnInit() {}

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
        this.selected_property != undefined &&
        this.unit_data != undefined &&
        this.tenant_data != undefined &&
        this.payment_method != "" &&
        this.checkPaymentMethodDetailsNotEmpty() != false
      ) {
        this.uploading = true;
        var random_id = this.data.id;

        var docs_names = [];
        var docs_names_new = [];

        for (var doc of this.docsFilesUploaded) {
          docs_names.push(doc.name);
          if (doc.old == undefined) {
            docs_names_new.push(doc.name);
          }
        }

        var data = this.setupData(random_id, docs_names);
        this.paymentService.editPayment(data).subscribe((val) => {
          if (val == "success") {
            var uploadData = this.setupUploadFiles(random_id, docs_names_new);
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
                // console.log(v);
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

    if (this.removed_existing_docs.length != 0) {
      formdata.append(
        "deleted_doc",
        JSON.stringify(this.removed_existing_docs)
      );
    }

    formdata.append("docs_names", JSON.stringify(docs_names));

    var doc_count = 0;
    for (let doc of this.docsFilesUploaded_new) {
      doc_count++;
      formdata.append(`doc_${doc_count}`, doc);
    }

    formdata.append("payment_id", random_id);

    return formdata;
  }

  getMethodDetails(method) {
    switch (method) {
      case "cheque":
        return this.new_cheques;
      case "online":
        return {
          bank_name: this.bank_name,
          bank_holder_name: this.bank_holder_name,
          bank_issued_date : this.bank_issued_date,
          transaction_id : this.transaction_id,
          status: this.payment_status,
          purpose: this.purpose,
          amount: this.amount,
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
      date: this.issued_date,
      removed_cheques: this.removed_cheques,
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
