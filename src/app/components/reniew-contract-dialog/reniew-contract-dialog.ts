import { HttpEvent, HttpEventType } from "@angular/common/http";
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { LeaseService } from "app/services/lease.service";
import { last, map, tap } from "rxjs";

@Component({
  selector: "reniew-contract-dialog",
  styleUrls: ["./reniew-contract-dialog.scss"],
  templateUrl: "./reniew-contract-dialog.html",
})
export class ReniewContractDialog implements OnInit {
  @ViewChild("fileInput") fileInput: ElementRef;

  uploading: boolean = false;
  formNotFilled: boolean = false;

  docsFilesUploaded: any[] = [];
  uploading_progress: any = 0;
  documentNotAdded: boolean = false;
  isContentLoading: boolean = true;

  docsFilesUploaded_new: File[] = [];
  removed_existing_docs: any[] = [];

  property: any;
  unit_data: any;
  owner: any;
  tenant: any;
  contract_start_date: any;
  contract_end_date: any;

  contract_new_start_date: any;
  contract_new_end_date: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ReniewContractDialog>,
    private leaseService: LeaseService
  ) {
    this.leaseService
      .getAllLeaseData({ id: data })
      .subscribe((value: any) => {
        this.property = value.prop_name;
        this.unit_data = value.unit_no;
        this.owner = value.user_name;
        this.tenant = value.tenant_name;
        this.contract_start_date = value.lease_contract_start;
        this.contract_end_date = value.lease_contract_end;

        JSON.parse(value.lease_docs).forEach((doc) => {
          this.docsFilesUploaded.push({ name: doc, old: true });
        });
      })
      .add(() => {
        this.isContentLoading = false;
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
    if (this.docsFilesUploaded_new.length == 0) {
      this.documentNotAdded = true;
      setTimeout(() => {
        this.documentNotAdded = false;
      }, 3000);
    } else {
      if (
        this.contract_new_start_date != "" &&
        this.contract_new_end_date != ""
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
        this.leaseService.reniewContract(data).subscribe(async (val) => {
          if (val == "success") {
            this.uploading_progress = 0;
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
    var data = {
      contract_start: this.contract_new_start_date,
      contract_end: this.contract_new_end_date,
      documents: JSON.stringify(docs_names),
      contract_id: random_id,
    };

    return JSON.stringify(data);
  }

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
