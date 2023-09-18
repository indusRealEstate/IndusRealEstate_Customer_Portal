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
import { UserService } from "app/services/user.service";
import { last, map, tap } from "rxjs";
import * as uuid from "uuid";
import { CountryDropdown } from "../country-dropdown/country-dropdown";

@Component({
  // standalone: true,
  selector: "add_user_dialog",
  styleUrls: ["./add_user_dialog.scss"],
  templateUrl: "./add_user_dialog.html",
  // imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class AddUserDialog implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddUserDialog>,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  @ViewChild("fileInput") fileInput: ElementRef;
  @ViewChild("fileInputImage") fileInputImage: ElementRef;

  @ViewChild("phone") phone_number_input: any;
  @ViewChild("phone_alt") phone_number_input_alt: any;

  @ViewChild("country_dropdown") country_dropdown: CountryDropdown;

  docsFilesUploaded: File[] = [];

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
  user_id_expiry: any = "";
  user_bank_name: any = "";
  user_bank_ac_no: any = "";
  user_bank_swift_code: any = "";
  user_bank_iban: any = "";

  formNotFilled: boolean = false;
  // imageNotAdded: boolean = false;
  documentNotAdded: boolean = false;
  uploading: boolean = false;

  uploading_progress: any = 0;

  genders: any[] = [
    { value: "male", viewValue: "Male" },
    { value: "female", viewValue: "Female" },
  ];

  idType: any[] = [
    { value: "eid", viewValue: "Emirates ID" },
    { value: "passprt", viewValue: "Passport" },
  ];

  ngOnInit() {
    this.phoneForm = this.formBuilder.group({
      phone: ["", Validators.required],
      alt_phone: [""],
    });
  }

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close();
  }

  phoneNumberChanged(event) {
    this.user_country_code = "+" + event.dialCode;
    // if (this.phone_number_input != undefined) {
    //   this.user_mobile_number = this.phone_number_input.phoneNumber;
    // }
  }

  alternativePhoneNumberChanged(event) {
    this.user_alternative_country_code = "+" + event.dialCode;
  }

  removeProfileImg() {
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
    }
    this.fileInput.nativeElement.value = "";
  }

  removeUploadedDoc(index) {
    this.docsFilesUploaded.splice(index, 1);
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
        var random_id = uuid.v4();

        var docs_names = [];

        for (var doc of this.docsFilesUploaded) {
          docs_names.push(doc.name);
        }

        var data = this.setupData(random_id, docs_names);
        this.userService.addUser(data).subscribe((val) => {
          if (val == "success") {
            var uploadData = this.setupUploadFiles(random_id, docs_names);
            this.userService
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
      this.userService
        .addUserBankDetails(JSON.stringify(bank_data))
        .subscribe((val) => {});
    }
  }

  setupUploadFiles(random_id: any, docs_names: any[]): FormData {
    const formdata: FormData = new FormData();

    formdata.append("img", this.imgFileUploaded);
    formdata.append("docs_names", JSON.stringify(docs_names));

    var doc_count = 0;
    for (let doc of this.docsFilesUploaded) {
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
      user_type: "new_user",
      email: this.user_email,
      alternative_email: this.user_alternative_email,
      id_type: this.user_id_type,
      id_number: this.user_id_number,
      id_expiry: this.user_id_expiry,
      gender: this.user_gender,
      nationality: this.country_dropdown.selectedCountry,
      dob: this.user_dob,
      allocated_unit: "",
      profile_img:
        this.imgFileUploaded != undefined ? this.imgFileUploaded.name : "",
      documents: JSON.stringify(docs_names),
      joined_date: new Date(),
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
