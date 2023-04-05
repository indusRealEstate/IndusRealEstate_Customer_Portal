import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { ROUTES } from "../sidebar/sidebar.component";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { Router } from "@angular/router";
import { AuthenticationService } from "app/services/authentication.service";
import { User } from "../../../../models/user/user.model";
import { OtherServices } from "app/services/other.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  private listTitles: any[];
  location: Location;
  mobile_menu_visible: any = 0;
  private toggleButton: any;
  private sidebarVisible: boolean;
  user: User;

  isUserAdmin: boolean = false;

  currentPage: any;

  requestPageType: any;

  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private authenticationService: AuthenticationService,
    private otherServices: OtherServices
  ) {
    this.location = location;
    this.sidebarVisible = false;
  }

  ngOnInit() {
    var data = localStorage.getItem("currentUser");
    var user = JSON.parse(data);

    if (user[0]["auth_type"] == "admin") {
      this.isUserAdmin = true;
    }
    this.getUserDataFromLocal(user);

    ///--------------
    this.listTitles = ROUTES.filter((listTitle) => listTitle);
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName("navbar-toggler")[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
      var $layer: any = document.getElementsByClassName("close-layer")[0];
      if ($layer) {
        $layer.remove();
        this.mobile_menu_visible = 0;
      }
    });
  }

  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName("body")[0];
    setTimeout(function () {
      toggleButton.classList.add("toggled");
    }, 500);

    body.classList.add("nav-open");

    this.sidebarVisible = true;
  }
  sidebarClose() {
    const body = document.getElementsByTagName("body")[0];
    this.toggleButton.classList.remove("toggled");
    this.sidebarVisible = false;
    body.classList.remove("nav-open");
  }
  sidebarToggle() {
    // const toggleButton = this.toggleButton;
    // const body = document.getElementsByTagName('body')[0];
    var $toggle = document.getElementsByClassName("navbar-toggler")[0];

    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
    const body = document.getElementsByTagName("body")[0];

    if (this.mobile_menu_visible == 1) {
      // $('html').removeClass('nav-open');
      body.classList.remove("nav-open");
      if ($layer) {
        $layer.remove();
      }
      setTimeout(function () {
        $toggle.classList.remove("toggled");
      }, 400);

      this.mobile_menu_visible = 0;
    } else {
      setTimeout(function () {
        $toggle.classList.add("toggled");
      }, 430);

      var $layer = document.createElement("div");
      $layer.setAttribute("class", "close-layer");

      if (body.querySelectorAll(".main-panel")) {
        document.getElementsByClassName("main-panel")[0].appendChild($layer);
      } else if (body.classList.contains("off-canvas-sidebar")) {
        document
          .getElementsByClassName("wrapper-full-page")[0]
          .appendChild($layer);
      }

      setTimeout(function () {
        $layer.classList.add("visible");
      }, 100);

      $layer.onclick = function () {
        //asign a function
        body.classList.remove("nav-open");
        this.mobile_menu_visible = 0;
        $layer.classList.remove("visible");
        setTimeout(function () {
          $layer.remove();
          $toggle.classList.remove("toggled");
        }, 400);
      }.bind(this);

      body.classList.add("nav-open");
      this.mobile_menu_visible = 1;
    }
  }

  userLogOut() {
    this.otherServices.isLogoutProcessing.next(true);
    this.authenticationService.logout();

    setTimeout(() => {
      this.otherServices.isUserSignedOut.next(true);
    }, 1500);
  }

  getUserDataFromLocal(user) {
    this.user = new User(
      user[0]["id"],
      user[0]["auth_type"],
      user[0]["username"],
      user[0]["firstname"],
      user[0]["lastname"],
      user[0]["password"],
      user[0]["token"]
    );
  }

  navigateOverview() {
    this.router.navigate(["/my-properties"], {
      queryParams: { uid: this.user.id },
    });

    this.otherServices.overviewClickedpropertyPage.next(true);
  }

  navigateMyRequests(req) {
    if (req == "maintenance") {
      this.router.navigate(["/requests"], {
        queryParams: { uid: this.user.id, req_type: "maintenance" },
      });
    } else if (req == "tenant-move-in") {
      this.router.navigate(["/requests"], {
        queryParams: { uid: this.user.id, req_type: "tenant-move-in" },
      });
    } else if (req == "tenant-move-out") {
      this.router.navigate(["/requests"], {
        queryParams: { uid: this.user.id, req_type: "tenant-move-out" },
      });
    } else if (req == "payment") {
      this.router.navigate(["/requests"], {
        queryParams: { uid: this.user.id, req_type: "payment" },
      });
    } else if (req == "conditioning") {
      this.router.navigate(["/requests"], {
        queryParams: { uid: this.user.id, req_type: "conditioning" },
      });
    } else if (req == "my-requests") {
      this.router.navigate(["/requests"], {
        queryParams: { uid: this.user.id, req_type: "my-requests" },
      });
    }

    this.otherServices.myRequestsClickedrequestPage.next(true);
  }

  getTitle() {
    this.currentPage = this.router.url.split("?")[0].split("/")[1];
    var titlee = this.location.prepareExternalUrl(this.location.path());

    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }

    switch (titlee.split("?")[0]) {
      case "/my-properties":
        return "My Properties";
      case "/documents":
        this.requestPageType = titlee.split("&")[1].split("=")[1];
        return "Documents";
      case "/user-profile":
        return "User profile";
      case "/requests":
        this.requestPageType = titlee.split("&")[1].split("=")[1];
        return "My Requests";
      case "/new-payment":
        return "Payment";
      case "/reports":
        return "Reports";
      case "/appointments":
        return "Appointments";
      case "/tenant-register-form":
        return "Tenant Registration";
      case "/property-page":
        return "Property details Page";
      case "/add-property-form":
        return "Add Property";
      case "/admin-dashboard":
        return "Admin Dashboard";
      case "/admin-requests":
        return "Requests";
      case "/request-page":
        this.requestPageType = titlee.split("&")[1].split("=")[1];
        return "Request Details Page";
      case "/admin-landlord-clients":
        return "All Landlord Clients";
      case "/admin-tenant-clients":
        return "All Tenant Clients";
      case "/admin-properties-sale":
        return "All Properties For Sale";
      case "/admin-properties-rent":
        return "All Properties For Rent";
      case "/customer-care":
        return "Customer Care";
      case "/service-temp":
        this.requestPageType = titlee.split("&")[1].split("=")[1];
        return "Services";
      case "/service-recap":
        this.requestPageType = titlee.split("&")[1].split("=")[1];
        return "Service Recap";
      case "/404":
        return "";
      default:
        return "Home";
    }
  }
}
