import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "stepper-two-tenant-reg",
  styleUrls: ["./stepper_second_reg_tenant.scss"],
  templateUrl: "./stepper_second_reg_tenant.html",
})
export class StepperTenantRegisterSecond {
  form: FormGroup;
  propertyUsage: "industrial" | "commercial" | "residential" = "industrial";

  contract_to: any;
  contract_from: any;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      propertyUsage: ["industrial", [Validators.required]],
      landlordName: ["", [Validators.required]],
      buildingName: ["", [Validators.required]],
      contract_to: ["", [Validators.required]],
      contract_from: ["", [Validators.required]],
      property_size: ["", [Validators.required]],
      property_type: ["", [Validators.required]],
      propertyNo: ["", [Validators.required]],
      location: ["", [Validators.required]],
      premisesNo: ["", [Validators.required]],
      annualRent: ["", [Validators.required]],
      contractValue: ["", [Validators.required]],
      security_deposit_amnt: ["", [Validators.required]],
      mode_of_payment: ["", [Validators.required]],
    });
  }

  onContractToDateChange(event): void {
    var date = new Date(event["value"]);

    var dateDay = Number(date.toISOString().split("T")[0].split("-")[2]) + 1;
    var currentDate =
      date.toISOString().split("T")[0].split("-")[0] +
      "-" +
      date.toISOString().split("T")[0].split("-")[1] +
      "-" +
      dateDay.toString();

    this.contract_to = currentDate;
  }

  onContractFromDateChange(event): void {
    var date = new Date(event["value"]);

    var dateDay = Number(date.toISOString().split("T")[0].split("-")[2]) + 1;
    var currentDate =
      date.toISOString().split("T")[0].split("-")[0] +
      "-" +
      date.toISOString().split("T")[0].split("-")[1] +
      "-" +
      dateDay.toString();

    this.contract_from = currentDate;
  }
}
