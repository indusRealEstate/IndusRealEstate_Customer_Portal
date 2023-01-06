import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'tenant_registration-stepper-five',
  styleUrls: ['./tenant_registration-fifth.scss'],
  templateUrl: './tenant_registration-fifth.html',
})
export class Tenant_Registration_Stepper_Fifth {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nickname: ['', [Validators.required]]
    });
  }

}
