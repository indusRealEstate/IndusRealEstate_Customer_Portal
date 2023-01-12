import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "app/services/authentication.service";
import { User } from "../../../../models/user/user.model";

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const HOMEROUTE: RouteInfo[] = [
  { path: "/home", title: "Home", icon: "home", class: "" },
  {
    path: "/my-properties",
    title: "My Properties",
    icon: "maps_home_work",
    class: "",
  },
];

export const ROUTES: RouteInfo[] = [
  { path: "/my-requests", title: "My Requests", icon: "list_alt", class: "" },
  { path: "/new-payment", title: "Payment", icon: "payments", class: "" },
  { path: "/reports", title: "Reports", icon: "notes", class: "" },
  {
    path: "/appointments",
    title: "Appointments",
    icon: "calendar_month",
    class: "",
  },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  homeRoute: any[];
  serviceRoute: any[];
  menuItems: any[];
  user: User;

  constructor(private authService: AuthenticationService) {}

  ngOnInit() {
    this.getUserDataFromLocal();
    this.homeRoute = HOMEROUTE.filter((menuItem) => menuItem);
    // this.serviceRoute = SERVICEROUTE.filter(menuItem => menuItem);
    this.menuItems = ROUTES.filter((menuItem) => menuItem);

    if (this.authService.currentUserValue) {
      var userData = localStorage.getItem("currentUser");
      var user = JSON.parse(userData);

      for (let e of this.menuItems) {
        e["path"] = `${e["path"]}/${user[0]["id"]}`;
      }
      for (let e of this.homeRoute) {
        e["path"] = `${e["path"]}/${user[0]["id"]}`;
      }
    }
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  getUserDataFromLocal() {
    var data = localStorage.getItem("currentUser");
    var user = JSON.parse(data);

    this.user = new User(
      user[0]["id"],
      user[0]["username"],
      user[0]["firstname"],
      user[0]["lastname"],
      user[0]["password"],
      user[0]["token"]
    );
  }
}
