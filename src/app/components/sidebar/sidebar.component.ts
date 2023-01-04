import { Component, OnInit } from '@angular/core';
import { User } from '../../../../models/user/user.model';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const HOMEROUTE: RouteInfo[] = [
  { path: '/home', title: 'Home', icon: 'home', class: '' },
];

// export const SERVICEROUTE: RouteInfo[] = [
//   { path: '/services', title: 'Services', icon: 'assignment', class: '' }
// ];
export const ROUTES: RouteInfo[] = [
  { path: '/my-requests', title: 'My Requests', icon: 'list_alt', class: '' },
  { path: '/new-payment', title: 'Payment', icon: 'payments', class: '' },
  { path: '/reports', title: 'Reports', icon: 'notes', class: '' },
  { path: '/appointments', title: 'Appointments', icon: 'calendar_month', class: '' },
  // { path: '/user-profile', title: 'User Profile', icon: 'person', class: '' },
  // { path: '/typography', title: 'Typography', icon: 'library_books', class: '' },
  // { path: '/icons', title: 'Icons', icon: 'bubble_chart', class: '' },
  // { path: '/maps', title: 'Maps', icon: 'location_on', class: '' },
  // { path: '/notifications', title: 'Notifications', icon: 'notifications', class: '' },
  // { path: '/counter', title: 'Counter', icon: 'dashboard', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  homeRoute: any[];
  serviceRoute: any[];
  menuItems: any[];
  user: User;

  constructor() { }

  ngOnInit() {
    this.getUserDataFromLocal();
    this.homeRoute = HOMEROUTE.filter(menuItem => menuItem);
    // this.serviceRoute = SERVICEROUTE.filter(menuItem => menuItem);
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };

  getUserDataFromLocal() {
    var data = localStorage.getItem('currentUser');
    var user = JSON.parse(data);

    this.user = new User(
      user[0]["id"],
      user[0]["username"],
      user[0]["firstname"],
      user[0]["lastname"],
      user[0]["password"],
      user[0]["token"],
    )
  }
}
