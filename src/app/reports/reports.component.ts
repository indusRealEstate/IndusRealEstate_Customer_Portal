import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'app/services/api.service';
import { AuthenticationService } from 'app/services/authentication.service';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  selectedReport: any = '--None--';
  selectedDateRange: any = '--None--';
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
    // this.apiService.getProperties().subscribe(data =>{
    //   console.log(data);
    // });
  }

  connectBackend() {
    try {
      this.apiService.addProperty("hello").subscribe();
    } catch (error) {
      console.log(error);
    }

  }

}
