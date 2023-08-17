import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";
import { User } from "../../models/user.model";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  location: Location;
  mobile_menu_visible: any = 0;
  user: User;

  ///////////////--App Version--////////////////////
  appVersion: any = "VERSION PROD v0.1.17 -test";

  isUserAdmin: boolean = false;

  currentPage: any;

  requestPageType: any;
  user_portal_plan: any;

  constructor(
    location: Location,
    private router: Router,
    private authenticationService: AuthenticationService,
    private otherServices: OtherServices
  ) {
    this.location = location;
  }

  ngOnInit() {}

  userLogOut() {
    this.otherServices.isLogoutProcessing.next(true);
    this.authenticationService.logout();
    // this.chatService.user_leave(JSON.stringify({ user_id: this.user.id }));

    setTimeout(() => {
      // this.chatService.socket_disconnect();
      this.otherServices.isUserSignedOut.next(true);
      location.reload();
    }, 1500);
  }

  getMiniTabIcon() {
    this.currentPage = this.router.url.split("?")[0].split("/")[1];
    var titlee = this.location.prepareExternalUrl(this.location.path());

    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }

    if (
      titlee.split("?")[0] == "/admin-dashboard" ||
      titlee.split("?")[0] == "/admin-properties" ||
      titlee.split("?")[0] == "/admin-properties-units" ||
      titlee.split("?")[0] == "/all-users" ||
      titlee.split("?")[0] == "/property-details" ||
      titlee.split("?")[0] == "/admin-property-unit-details" ||
      titlee.split("?")[0] == "/admin-user-details" ||
      titlee.split("?")[0] == "/admin-report"
    ) {
      return "assets/img/svg/sidebar/home.svg";
    } else if (
      titlee.split("?")[0] == "/admin-requests" ||
      titlee.split("?")[0] == "/admin-request-category" ||
      titlee.split("?")[0] == "/admin-requests-details"
    ) {
      return "assets/img/svg/sidebar/menu.svg";
    } else if (
      titlee.split("?")[0] == "/admin-requests-archive" ||
      titlee.split("?")[0] == "/admin-requests-spam"
    ) {
      return "assets/img/svg/sidebar/archive.svg";
    } else if (
      titlee.split("?")[0] == "/admin-lease" ||
      titlee.split("?")[0] == "/admin-lease-details"
    ) {
      return "assets/img/svg/sidebar/lease.svg";
    } else if (titlee.split("?")[0] == "/user-chats") {
      return "assets/img/svg/sidebar/messages-1.svg";
    } else if (titlee.split("?")[0] == "/404") {
      return "404";
    }
  }

  getMiniTabTitle() {
    this.currentPage = this.router.url.split("?")[0].split("/")[1];
    var titlee = this.location.prepareExternalUrl(this.location.path());

    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }

    if (
      titlee.split("?")[0] == "/admin-dashboard" ||
      titlee.split("?")[0] == "/admin-properties" ||
      titlee.split("?")[0] == "/admin-properties-units" ||
      titlee.split("?")[0] == "/all-users" ||
      titlee.split("?")[0] == "/property-details" ||
      titlee.split("?")[0] == "/admin-property-unit-details" ||
      titlee.split("?")[0] == "/admin-user-details" ||
      titlee.split("?")[0] == "/admin-report"
    ) {
      return "Dashboard";
    } else if (
      titlee.split("?")[0] == "/admin-requests" ||
      titlee.split("?")[0] == "/admin-request-category" ||
      titlee.split("?")[0] == "/admin-requests-details"
    ) {
      return "Requests";
    } else if (
      titlee.split("?")[0] == "/admin-requests-archive" ||
      titlee.split("?")[0] == "/admin-requests-spam"
    ) {
      return "Archives & Spams";
    } else if (
      titlee.split("?")[0] == "/admin-lease" ||
      titlee.split("?")[0] == "/admin-lease-details"
    ) {
      return "Lease Management";
    } else if (titlee.split("?")[0] == "/user-chats") {
      return "Chats";
    } else if (titlee.split("?")[0] == "/404") {
      return "404";
    }
  }

  getTitle() {
    this.currentPage = this.router.url.split("?")[0].split("/")[1];
    var titlee = this.location.prepareExternalUrl(this.location.path());

    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }

    switch (titlee.split("?")[0]) {
      case "/admin-dashboard":
        return "Overview";
      case "/admin-properties":
        return "All Properties";
      case "/admin-properties-units":
        return "All Units";
      case "/all-users":
        return "All Users";
      case "/admin-lease":
        return "All Lease Contracts";
      case "/admin-requests":
        return "Maintenance Requests";
      case "/admin-request-category":
        return "Maintenance Requests Category";
      case "/admin-requests-archive":
        return "Archived Requests";
      case "/admin-requests-spam":
        return "Spam Requests";
      case "/user-chats":
        return "All Messages";
      case "/property-details":
        return "All Properties";
      case "/admin-property-unit-details":
        return "All Units";
      case "/admin-user-details":
        return "All Users";
      case "/admin-lease-details":
        return "All Lease Contracts";
      case "/admin-requests-details":
        return "Maintenance Requests";
      case "/admin-report":
        return "Report";
      default:
        return "404";
    }
  }

  getSubTitle() {
    this.currentPage = this.router.url.split("?")[0].split("/")[1];
    var titlee = this.location.prepareExternalUrl(this.location.path());

    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }

    switch (titlee.split("?")[0]) {
      case "/property-details":
        return "Property Details";
      case "/admin-property-unit-details":
        return "Unit Details";
      case "/admin-user-details":
        return "User Details";
      case "/admin-lease-details":
        return "Lease Details";
      case "/admin-requests-details":
        return "Maintenance Request Details";
      default:
        return "no-subtitle";
    }
  }

  gotoTitlePage() {
    if (this.getSubTitle() != "no-subtitle") {
      var userData = localStorage.getItem("currentUser");
      var user = JSON.parse(userData);
      var userId = user[0]["id"];

      this.currentPage = this.router.url.split("?")[0].split("/")[1];
      var titlee = this.location.prepareExternalUrl(this.location.path());

      if (titlee.charAt(0) === "#") {
        titlee = titlee.slice(1);
      }

      if (titlee.split("?")[0] == "/property-details") {
        this.router.navigate(["/admin-properties"]);
      } else if (titlee.split("?")[0] == "/admin-property-unit-details") {
        this.router.navigate(["/admin-properties-units"]);
      } else if (titlee.split("?")[0] == "/admin-user-details") {
        this.router.navigate(["/all-users"]);
      } else if (titlee.split("?")[0] == "/admin-lease-details") {
        this.router.navigate(["/admin-lease"]);
      } else if (titlee.split("?")[0] == "/admin-requests-details") {
        this.router.navigate(["/admin-requests"]);
      }
    }
  }
}
