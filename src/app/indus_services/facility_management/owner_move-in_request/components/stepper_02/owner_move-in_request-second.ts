import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'owner_move-in_request-stepper-two',
  styleUrls: ['./owner_move-in_request-second.scss'],
  templateUrl: './owner_move-in_request-second.html'

})
export class Owner_Move_in_Request_Stepper_Second {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nickname: ['', [Validators.required]]
    });
  }
}
