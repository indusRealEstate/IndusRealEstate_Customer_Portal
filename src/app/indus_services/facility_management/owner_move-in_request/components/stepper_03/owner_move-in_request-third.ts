import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'owner_move-in_request-stepper-three',
  styleUrls: ['./owner_move-in_request-third.scss'],
  templateUrl: './owner_move-in_request-third.html',

})
export class Owner_Move_in_Request_Stepper_Third {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nickname: ['', [Validators.required]]
    });
  }

}
