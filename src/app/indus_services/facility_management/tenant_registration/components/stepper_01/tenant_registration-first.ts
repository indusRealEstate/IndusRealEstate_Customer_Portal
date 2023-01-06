import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tenant_registration-stepper-one',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
  styleUrls: ['./tenant_registration-first.scss'],
  templateUrl: './tenant_registration-first.html'
})
export class Tenant_Registration_Stepper_First {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private matSnackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // this.form = this.formBuilder.group({
    //   fullName: ['', [Validators.required]]
    // });
  }
}
