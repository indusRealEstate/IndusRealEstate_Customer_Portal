import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'fm-maintanence-stepper-two',
  styleUrls: ['./fm-maintanence-second.scss'],
  templateUrl: './fm-maintanence-second.html'

})
export class FM_MaintananceRequest_Stepper_Second {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nickname: ['', [Validators.required]]
    });
  }
}
