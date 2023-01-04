import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { StepperFirstComponent } from './components/stepper_01/stepper_first';
import { StepperThirdComponent } from './components/stepper_03/stepper_third';
import { StepperSecondComponent } from './components/stepper_02/stepper_second';
import { StepperFourthComponent } from './components/stepper_04/stepper_fourth';
import { StepperFifthComponent } from './components/stepper_05/stepper_fifth';
import { StepperSixthComponent } from './components/stepper_06/stepper_sixth';
import { ApiService } from 'app/services/api.service';
import { AuthenticationService } from 'app/services/authentication.service';


@Component({
  selector: 'app-newPayment',
  templateUrl: './new_payment.component.html',
  styleUrls: ['./new_payment.component.scss']
})
export class NewPaymentComponent implements OnInit {
  @ViewChild(StepperFirstComponent) oneComponent: StepperFirstComponent;
  @ViewChild(StepperSecondComponent) twoComponent: StepperSecondComponent;
  @ViewChild(StepperThirdComponent) threeComponent: StepperThirdComponent;
  @ViewChild(StepperFourthComponent) fourComponent: StepperFourthComponent;
  @ViewChild(StepperFifthComponent) fiveComponent: StepperFifthComponent;
  @ViewChild(StepperSixthComponent) sixComponent: StepperSixthComponent;
  @ViewChild(MatStepper) matStepper: MatStepper;

  id: number;
  selectedIndex: number;
  oneForm: FormGroup;
  twoForm: FormGroup;
  threeForm: FormGroup;
  fourForm: FormGroup;
  fiveForm: FormGroup;
  sixForm: FormGroup;

  //-------
  stateForm1: String = '';
  stateForm2: String;
  stateForm3: String;
  stateForm4: String;
  stateForm5: String;
  stateForm6: String;

  isUserSignedIn: boolean = false;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,) { }

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(['/login']);
    }
  }


  stateDone() {
    this.stateForm1 = 'done';
  }

  ngOnInit(): void {
    this.isUserSignOut();
    this.selectedIndex = 0;
    this.activatedRoute.params.subscribe(async (params) => {
      this.id = +params?.id;
    });
  }

  ngAfterViewInit(): void {
    this.oneForm = this.oneComponent.form;
    this.twoForm = this.twoComponent.form;
    this.threeForm = this.threeComponent.form;
    this.fourForm = this.fourComponent.form;
    this.fiveForm = this.fiveComponent.form;
    this.sixForm = this.sixComponent.form;
  }

}
