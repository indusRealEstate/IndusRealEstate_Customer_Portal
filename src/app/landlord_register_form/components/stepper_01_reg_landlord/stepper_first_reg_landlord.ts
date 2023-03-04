import { Component, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CountryDropdown } from "app/components/country-dropdown/country-dropdown";

@Component({
  selector: "stepper-one-landlord-reg",
  styleUrls: ["./stepper_first_reg_landlord.scss"],
  templateUrl: "./stepper_first_reg_landlord.html",
})
export class StepperLandlordRegisterFirst {
  form: FormGroup;
  passportExpiry: any;
  selectedCountry: any;

  ngViewInitialized: boolean = false;

  constructor(private formBuilder: FormBuilder) {}

  @ViewChild(CountryDropdown)
  country_dropdown: CountryDropdown;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstname: ["", [Validators.required]],
      nationality: [""],
      mobileNumber: ["", [Validators.required]],
      email: ["", [Validators.required]],
      lastname: ["", [Validators.required]],
      city: ["", [Validators.required]],
      state: ["", [Validators.required]],
      address: ["", [Validators.required]],
      passportNo: ["", [Validators.required]],
      passportExpiry: ["", [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
    this.ngViewInitialized = true;
  }

  ngDoCheck() {
    if (this.ngViewInitialized == true) {
      this.selectedCountry = this.country_dropdown.selectedCountry;

      this.form.value.nationality = this.selectedCountry;
    }
  }

  onPassportExpiryDateChange(event): void {
    var date = new Date(event["value"]);

    var dateDay = Number(date.toISOString().split("T")[0].split("-")[2]);
    var currentDate =
      date.toISOString().split("T")[0].split("-")[0] +
      "-" +
      date.toISOString().split("T")[0].split("-")[1] +
      "-" +
      dateDay.toString();

    this.passportExpiry = currentDate;
  }
}
