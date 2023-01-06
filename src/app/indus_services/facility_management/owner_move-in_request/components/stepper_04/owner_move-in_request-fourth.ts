import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'owner_move-in_request-stepper-four',
  styleUrls: ['./owner_move-in_request-fourth.scss'],
  templateUrl: './owner_move-in_request-fourth.html',
})
export class Owner_Move_in_Request_Stepper_Fourth {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nickname: ['', [Validators.required]]
    });
  }
}
