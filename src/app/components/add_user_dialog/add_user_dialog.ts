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
    private adminService: AdminService,
    private formBuilder: FormBuilder
  ) {}

  @ViewChild("fileInput") fileInput: ElementRef;
  @ViewChild("fileInputImage") fileInputImage: ElementRef;

  @ViewChild("phone") phone_number_input: any;
  @ViewChild("phone_alt") phone_number_input_alt: any;

  @ViewChild("country_dropdown") country_dropdown: CountryDropdown;

  docsFilesUploaded: File[] = [];
  docsFilesBase64Uploaded: any[] = [];

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
      const reader = new FileReader();
      reader.readAsDataURL(item);
      reader.onload = (event) => {
        this.docsFilesBase64Uploaded.push(event.target.result);
      };
    }
    this.fileInput.nativeElement.value = "";
  }

  removeUploadedDoc(index) {
    this.docsFilesUploaded.splice(index, 1);
    this.docsFilesBase64Uploaded.splice(index, 1);
  }

  onSubmit() {
    this.user_mobile_number = this.phone_number_input.phoneNumber;
    this.user_alternative_number = this.phone_number_input_alt.phoneNumber;
    if (this.docsFilesUploaded.length != 0) {
      if (
        this.user_name != "" &&
        this.user_email != "" &&
        this.user_mobile_number != ""
      ) {
        this.uploading = true;
        var random_id = uuid.v4();

        var docs_names = [];

        for (var doc of this.docsFilesUploaded) {
          docs_names.push(doc.name);
        }

        var data = this.setupData(random_id, docs_names);
        this.adminService.addUser(data).subscribe((val) => {
          if (val == "success") {
            var uploadData = this.setupUploadFiles(random_id, docs_names);
            this.adminService
              .uploadAllFilesAddUser(uploadData)
              .subscribe((va) => {
                this.uploading = false;
                this.dialogRef.close();
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

  setupUploadFiles(random_id: any, docs_names: any[]): string {
    var data = {
      user_id: random_id,
      img_file: this.imgFileBase64Uploaded,
      doc_files: this.docsFilesBase64Uploaded,
      img_name: this.imgFileUploaded.name,
      doc_names: docs_names,
    };

    return JSON.stringify(data);
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
      gender: this.user_gender,
      nationality: this.country_dropdown.selectedCountry,
      dob: this.user_dob,
      allocated_unit: "",
      property_id: "",
      profile_img: this.imgFileUploaded.name,
      documents: JSON.stringify(docs_names),
    };

    return JSON.stringify(data);
  }
}
