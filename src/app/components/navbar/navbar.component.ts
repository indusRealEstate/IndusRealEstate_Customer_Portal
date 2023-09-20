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
    this.authenticationService.logout();
  }

  getMiniTabIcon() {
    this.currentPage = this.router.url.split("?")[0].split("/")[1];
    var titlee = this.location.prepareExternalUrl(this.location.path());

    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }

    if (
      titlee.split("?")[0] == "/dashboard" ||
      titlee.split("?")[0] == "/properties" ||
      titlee.split("?")[0] == "/properties-units" ||
      titlee.split("?")[0] == "/all-users" ||
      titlee.split("?")[0] == "/property-details" ||
      titlee.split("?")[0] == "/property-unit-details" ||
      titlee.split("?")[0] == "/user-details" ||
      titlee.split("?")[0] == "/report" ||
      titlee.split("?")[0] == "/announcements"
    ) {
      return "assets/img/svg/sidebar/home.svg";
    } else if (
      titlee.split("?")[0] == "/requests" ||
      titlee.split("?")[0] == "/request-category" ||
      titlee.split("?")[0] == "/requests-archive" ||
      titlee.split("?")[0] == "/requests-details"
    ) {
      return "assets/img/svg/sidebar/menu.svg";
    } else if (
      titlee.split("?")[0] == "/contracts" ||
      titlee.split("?")[0] == "/contract-details" ||
      titlee.split("?")[0] == "/contracts-reminders" 
    ) {
      return "assets/img/svg/sidebar/lease.svg";
    } else if (titlee.split("?")[0] == "/user-chats") {
      return "assets/img/svg/sidebar/messages-1.svg";
    } else if (titlee.split("?")[0] == "/payments") {
      return "assets/img/svg/payment/wallet-2.svg";
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
      titlee.split("?")[0] == "/dashboard" ||
      titlee.split("?")[0] == "/properties" ||
      titlee.split("?")[0] == "/properties-units" ||
      titlee.split("?")[0] == "/all-users" ||
      titlee.split("?")[0] == "/property-details" ||
      titlee.split("?")[0] == "/property-unit-details" ||
      titlee.split("?")[0] == "/user-details" ||
      titlee.split("?")[0] == "/report" ||
      titlee.split("?")[0] == "/announcements"
    ) {
      return "Dashboard";
    } else if (
      titlee.split("?")[0] == "/requests" ||
      titlee.split("?")[0] == "/request-category" ||
      titlee.split("?")[0] == "/requests-archive" ||
      titlee.split("?")[0] == "/requests-details"
    ) {
      return "Requests";
    } else if (
      titlee.split("?")[0] == "/contracts" ||
      titlee.split("?")[0] == "/contract-details" ||
      titlee.split("?")[0] == "/contracts-reminders"
    ) {
      return "Lease Management";
    } else if (titlee.split("?")[0] == "/user-chats") {
      return "Chats";
    } else if (titlee.split("?")[0] == "/payments") {
      return "Payments";
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
      case "/dashboard":
        return "Overview";
      case "/properties":
        return "All Properties";
      case "/properties-units":
        return "All Units";
      case "/all-users":
        return "All Users";
      case "/contracts":
        return "All Lease Contracts";
      case "/contracts-reminders":
        return "Contracts Reminders";
      case "/requests":
        return "Maintenance Requests";
      case "/request-category":
        return "Requests Category";
      case "/requests-archive":
        return "Archived Requests";
      // case "/admin-requests-spam":
      //   return "Spam Requests";
      case "/user-chats":
        return "All Messages";
      case "/property-details":
        return "All Properties";
      case "/property-unit-details":
        return "All Units";
      case "/user-details":
        return "All Users";
      case "/contract-details":
        return "All Lease Contracts";
      case "/requests-details":
        return "Maintenance Requests";
      case "/report":
        return "Report";
      case "/announcements":
        return "Announcements";
      case "/payments":
        return "All Payments";
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
      case "/property-unit-details":
        return "Unit Details";
      case "/user-details":
        return "User Details";
      case "/contract-details":
        return "Lease Details";
      case "/requests-details":
        return "Maintenance Request Details";
      default:
        return "no-subtitle";
    }
  }

  gotoTitlePage() {
    if (this.getSubTitle() != "no-subtitle") {
      this.currentPage = this.router.url.split("?")[0].split("/")[1];
      var titlee = this.location.prepareExternalUrl(this.location.path());

      if (titlee.charAt(0) === "#") {
        titlee = titlee.slice(1);
      }

      if (titlee.split("?")[0] == "/property-details") {
        this.router.navigate(["/properties"]);
      } else if (titlee.split("?")[0] == "/property-unit-details") {
        this.router.navigate(["/properties-units"]);
      } else if (titlee.split("?")[0] == "/user-details") {
        this.router.navigate(["/all-users"]);
      } else if (titlee.split("?")[0] == "/contract-details") {
        this.router.navigate(["/contracts"]);
      } else if (titlee.split("?")[0] == "/requests-details") {
        this.router.navigate(["/requests"]);
      }
    }
  }
}
