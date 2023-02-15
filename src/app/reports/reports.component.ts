import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { StepperLandlordRegisterFirst } from "./components/stepper_01_reg_landlord/stepper_first_reg_landlord";
import { StepperLandlordRegisterSecond } from "./components/stepper_02_reg_landlord/stepper_second_reg_landlord";
import { StepperLandlordRegisterThird } from "./components/stepper_03_reg_landlord/stepper_third_reg_landlord";

@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.scss"],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class ReportsComponent implements OnInit {
  selectedReport: any = "--None--";
  selectedDateRange: any = "--None--";
  isUserSignedIn: boolean = false;

  isloading: boolean = false;

  @ViewChild(StepperLandlordRegisterFirst)
  firstStepper: StepperLandlordRegisterFirst;
  @ViewChild(StepperLandlordRegisterSecond)
  secondStepper: StepperLandlordRegisterSecond;
  @ViewChild(StepperLandlordRegisterThird)
  thirdStepper: StepperLandlordRegisterThird;
  @ViewChild(MatStepper) matStepper: MatStepper;

  @ViewChild("LandlordRegStepper")
  stepper: MatStepper;

  LandlordRegStep01Form: FormGroup;
  LandlordRegStep02Form: FormGroup;
  LandlordRegStep03Form: FormGroup;

  isFormNotFilled: boolean = false;

  selectedIndex: number;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute
  ) {
    this.isloading = true;
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.route.queryParams.subscribe((e) => {
      if (e == null) {
        router.navigate([`/reports`], {
          queryParams: { uid: user[0]["id"] },
        });
      } else if (e != user[0]["id"]) {
        router.navigate([`/reports`], {
          queryParams: { uid: user[0]["id"] },
        });
      }
    });
  }

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }
  ngOnInit() {
    this.isUserSignOut();
    this.selectedIndex = 1;
  }

  ngAfterViewInit(): void {
    this.LandlordRegStep01Form = this.firstStepper.form;
    this.LandlordRegStep02Form = this.secondStepper.form;
    this.LandlordRegStep03Form = this.thirdStepper.form;

    setTimeout(() => {
      this.isloading = false;
    }, 1000);
  }

  stepperNextClick() {
    if (this.firstStepper.form.valid) {
      this.isFormNotFilled = false;
      this.stepper.next();
    } else {
      this.isFormNotFilled = true;

      setTimeout(() => {
        this.isFormNotFilled = false;
      }, 4000);
    }
  }
}
