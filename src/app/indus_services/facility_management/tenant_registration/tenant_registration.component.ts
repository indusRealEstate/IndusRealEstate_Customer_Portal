import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'app/services/api.service';
import { AuthenticationService } from 'app/services/authentication.service';
import { Tenant_Registration_Stepper_First } from './components/stepper_01/tenant_registration-first';
import { Tenant_Registration_Stepper_Second } from './components/stepper_02/tenant_registration-second';
import { Tenant_Registration_Stepper_Third } from './components/stepper_03/tenant_registration-third';
import { Tenant_Registration_Stepper_Fourth } from './components/stepper_04/tenant_registration-fourth';
import { Tenant_Registration_Stepper_Fifth } from './components/stepper_05/tenant_registration-fifth';
import { Tenant_Registration_Stepper_Sixth } from './components/stepper_06/tenant_registration-sixth';


@Component({
  selector: 'tenant_registration',
  templateUrl: './tenant_registration.component.html',
  styleUrls: ['./tenant_registration.component.scss']
})
export class Tenant_Registration implements OnInit {
  @ViewChild(Tenant_Registration_Stepper_First) oneComponent: Tenant_Registration_Stepper_First;
  @ViewChild(Tenant_Registration_Stepper_Second) twoComponent: Tenant_Registration_Stepper_Second;
  @ViewChild(Tenant_Registration_Stepper_Third) threeComponent: Tenant_Registration_Stepper_Third;
  @ViewChild(Tenant_Registration_Stepper_Fourth) fourComponent: Tenant_Registration_Stepper_Fourth;
  @ViewChild(Tenant_Registration_Stepper_Fifth) fiveComponent: Tenant_Registration_Stepper_Fifth;
  @ViewChild(Tenant_Registration_Stepper_Sixth) sixComponent: Tenant_Registration_Stepper_Sixth;
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
