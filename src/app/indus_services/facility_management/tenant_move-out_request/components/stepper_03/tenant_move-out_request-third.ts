import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'tenant_move-out_request-stepper-three',
  styleUrls: ['./tenant_move-out_request-third.scss'],
  templateUrl: './tenant_move-out_request-third.html',

})
export class Tenant_Move_out_Request_Stepper_Third {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nickname: ['', [Validators.required]]
    });
  }

}
