import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'fm-maintanence-stepper-five',
  styleUrls: ['./fm-maintanence-fifth.scss'],
  templateUrl: './fm-maintanence-fifth.html',
})
export class FM_MaintananceRequest_Stepper_Fifth {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nickname: ['', [Validators.required]]
    });
  }

}
