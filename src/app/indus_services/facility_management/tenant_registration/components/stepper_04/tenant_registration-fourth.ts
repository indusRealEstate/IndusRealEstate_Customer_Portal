import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tenant_registration-stepper-four',
  styleUrls: ['./tenant_registration-fourth.scss'],
  templateUrl: './tenant_registration-fourth.html',
})
export class Tenant_Registration_Stepper_Fourth {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nickname: ['', [Validators.required]]
    });
  }
}
