import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'tenant_registration-stepper-three',
  styleUrls: ['./tenant_registration-third.scss'],
  templateUrl: './tenant_registration-third.html',

})
export class Tenant_Registration_Stepper_Third {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nickname: ['', [Validators.required]]
    });
  }

}
