import { HttpEvent, HttpEventType } from "@angular/common/http";
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AdminService } from "app/services/admin.service";
import { last, map, tap } from "rxjs";
import { CountryDropdown } from "../country-dropdown/country-dropdown";

@Component({
  // standalone: true,
  selector: "edit_user_dialog",
  styleUrls: ["./edit_user_dialog.scss"],
  templateUrl: "./edit_user_dialog.html",
  // imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class EditUserDialog implements OnInit {
  @ViewChild("fileInput") fileInput: ElementRef;
  @ViewChild("fileInputImage") fileInputImage: ElementRef;

  @ViewChild("phone") phone_number_input: any;
  @ViewChild("phone_alt") phone_number_input_alt: any;

  @ViewChild("country_dropdown") country_dropdown: CountryDropdown;

  docsFilesUploaded: any[] = [];
  docsFilesUploaded_new: File[] = [];

  imgFileUploaded: File;
  imgFileBase64Uploaded: any = "";

  phoneForm: FormGroup;

  user_name: any = "";
  user_email: any = "";
  user_country_code: any = "";
  user_mobile_number: any = "";
  user_dob: any = "";
  user_alternative_country_code: any = "";
  user_alternative_number: any = "";
  user_alternative_email: any = "";
  user_nationality: any = "";
  user_gender: any = "";
  user_id_type: any = "";
  user_id_number: any = "";
  user_bank_name: any = "";
  user_bank_ac_no: any = "";
  user_bank_swift_code: any = "";
  user_bank_iban: any = "";

  formNotFilled: boolean = false;
  imageNotAdded: boolean = false;
  documentNotAdded: boolean = false;
  uploading: boolean = false;

  uploading_progress: any = 0;

  existing_img_removed: boolean = false;

  removed_existing_docs: any[] = [];

  genders: any[] = [
    { value: "male", viewValue: "Male" },
    { value: "female", viewValue: "Female" },
  ];

  idType: any[] = [
    { value: "eid", viewValue: "Emirates ID" },
    { value: "passprt", viewValue: "Passport" },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditUserDialog>,
    private adminService: AdminService,
    private formBuilder: FormBuilder
  ) {
    console.log(data);
    this.user_name = data.user_name;
    this.user_email = data.user_email;
    this.user_alternative_email = data.user_alternative_email;
    this.user_dob = data.user_dob;
    this.user_gender = data.user_gender;
    this.user_id_type = data.user_id_type;
    this.user_id_number = data.user_id_number;

    this.user_country_code = data.user_country_code_number;
    this.user_mobile_number = data.user_mobile_number;
    this.user_alternative_country_code =
      data.user_country_code_alternative_number;
    this.user_alternative_number = data.user_alternative_mobile_number;

    this.imgFileBase64Uploaded = `https://indusre.app/api/upload/user/${data.user_uid}/image/${data.user_profile_img}`;

    JSON.parse(data.user_documents).forEach((doc) => {
      this.docsFilesUploaded.push({ name: doc, old: true });
    });

    if (data.bank_details != undefined) {
      this.user_bank_ac_no = data.bank_details.bank_ac_number;
      this.user_bank_name = data.bank_details.bank_name;
      this.user_bank_iban = data.bank_details.iban;
      this.user_bank_swift_code = data.bank_details.swift_code;
    }
  }

  ngOnInit() {
    this.phoneForm = this.formBuilder.group({
      phone: [
        this.data.user_country_code_number + this.data.user_mobile_number,
        Validators.required,
      ],
      alt_phone: [
        this.data.user_alternative_mobile_number == 0
          ? ""
          : this.data.user_country_code_alternative_number +
            this.data.user_alternative_mobile_number,
      ],
    });
  }

  ngAfterViewInit() {
    if (this.country_dropdown != undefined) {
      this.country_dropdown.selectedCountry = this.data.user_nationality;
    }
  }

  onCloseDialog() {
    this.dialogRef.close();
  }

  phoneNumberChanged(event) {
    this.user_country_code = "+" + event.dialCode;
  }

  alternativePhoneNumberChanged(event) {
    this.user_alternative_country_code = "+" + event.dialCode;
  }

  removeProfileImg() {
    this.existing_img_removed = true;
    this.imgFileBase64Uploaded = "";
    this.imgFileUploaded = null;
  }

  onImageSelected(files: Array<any>) {
    this.imgFileUploaded = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      this.imgFileBase64Uploaded = event.target.result;
    };
  }

  onFileSelected(files: Array<any>) {
    for (var item of files) {
      this.docsFilesUploaded.push(item);
      this.docsFilesUploaded_new.push(item);
    }
    this.fileInput.nativeElement.value = "";
  }

  removeUploadedDoc(index, file) {
    if (this.docsFilesUploaded_new.includes(file)) {
      var i = this.docsFilesUploaded_new.findIndex((f) => f.name == file.name);
      this.docsFilesUploaded_new.splice(i, 1);
    } else {
      this.removed_existing_docs.push(file);
    }
    this.docsFilesUploaded.splice(index, 1);
  }

  checkUrlContainsSpace(url: string) {
    if (url.includes(" ")) {
      return true;
    } else {
      return false;
    }
  }

  onSubmit() {
    this.user_mobile_number = this.phone_number_input.phoneNumber;
    this.user_alternative_number = this.phone_number_input_alt.phoneNumber;
    if (this.docsFilesUploaded.length != 0) {
      if (
        this.user_name != "" &&
        this.user_email != "" &&
        this.user_mobile_number != "" &&
        this.user_id_type != "" &&
        this.user_id_number != ""
      ) {
        this.uploading = true;
        var random_id = this.data.user_uid;

        var docs_names = [];
        var docs_names_new = [];

        for (var doc of this.docsFilesUploaded) {
          docs_names.push(doc.name);
          if (doc.old == undefined) {
            docs_names_new.push(doc.name);
          }
        }

        var data = this.setupData(random_id, docs_names);
        this.adminService.editUser(data).subscribe((val) => {
          if (val == "success") {
            if (
              this.existing_img_removed == true ||
              this.removed_existing_docs.length != 0
            ) {
              this.adminService
                .deleteRemovedUserFiles(
                  JSON.stringify({
                    img:
                      this.existing_img_removed == true
                        ? this.data.user_profile_img
                        : "",
                    names: this.removed_existing_docs,
                    id: this.data.user_uid,
                  })
                )
                .subscribe((res) => {
                  console.log(res);
                });
            }

            var uploadData = this.setupUploadFiles(random_id, docs_names_new);
            this.adminService
              .uploadAllFilesAddUser(uploadData)
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

    if (this.user_bank_name != "" && this.user_bank_ac_no != "") {
      var bank_data = {
        user_id: random_id,
        bank_name: this.user_bank_name,
        bank_ac_number: this.user_bank_ac_no,
        swift_code: this.user_bank_swift_code,
        iban: this.user_bank_iban,
      };
      this.adminService
        .addUserBankDetails(JSON.stringify(bank_data))
        .subscribe((val) => {});
    }
  }

  setupUploadFiles(random_id: any, docs_names: any[]): FormData {
    const formdata: FormData = new FormData();

    formdata.append(
      "img",
      this.existing_img_removed == true ? this.imgFileUploaded : ""
    );
    formdata.append("docs_names", JSON.stringify(docs_names));

    var doc_count = 0;
    for (let doc of this.docsFilesUploaded_new) {
      doc_count++;
      formdata.append(`doc_${doc_count}`, doc);
    }

    formdata.append("user_id", random_id);

    return formdata;
  }

  setupData(random_id: any, docs_names: any[]): string {
    var data = {
      user_id: random_id,
      name: this.user_name,
      country_code_number: this.user_country_code,
      mobile_number: this.user_mobile_number,
      country_code_alternative_number: this.user_alternative_country_code,
      alternative_mobile_number: this.user_alternative_number,
      email: this.user_email,
      alternative_email: this.user_alternative_email,
      id_type: this.user_id_type,
      id_number: this.user_id_number,
      gender: this.user_gender,
      nationality: this.country_dropdown.selectedCountry,
      dob: this.user_dob,
      profile_img:
        this.existing_img_removed == true
          ? this.imgFileUploaded.name
          : this.data.user_profile_img,
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
