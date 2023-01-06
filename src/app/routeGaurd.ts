import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DirectAccessGaurd implements CanActivate {

    constructor(private router: Router) { }
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        // if(this.router.url === '/form') {
        //     if(next.routeConfig.path === 'attachment' || next.routeConfig.path === 'inbox') {
        //         return true;
        //     }
        // }
        var userData = localStorage.getItem('currentUser');
        var user = JSON.parse(userData);
        var currentPath = this.router.url.split('/')[1];
        if (next.routeConfig.path == `${currentPath}/${user[0]["id"]}`) {
            return true; // To allow answer/:id route through url
        }
        // if(this.router.url.startsWith('/answer/')) {
        //     if(next.routeConfig.path === 'summary') {
        //         return true;
        //     }
        // }

        // this.router.navigate(['/notfound'])
        return false;
    }
}