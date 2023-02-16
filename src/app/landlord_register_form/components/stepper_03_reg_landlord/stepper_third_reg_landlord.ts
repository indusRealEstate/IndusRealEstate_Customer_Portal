import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { DocUploadDialogLandlordRegister } from "./dialog/dialog";

@Component({
  selector: "stepper-three-landlord-reg",
  styleUrls: ["./stepper_third_reg_landlord.scss"],
  templateUrl: "./stepper_third_reg_landlord.html",
})
export class StepperLandlordRegisterThird {
  form: FormGroup;

  passPortPic_front: any;
  passPortPic_back: any;
  emiratesIDPics_front: any;
  emiratesIDPics_back: any;
  ownerShipDoc: any;
  salesDeedDoc: any;

  isPassportUploaded: boolean = false;

  allDocsCollected: boolean = false;
  constructor(private formBuilder: FormBuilder, private dialog?: MatDialog) {}

  ngOnInit(): void {}

  // pickPassport(event: any) {
  //   var file = event.target.files[0];
  //   var reader = new FileReader();
  //   reader.readAsDataURL(file);

  //   reader.onloadend = (e) => {
  //     this.secondPartySignature = e.target.result;

  //     this.secondPartySignatureName =
  //       this.form.value["projectName"] + "-" + "signature";
  //   };
  // }

  openDialog(upload: any) {
    this.dialog
      .open(DocUploadDialogLandlordRegister, {
        width: "700px",
        height: "450px",
        data: { upload: upload },
      })
      .afterClosed()
      .subscribe((res) => {
        console.log(res);
      });
  }
}
