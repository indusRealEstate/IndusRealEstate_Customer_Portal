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
    title: "Overview",
    icon: "assets/img/svg/sidebar/activity.svg",
    class: "",
  },
  {
    path: "/notifications",
    title: "Notifications",
    icon: "assets/img/svg/navbar/notification.svg",
    class: "",
  },
  {
    path: "/notifications-manage",
    title: "Manage Notifications",
    icon: "assets/img/svg/sidebar/settings.svg",
    class: "",
  },
];

export const PROPERTIESROUTE: RouteInfo[] = [
  {
    path: "/my-properties",
    title: "My Properties",
    icon: "assets/img/svg/sidebar/house-2.svg",
    class: "",
  },
  {
    path: "/add-property-form",
    title: "Add property",
    icon: "assets/img/svg/my-properties/add-square.svg",
    class: "",
  },
];

export const SERVICESROUTELANDLORD: RouteInfo[] = [
  {
    path: "/new-payment",
    title: "Payment",
    icon: "assets/img/svg/sidebar/empty-wallet.svg",
    class: "",
  },
  {
    path: "/inspection-request",
    title: "Inspection Request",
    icon: "assets/img/svg/sidebar/tool.svg",
    class: "",
  },
];

export const SERVICESROUTETENANT: RouteInfo[] = [
  {
    path: "/new-payment",
    title: "Payment",
    icon: "assets/img/svg/sidebar/empty-wallet.svg",
    class: "",
  },
  {
    path: "/inspection-request",
    title: "Inspection Request",
    icon: "assets/img/svg/sidebar/tool.svg",
    class: "",
  },
];

export const DOCUMENTSROUTELANDLORD: RouteInfo[] = [
  {
    path: "/documents",
    title: "My Documents",
    icon: "assets/img/svg/sidebar/file-text.svg",
    class: "",
  },
  {
    path: "/tenant-documents",
    title: "Tenant Documents",
    icon: "assets/img/svg/sidebar/Document-user-01.svg",
    class: "",
  },
  {
    path: "/documents-template",
    title: "Documents Template",
    icon: "assets/img/svg/sidebar/file.svg",
    class: "",
  },
];

export const DOCUMENTSROUTETENANT: RouteInfo[] = [
  {
    path: "/documents",
    title: "My Documents",
    icon: "assets/img/svg/sidebar/file-text.svg",
    class: "",
  },
  {
    path: "/documents-template",
    title: "Documents Template",
    icon: "assets/img/svg/sidebar/file.svg",
    class: "",
  },
];

export const REQUESTSROUTELANDLORD: RouteInfo[] = [
  {
    path: "/my-requests",
    title: "My Requests",
    icon: "assets/img/svg/sidebar/request-send.svg",
    class: "",
  },
  {
    path: "/maintenance-requests",
    title: "Maintenance requests",
    icon: "assets/img/svg/sidebar/maintenance_icon.svg",
    class: "",
  },
  {
    path: "/tenant-move-in-request",
    title: "Tenant Move-in",
    icon: "assets/img/svg/sidebar/User-admin-01.svg",
    class: "",
  },
  {
    path: "/tenant-move-out-request",
    title: "Tenant Move-out",
    icon: "assets/img/svg/sidebar/User-delete-02.svg",
    class: "",
  },
  {
    path: "/payment-requests-landlord",
    title: "Payment requests",
    icon: "assets/img/svg/sidebar/empty-wallet.svg",
    class: "",
  },
  {
    path: "/property-conditioning-requests",
    title: "Property conditioning",
    icon: "assets/img/svg/sidebar/property-conditioning.svg",
    class: "",
  },
];

export const REQUESTSROUTETENANT: RouteInfo[] = [
  {
    path: "/my-requests",
    title: "My Requests",
    icon: "assets/img/svg/sidebar/request-send.svg",
    class: "",
  },
  {
    path: "/payment-requests-tenant",
    title: "Payment requests",
    icon: "assets/img/svg/sidebar/empty-wallet.svg",
    class: "",
  },
];

export const ADMINROUTES: RouteInfo[] = [
  {
    path: "/admin-dashboard",
    title: "Dashboard",
    icon: "assets/img/svg/sidebar/home.svg",
    class: "",
  },
  {
    path: "/admin-requests",
    title: "Requests",
    icon: "assets/img/svg/sidebar/notification-status.svg",
    class: "",
  },
];

export const ROUTES: RouteInfo[] = [
  {
    path: "/documents",
    title: "My Documents",
    icon: "assets/img/svg/home-page/note-2.svg",
    class: "",
  },
  {
    path: "/my-requests",
    title: "Requests",
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
    path: "/customer-care",
    title: "Customer Care",
    icon: "assets/img/svg/sidebar/device-message.svg",
    class: "",
  },
  // {
  //   path: "/appointments",
  //   title: "Appointments",
  //   icon: "assets/img/svg/sidebar/menu-board.svg",
  //   class: "",
  // },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  homeRoute: any[];
  propertiesRoute: any[];
  serviceRouteLandlord: any[];
  serviceRouteTenant: any[];
  documentsRouteLandlord: any[];
  documentsRouteTenant: any[];

  requestsRouteTenant: any[];
  requestsRouteLandlord: any[];
  // menuItems: any[];
  user: User;
  userProfilePic: any = false;
  profilePicUpdatingLoader: boolean = false;
  userProfileFetching: boolean = false;
  sideBarClicked: boolean = true;

  sideBarTextShow: boolean = true;

  isDashboardOpened: boolean = true;
  isPropertiesOpened: boolean = false;
  isServicesOpened: boolean = false;
  isDocumentsOpened: boolean = false;
  isRequestsOpened: boolean = false;
  isPaymentsOpened: boolean = false;
  isReportsOpened: boolean = false;
  isCustomerCareOpened: boolean = false;

  ///////////////--App Version--////////////////////
  appVersion: any = "VERSION PROD v0.1.15";

  constructor(
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private apiServices: ApiService,
    private otherServices: OtherServices
  ) {
    this.userProfileFetching = true;
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

    otherServices.miniSideBarClicked.subscribe((val) => {
      this.sideBarClicked = val;
    });
  }

  ngOnInit() {
    this.getUserDataFromLocal();

    this.homeRoute = HOMEROUTE.filter((menuItem) => menuItem);
    this.propertiesRoute = PROPERTIESROUTE.filter((menuItem) => menuItem);
    this.serviceRouteLandlord = SERVICESROUTELANDLORD.filter(
      (menuItem) => menuItem
    );
    this.serviceRouteTenant = SERVICESROUTETENANT.filter(
      (menuItem) => menuItem
    );
    this.documentsRouteLandlord = DOCUMENTSROUTELANDLORD.filter(
      (menuItem) => menuItem
    );
    this.documentsRouteTenant = DOCUMENTSROUTETENANT.filter(
      (menuItem) => menuItem
    );

    this.requestsRouteLandlord = REQUESTSROUTELANDLORD.filter(
      (menuItem) => menuItem
    );

    this.requestsRouteTenant = REQUESTSROUTETENANT.filter(
      (menuItem) => menuItem
    );
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
      this.userProfileFetching = false;
    } else {
      this.getUserDetails(user[0]["id"]);
    }
  }

  getUserDetails(userId: any) {
    this.apiServices.getUserDetails(userId).subscribe((e: any) => {
      if (e[0]["profile_photo"] != "") {
        this.userProfilePic = "data:image/jpg;base64," + e[0]["profile_photo"];
      } else {
        this.userProfilePic = false;
      }
    });

    setTimeout(() => {
      this.userProfileFetching = false;
    }, 3000);
  }

  userLogOut() {
    this.otherServices.isLogoutProcessing.next(true);
    this.authService.logout();

    setTimeout(() => {
      this.otherServices.isUserSignedOut.next(true);
    }, 1500);
  }

  miniSideBarClose() {
    var sideBarValue = this.otherServices.miniSideBarClicked.getValue();
    if (sideBarValue == false) {
      this.otherServices.miniSideBarClicked.next(true);
      if (
        this.isPropertiesOpened == false &&
        this.isDocumentsOpened == false &&
        this.isPaymentsOpened == false &&
        this.isServicesOpened == false &&
        this.isRequestsOpened == false &&
        this.isCustomerCareOpened == false &&
        this.isReportsOpened == false
      ) {
        this.isDashboardOpened = true;

        setTimeout(() => {
          this.sideBarTextShow = true;
        }, 200);
      } else {
        setTimeout(() => {
          this.sideBarTextShow = true;
        }, 200);
      }
    } else {
      this.otherServices.miniSideBarClicked.next(false);
      this.sideBarTextShow = false;
    }
  }

  miniSideBarClickedDashboard() {
    var sideBarValue = this.otherServices.miniSideBarClicked.getValue();
    if (sideBarValue == false) {
      this.otherServices.miniSideBarClicked.next(true);
      this.isDashboardOpened = true;
      this.isRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isPropertiesOpened = false;
      this.isServicesOpened = false;

      setTimeout(() => {
        this.sideBarTextShow = true;
      }, 200);
    } else {
      this.isDashboardOpened = true;
      this.isRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isPropertiesOpened = false;
      this.isServicesOpened = false;
      this.sideBarTextShow = true;
    }
  }

  miniSideBarClickedProperties() {
    var sideBarValue = this.otherServices.miniSideBarClicked.getValue();
    if (sideBarValue == false) {
      this.otherServices.miniSideBarClicked.next(true);
      this.isPropertiesOpened = true;
      this.isRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isDashboardOpened = false;
      this.isServicesOpened = false;

      setTimeout(() => {
        this.sideBarTextShow = true;
      }, 200);
    } else {
      this.isPropertiesOpened = true;
      this.isRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isDashboardOpened = false;
      this.isServicesOpened = false;
      this.sideBarTextShow = true;
    }
  }

  miniSideBarClickedServices() {
    var sideBarValue = this.otherServices.miniSideBarClicked.getValue();
    if (sideBarValue == false) {
      this.otherServices.miniSideBarClicked.next(true);
      this.isServicesOpened = true;
      this.isRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isDashboardOpened = false;
      this.isPropertiesOpened = false;

      setTimeout(() => {
        this.sideBarTextShow = true;
      }, 200);
    } else {
      this.isServicesOpened = true;
      this.isRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isDashboardOpened = false;
      this.isPropertiesOpened = false;
      this.sideBarTextShow = true;
    }
  }

  miniSideBarClickedDocuments() {
    var sideBarValue = this.otherServices.miniSideBarClicked.getValue();
    if (sideBarValue == false) {
      this.otherServices.miniSideBarClicked.next(true);
      this.isDocumentsOpened = true;
      this.isRequestsOpened = false;
      this.isServicesOpened = false;
      this.isDashboardOpened = false;
      this.isPropertiesOpened = false;

      setTimeout(() => {
        this.sideBarTextShow = true;
      }, 200);
    } else {
      this.isDocumentsOpened = true;
      this.isRequestsOpened = false;
      this.isServicesOpened = false;
      this.isDashboardOpened = false;
      this.isPropertiesOpened = false;
      this.sideBarTextShow = true;
    }
  }

  miniSideBarClickedRequests() {
    var sideBarValue = this.otherServices.miniSideBarClicked.getValue();
    if (sideBarValue == false) {
      this.otherServices.miniSideBarClicked.next(true);
      this.isRequestsOpened = true;
      this.isDocumentsOpened = false;
      this.isServicesOpened = false;
      this.isDashboardOpened = false;
      this.isPropertiesOpened = false;

      setTimeout(() => {
        this.sideBarTextShow = true;
      }, 200);
    } else {
      this.isRequestsOpened = true;
      this.isDocumentsOpened = false;
      this.isServicesOpened = false;
      this.isDashboardOpened = false;
      this.isPropertiesOpened = false;
      this.sideBarTextShow = true;
    }
  }
}
