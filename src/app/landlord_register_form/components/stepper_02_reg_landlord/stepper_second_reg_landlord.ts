import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "stepper-two-landlord-reg",
  styleUrls: ["./stepper_second_reg_landlord.scss"],
  templateUrl: "./stepper_second_reg_landlord.html",
})
export class StepperLandlordRegisterSecond {
  form: FormGroup;
  propertyState: "sale" | "rent" = "rent";
  offerValidity: any;
  validUntil: any;
  secondPartySignature: any = "";
  secondPartySignatureExt: any = "";

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      titleDeedNo: ["", [Validators.required]],
      offerValidity: ["01/01/2024", [Validators.required]],
      projectName: ["", [Validators.required]],
      sizeArea: ["", [Validators.required]],
      community: ["", [Validators.required]],
      unitNo: ["", [Validators.required]],
      buildingNo: ["", [Validators.required]],
      carparkingNo: ["", [Validators.required]],
      bedroomNo: ["", [Validators.required]],
      furnishDetails: ["", [Validators.required]],
      additionalInfo: ["", [Validators.required]],
      marketing01: ["", [Validators.required]],
      marketing02: ["", [Validators.required]],
      marketing03: ["", [Validators.required]],
      validUntil: ["01/01/2024", [Validators.required]],
    });
  }

  onOfferValidityDate(event): void {
    var date = new Date(event["value"]);

    var dateDay = Number(date.toISOString().split("T")[0].split("-")[2]) + 1;
    var currentDate =
      date.toISOString().split("T")[0].split("-")[0] +
      "-" +
      date.toISOString().split("T")[0].split("-")[1] +
      "-" +
      dateDay.toString();

    this.offerValidity = currentDate;
  }

  onValidUntilDate(event): void {
    var date = new Date(event["value"]);

    var dateDay = Number(date.toISOString().split("T")[0].split("-")[2]) + 1;
    var currentDate =
      date.toISOString().split("T")[0].split("-")[0] +
      "-" +
      date.toISOString().split("T")[0].split("-")[1] +
      "-" +
      dateDay.toString();

    this.validUntil = currentDate;
  }

  pickSignature(event: any) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = (e) => {
      this.secondPartySignature = e.target.result;
      var signPart1 = e.target.result.toString().split(';base64,')[0];
      this.secondPartySignatureExt = signPart1.split('/')[1];
    };
  }

  clearSignature() {
    this.secondPartySignature = "";
  }
}
