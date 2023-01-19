import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { AuthenticationService } from 'app/services/authentication.service';

@Component({
    selector: 'app-auth-layout',
    templateUrl: './auth-layout.component.html',
    styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit {

    isUserSignedIn: boolean = false;

    constructor(public location: Location, private router: Router, private authenticationService: AuthenticationService,) { }

    ngOnInit() {
        this.isUserSignOut();
    }
    ngAfterViewInit() {
    }

    onActivate(event) {
        // window.scroll(0,0);
     
        window.scroll({ 
                top: 0, 
                left: 0, 
                behavior: 'smooth' 
         });
     }

    isUserSignOut() {
        if (this.authenticationService.currentUserValue) {
            this.isUserSignedIn = true;
            this.router.navigate(['/home']);
        } else {
            this.isUserSignedIn = false;
            this.router.navigate(['/login']);
        }
    }

}
