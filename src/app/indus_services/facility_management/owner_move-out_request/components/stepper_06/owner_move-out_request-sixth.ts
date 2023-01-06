import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'owner_move-out_request-stepper-six',
  styleUrls: ['./owner_move-out_request-sixth.scss'],
  templateUrl: './owner_move-out_request-sixth.html',
})
export class Owner_Move_out_Request_Stepper_Sixth {
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
