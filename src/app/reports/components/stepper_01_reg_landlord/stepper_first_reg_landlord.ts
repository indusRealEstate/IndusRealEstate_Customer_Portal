import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "stepper-one-landlord-reg",
  styleUrls: ["./stepper_first_reg_landlord.scss"],
  templateUrl: "./stepper_first_reg_landlord.html",
})
export class StepperLandlordRegisterFirst {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstname: ["", [Validators.required]],
      nationality: ["", [Validators.required]],
      mobileNumber: ["", [Validators.required]],
      email: ["", [Validators.required]],
      lastname: ["", [Validators.required]],
      city: ["", [Validators.required]],
      state: ["", [Validators.required]],
      address: ["", [Validators.required]],
      password: ["", [Validators.required]],
      passwordRetype: ["", [Validators.required]],
      passportNo: ["", [Validators.required]],
      passportExpiry: ["", [Validators.required]],
    });
  }
}
