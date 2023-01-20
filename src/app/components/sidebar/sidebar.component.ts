import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";
import { User } from "../../../../models/user/user.model";

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const HOMEROUTE: RouteInfo[] = [
  {
    path: "/home",
    title: "Home",
    icon: "assets/img/svg/sidebar/home.svg",
    class: "",
  },
  {
    path: "/my-properties",
    title: "My Properties",
    icon: "assets/img/svg/sidebar/buildings.svg",
    class: "",
  },
];

export const ROUTES: RouteInfo[] = [
  {
    path: "/my-requests",
    title: "My Requests",
    icon: "assets/img/svg/sidebar/menu.svg",
    class: "",
  },
  {
    path: "/new-payment",
    title: "Payment",
    icon: "assets/img/svg/sidebar/empty-wallet.svg",
    class: "",
  },
  {
    path: "/reports",
    title: "Reports",
    icon: "assets/img/svg/sidebar/document-filter.svg",
    class: "",
  },
  {
    path: "/appointments",
    title: "Appointments",
    icon: "assets/img/svg/sidebar/menu-board.svg",
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
  userProfilePic: any;
  profilePicUpdatingLoader: boolean = false;
  userProfileFetching: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private apiServices: ApiService,
    private otherServices: OtherServices
  ) {
    this.otherServices.isProfilePicUpdated.subscribe((e) => {
      if (e == true) {
        this.userProfileFetching = true;
        this.profilePicUpdatingLoader = true;
        var data = localStorage.getItem("currentUser");
        var user = JSON.parse(data);
        setTimeout(() => {
          this.getUserDetails(user[0]["id"]);
        }, 1000);

        this.otherServices.isProfilePicUpdated.next(false);
        setTimeout(() => {
          this.profilePicUpdatingLoader = false;
        }, 1000);
      }
    });
  }

  ngOnInit() {
    this.getUserDataFromLocal();

    this.homeRoute = HOMEROUTE.filter((menuItem) => menuItem);
    // this.serviceRoute = SERVICEROUTE.filter(menuItem => menuItem);
    this.menuItems = ROUTES.filter((menuItem) => menuItem);

    if (this.user.auth_type != "landlord") {
      this.homeRoute.pop();
    }
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  isLinkActive(url): boolean {
    const baseUrl = this.router.url.split("?")[0];

    return baseUrl == url;
  }

  getUserDataFromLocal() {
    var data = localStorage.getItem("currentUser");
    var user = JSON.parse(data);

    this.user = new User(
      user[0]["id"],
      user[0]["auth_type"],
      user[0]["username"],
      user[0]["firstname"],
      user[0]["lastname"],
      user[0]["password"],
      user[0]["token"]
    );

    var userDetailsSessionData = sessionStorage.getItem("userDetails");
    var jsonUserDetails = JSON.parse(userDetailsSessionData);

    if (userDetailsSessionData != null) {
      this.userProfilePic = jsonUserDetails["userProfilePic"];
    } else {
      this.userProfileFetching = true;
      this.getUserDetails(user[0]["id"]);
    }
  }

  getUserDetails(userId: any) {
    this.apiServices.getUserDetails(userId).subscribe((e: any) => {
      this.userProfilePic = "data:image/jpg;base64," + e[0]["profile_photo"];
    });

    setTimeout(() => {
      this.userProfileFetching = false;
    }, 500);
  }
}
