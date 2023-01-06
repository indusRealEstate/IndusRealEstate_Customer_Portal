import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'tenant_registration-stepper-six',
  styleUrls: ['./tenant_registration-sixth.scss'],
  templateUrl: './tenant_registration-sixth.html',
})
export class Tenant_Registration_Stepper_Sixth {
  id: number;
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      someField: ['', [Validators.required]]
    });

    this.activatedRoute.params.subscribe(async (params) => {
      this.id = +params?.id;
    });
  }

  goAgain(): void {
    this.router.navigateByUrl('/reload', { skipLocationChange: true }).then(() => {
      this.router.navigate(['parent', this.id + 1]);
    });
  }
}
