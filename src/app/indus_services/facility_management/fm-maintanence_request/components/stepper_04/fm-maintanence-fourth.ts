import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'fm-maintanence-stepper-four',
  styleUrls: ['./fm-maintanence-fourth.scss'],
  templateUrl: './fm-maintanence-fourth.html',
})
export class FM_MaintananceRequest_Stepper_Fourth {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nickname: ['', [Validators.required]]
    });
  }
}
