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
  selector: 'stepper-one',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
  styleUrls:['./stepper_first.scss'],
  templateUrl:'./stepper_first.html'
})
export class StepperFirstComponent {
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
