import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tenant_move-out_request-stepper-four',
  styleUrls: ['./tenant_move-out_request-fourth.scss'],
  templateUrl: './tenant_move-out_request-fourth.html',
})
export class Tenant_Move_out_Request_Stepper_Fourth {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nickname: ['', [Validators.required]]
    });
  }
}
