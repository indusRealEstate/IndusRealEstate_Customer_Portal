import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'app/services/api.service';
import { AuthenticationService } from 'app/services/authentication.service';

@Component({
  selector: 'app-myProperties',
  templateUrl: './my_properties.component.html',
  styleUrls: ['./my_properties.component.scss']
})
export class MyPropertiesComponent implements OnInit {

  isUserSignedIn: boolean = false;

  constructor(private apiService: ApiService, private router: Router, private authenticationService: AuthenticationService,) { }

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.isUserSignOut();
  }

}



