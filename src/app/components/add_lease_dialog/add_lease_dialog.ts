import { HttpEvent, HttpEventType } from "@angular/common/http";
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AdminService } from "app/services/admin.service";
import { last, map, tap } from "rxjs";
import * as uuid from "uuid";
import { CountryDropdown } from "../country-dropdown/country-dropdown";

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
    private adminService: AdminService
  ) {
    this.getAllDropdowns();

    if (data != null) {
      // console.log(data);
      if (this.properties != null) {
        this.selectProperty({ value: data.prop_id });
        this.property_id = data.prop_id;

        setTimeout(() => {
          if (this.units.length != 0) {
            var un = this.units.find((u) => u.value == data.unit_id);
            this.selectUnit({ value: un });
            this.unit_data = un;
          }
        }, 2000);
      }
    }
  }

  @ViewChild("fileInput") fileInput: ElementRef;
  @ViewChild("fileInputImage") fileInputImage: ElementRef;

  @ViewChild("country_dropdown") country_dropdown: CountryDropdown;

  docsFilesUploaded: File[] = [];

  property_id: any = "";
  unit_data: any = "";
  owner: any = "Select a Unit";
  owner_id: any = "";
  tenant_id: any = "";
  contract_start_date: any = "";
  contract_end_date: any = "";
  move_in_date: any = "";
  move_out_date: any = "";
  notice_period: any = "";
  purpose: any = "";
  payment_currency: any = "";
  payment_method: any = "";
  rent_amount: any = "";
  payment_frequency: any = "";
  govt_charges: any = "";
  security_deposit: any = "";

  formNotFilled: boolean = false;
  documentNotAdded: boolean = false;
  uploading: boolean = false;

  uploading_progress: any = 0;

  properties: any[] = [];
  units: any[] = [];
  users: any[] = [];

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

  payment_frequency_list: any[] = [
    { value: "monthly", viewValue: "Monthly" },
    { value: "quaterly", viewValue: "Quaterly" },
    { value: "half_yearly", viewValue: "Half Yearly" },
    { value: "yearly", viewValue: "Yearly" },
  ];

  getAllDropdowns() {
    this.adminService.getallPropertiesAdmin().subscribe((val: any[]) => {
      val.forEach((prop) =>
        this.properties.push({
          value: prop.property_id,
          viewValue: prop.property_name,
        })
      );
    });

    this.adminService.getAllUsersAdmin().subscribe((val: any[]) => {
      val.forEach((user) =>
        this.users.push({
          value: user.user_id,
          user_type: user.user_type,
          viewValue: user.name,
        })
      );
    });
  }

  selectUnit(event: any) {
    var e = this.users.find((u) => u.value == event.value.owner_id);
    this.owner = e.viewValue;
    this.owner_id = e.value;
  }

  selectProperty(event: any) {
    this.units = [];
    this.adminService.getallPropertiesUnitsAdmin().subscribe((val: any[]) => {
      val.forEach((un) => {
        if (un.property_id == event.value) {
          this.units.push({
            value: un.unit_id,
            viewValue: un.unit_no,
            owner_id: un.owner_id,
          });
        }
      });
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {}

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
        this.property_id != "" &&
        this.unit_data != "" &&
        this.tenant_id != "" &&
        this.contract_start_date != "" &&
        this.contract_end_date != "" &&
        this.notice_period != "" &&
        this.purpose != "" &&
        this.payment_currency != "" &&
        this.payment_frequency != "" &&
        this.payment_method != "" &&
        this.rent_amount != "" &&
        this.security_deposit != ""
      ) {
        this.uploading = true;
        var random_id = uuid.v4();

        var docs_names = [];

        for (var doc of this.docsFilesUploaded) {
          docs_names.push(doc.name);
        }

        var data = this.setupData(random_id, docs_names);
        this.adminService.addNewLease(data).subscribe((val) => {
          if (val == "success") {
            var uploadData = this.setupUploadFiles(random_id, docs_names);
            this.adminService
              .uploadAllFilesAddNewLease(uploadData)
              .pipe(
                map((event) => this.getEventMessage(event)),
                tap((message) => {
                  if (message == "File was completely uploaded!") {
                    this.dialogRef.close();
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
    var data = {
      contract_id: random_id,
      property_id: this.property_id,
      unit_id: this.unit_data.value,
      owner_id: this.owner_id,
      tenant_id: this.tenant_id,
      status: "inactive",
      contract_start: this.contract_start_date,
      contract_end: this.contract_end_date,
      move_in: this.move_in_date,
      move_out: this.move_out_date,
      notice_period: this.notice_period,
      purpose: this.purpose,
      payment_currency: this.payment_currency,
      rent_amount: this.rent_amount,
      payment_frequency: this.payment_frequency,
      govt_charges: this.govt_charges,
      security_deposit: this.security_deposit,
      documents: JSON.stringify(docs_names),
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
