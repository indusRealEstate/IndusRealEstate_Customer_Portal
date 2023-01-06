import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'fm-maintanence-stepper-three',
  styleUrls: ['./fm-maintanence-third.scss'],
  templateUrl: './fm-maintanence-third.html',

})
export class FM_MaintananceRequest_Stepper_Third {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nickname: ['', [Validators.required]]
    });
  }

}
