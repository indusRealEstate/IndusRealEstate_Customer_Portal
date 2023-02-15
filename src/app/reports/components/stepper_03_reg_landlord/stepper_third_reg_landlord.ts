import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'stepper-three-landlord-reg',
  styleUrls: ['./stepper_third_reg_landlord.scss'],
  templateUrl: './stepper_third_reg_landlord.html',

})
export class StepperLandlordRegisterThird {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nickname: ['', [Validators.required]]
    });
  }

}
