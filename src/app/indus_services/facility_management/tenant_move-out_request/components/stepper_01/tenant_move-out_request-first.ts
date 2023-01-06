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
  selector: 'tenant_move-out_request-stepper-one',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
  styleUrls: ['./tenant_move-out_request-first.scss'],
  templateUrl: './tenant_move-out_request-first.html'
})
export class Tenant_Move_out_Request_Stepper_First {
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
