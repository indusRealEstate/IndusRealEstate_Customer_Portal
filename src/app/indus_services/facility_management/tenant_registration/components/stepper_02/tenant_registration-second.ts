import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tenant_registration-stepper-two',
  styleUrls: ['./tenant_registration-second.scss'],
  templateUrl: './tenant_registration-second.html'

})
export class Tenant_Registration_Stepper_Second {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nickname: ['', [Validators.required]]
    });
  }
}
