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

export const HOMEROUTEADMIN: any[] = [
  {
    path: "/admin-dashboard",
    title: "Overview",
    icon: "assets/img/svg/sidebar/activity.svg",
    class: "",
  },
  {
    path: "/admin-properties",
    title: "Sale Properties",
    icon: "assets/img/svg/sidebar/buildings.svg",
    class: "",
    queryParams: "sale",
  },
  {
    path: "/admin-properties",
    title: "Rent Properties",
    icon: "assets/img/svg/sidebar/buildings.svg",
    class: "",
    queryParams: "rent",
  },
  {
    path: "/admin-clients",
    title: "All Landlord Clients",
    icon: "assets/img/svg/sidebar/clients.svg",
    class: "",
    queryParams: "landlord",
  },
  {
    path: "/admin-clients",
    title: "All Tenant Clients",
    icon: "assets/img/svg/sidebar/clients.svg",
    class: "",
    queryParams: "tenant",
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

export const SERVICESROUTELANDLORD: any[] = [
  {
    path: "/service-temp",
    title: "Payment",
    icon: "assets/img/svg/sidebar/empty-wallet.svg",
    class: "",
    queryParams: "payment-landlord",
  },
  {
    path: "/service-temp",
    title: "Inspection Request",
    icon: "assets/img/svg/sidebar/tool.svg",
    class: "",
    queryParams: "inspection",
  },
];

export const SERVICESROUTETENANT: any[] = [
  {
    path: "/service-temp",
    title: "Payment",
    icon: "assets/img/svg/sidebar/empty-wallet.svg",
    class: "",
    queryParams: "payment-tenant",
  },
  {
    path: "/service-temp",
    title: "FM Maintenance",
    icon: "assets/img/svg/sidebar/maintenance_icon.svg",
    class: "",
    queryParams: "maintenance",
  },
  {
    path: "/service-temp",
    title: "Tenant Move-in",
    icon: "assets/img/svg/sidebar/User-admin-01.svg",
    class: "",
    queryParams: "tenant-move-in",
  },
  {
    path: "/service-temp",
    title: "Tenant Move-out",
    icon: "assets/img/svg/sidebar/User-delete-02.svg",
    class: "",
    queryParams: "tenant-move-out",
  },
  {
    path: "/service-temp",
    title: "Property Conditioning",
    icon: "assets/img/svg/sidebar/property-conditioning.svg",
    class: "",
    queryParams: "conditioning",
  },
];

export const DOCUMENTSROUTELANDLORD: any[] = [
  {
    path: "/documents",
    title: "My Documents",
    icon: "assets/img/svg/sidebar/file-text.svg",
    class: "",
    queryParams: "my-documents",
  },
  {
    path: "/documents",
    title: "Tenant Documents",
    icon: "assets/img/svg/sidebar/Document-user-01.svg",
    class: "",
    queryParams: "tenant-documents",
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

export const DOCUMENTSROUTEADMIN: RouteInfo[] = [
  {
    path: "/documents",
    title: "All Clients Documents",
    icon: "assets/img/svg/sidebar/file-text.svg",
    class: "",
  },
];

export const REQUESTSROUTELANDLORD: RouteInfo[] = [
  {
    path: "/requests",
    title: "My Requests",
    icon: "assets/img/svg/sidebar/request-send.svg",
    class: "",
  },
];

export const REQUESTSROUTETENANT: RouteInfo[] = [
  {
    path: "/requests",
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

export const REQUESTSROUTEADMIN: RouteInfo[] = [
  {
    path: "/admin-requests",
    title: "All Requests",
    icon: "assets/img/svg/sidebar/service-request-1.svg",
    class: "",
  },
  {
    path: "/admin-requests-landlord",
    title: "Landlord requests",
    icon: "assets/img/svg/sidebar/chat-request-svgrepo-com.svg",
    class: "",
  },
  {
    path: "/admin-requests-tenant",
    title: "Tenant requests",
    icon: "assets/img/svg/sidebar/chat-request-svgrepo-com.svg",
    class: "",
  },
];

export const CUSTOMERCAREROUTE: RouteInfo[] = [
  {
    path: "/customer-care",
    title: "Customer Care",
    icon: "assets/img/svg/sidebar/device-message.svg",
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
    path: "/requests",
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
  homeRouteAdmin: any[];
  propertiesRoute: any[];
  serviceRouteLandlord: any[];
  serviceRouteTenant: any[];
  documentsRouteLandlord: any[];
  documentsRouteTenant: any[];
  documentsRouteAdmin: any[];

  requestsRouteTenant: any[];
  requestsRouteLandlord: any[];
  requestsRouteAdmin: any[];

  customerCareRoute: any[];
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

  currentPage: any;

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

    otherServices.myRequestClickedHome.subscribe((req_val) => {
      if (req_val == true) {
        this.miniSideBarClickedRequests();
      }
    });

    otherServices.myPropertiesClickedHome.subscribe((prop_val) => {
      if (prop_val == true) {
        this.miniSideBarClickedProperties();
      }
    });

    otherServices.reportsClickedHome.subscribe((repo_val) => {
      if (repo_val == true) {
        this.miniSideBarClickedReports();
      }
    });

    otherServices.customerCareClickedHome.subscribe((cust_val) => {
      if (cust_val == true) {
        this.miniSideBarClickedCustomerCare();
      }
    });

    otherServices.homeClickedTenantReg.subscribe((home_val) => {
      if (home_val == true) {
        this.miniSideBarClickedDashboard();
      }
    });

    otherServices.allRequestsClickedAdminDashboard.subscribe(
      (admin_req_val) => {
        if (admin_req_val == true) {
          this.miniSideBarClickedRequests();
        }
      }
    );

    otherServices.propertyPageClickedUserProfile.subscribe((usr_val) => {
      if (usr_val == true) {
        this.miniSideBarClickedProperties();
      }
    });

    otherServices.overviewClickedpropertyPage.subscribe((ovr_val) => {
      if (ovr_val == true) {
        this.miniSideBarClickedProperties();
      }
    });

    otherServices.myRequestsClickedrequestPage.subscribe((myreq_val) => {
      if (myreq_val == true) {
        this.miniSideBarClickedRequests();
      }
    });
  }

  ngOnInit() {
    this.getUserDataFromLocal();

    this.homeRoute = HOMEROUTE.filter((menuItem) => menuItem);
    this.homeRouteAdmin = HOMEROUTEADMIN.filter((menuItem) => menuItem);
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

    this.documentsRouteAdmin = DOCUMENTSROUTEADMIN.filter(
      (menuItem) => menuItem
    );

    this.requestsRouteLandlord = REQUESTSROUTELANDLORD.filter(
      (menuItem) => menuItem
    );

    this.requestsRouteTenant = REQUESTSROUTETENANT.filter(
      (menuItem) => menuItem
    );

    this.requestsRouteAdmin = REQUESTSROUTEADMIN.filter((menuItem) => menuItem);

    this.customerCareRoute = CUSTOMERCAREROUTE.filter((menuItem) => menuItem);
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  myRequestSideBarClicked() {
    this.otherServices.tenantRequestsDropDownCloseLandlord.next(true);

    if (this.otherServices.requestsToggle.getValue() == false) {
      this.otherServices.requestsToggle.next(true);

      setTimeout(() => {
        this.otherServices.requestsToggle.next(false);
      }, 0);
    } else {
      this.otherServices.requestsToggle.next(false);

      setTimeout(() => {
        this.otherServices.requestsToggle.next(true);
      }, 0);
    }
  }

  adminSidebarClicked(path) {
    if (path == "/admin-clients") {
      this.otherServices.adminCLientsPageToggle.next(true);

      setTimeout(() => {
        this.otherServices.adminCLientsPageToggle.next(false);
      }, 0);
    } else if (path == "/admin-properties") {
      this.otherServices.adminPropertyPageToggle.next(true);

      setTimeout(() => {
        this.otherServices.adminPropertyPageToggle.next(false);
      }, 0);
    }
  }

  isLinkActive(url, type?): boolean {
    if (url == "/requests") {
      var base = this.router.url.split("?")[0];
      if (base == url) {
        var req_page_type = this.router.url.split("&")[1].split("=")[1];

        if (req_page_type == "my-requests") {
          return true;
        } else {
          return false;
        }
      }
    } else if (url == "/documents") {
      var base = this.router.url.split("?")[0];
      if (base == url) {
        var req_page_type = this.router.url.split("&")[1].split("=")[1];

        if (req_page_type == type) {
          return true;
        } else {
          return false;
        }
      }
    } else if (url == "/service-temp") {
      var base = this.router.url.split("?")[0];
      if (base == url) {
        var req_page_type = this.router.url.split("&")[1].split("=")[1];

        if (req_page_type == type) {
          return true;
        } else {
          return false;
        }
      }
    } else if (url == "/admin-clients") {
      var base = this.router.url.split("?")[0];
      if (base == url) {
        var req_page_type = this.router.url.split("&")[1].split("=")[1];

        if (req_page_type == type) {
          return true;
        } else {
          return false;
        }
      }
    } else if (url == "/admin-properties") {
      var base = this.router.url.split("?")[0];
      if (base == url) {
        var req_page_type = this.router.url.split("&")[1].split("=")[1];

        if (req_page_type == type) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      const baseUrl = this.router.url.split("?")[0];

      return baseUrl == url;
    }
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
      this.isReportsOpened = false;
      this.isCustomerCareOpened = false;

      setTimeout(() => {
        this.sideBarTextShow = true;
      }, 200);
    } else {
      this.isDashboardOpened = true;
      this.isRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isPropertiesOpened = false;
      this.isServicesOpened = false;
      this.isReportsOpened = false;
      this.isCustomerCareOpened = false;
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
      this.isReportsOpened = false;
      this.isCustomerCareOpened = false;

      setTimeout(() => {
        this.sideBarTextShow = true;
      }, 200);
    } else {
      this.isPropertiesOpened = true;
      this.isRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isDashboardOpened = false;
      this.isServicesOpened = false;
      this.isReportsOpened = false;
      this.isCustomerCareOpened = false;
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
      this.isReportsOpened = false;
      this.isCustomerCareOpened = false;

      setTimeout(() => {
        this.sideBarTextShow = true;
      }, 200);
    } else {
      this.isServicesOpened = true;
      this.isRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isDashboardOpened = false;
      this.isPropertiesOpened = false;
      this.isReportsOpened = false;
      this.isCustomerCareOpened = false;
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
      this.isReportsOpened = false;
      this.isCustomerCareOpened = false;

      setTimeout(() => {
        this.sideBarTextShow = true;
      }, 200);
    } else {
      this.isDocumentsOpened = true;
      this.isReportsOpened = false;
      this.isRequestsOpened = false;
      this.isServicesOpened = false;
      this.isDashboardOpened = false;
      this.isPropertiesOpened = false;
      this.isCustomerCareOpened = false;
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
      this.isReportsOpened = false;
      this.isCustomerCareOpened = false;

      setTimeout(() => {
        this.sideBarTextShow = true;
      }, 200);
    } else {
      this.isRequestsOpened = true;
      this.isReportsOpened = false;
      this.isDocumentsOpened = false;
      this.isServicesOpened = false;
      this.isDashboardOpened = false;
      this.isPropertiesOpened = false;
      this.isCustomerCareOpened = false;
      this.sideBarTextShow = true;
    }
  }

  miniSideBarClickedReports() {
    var sideBarValue = this.otherServices.miniSideBarClicked.getValue();
    if (sideBarValue == false) {
      this.otherServices.miniSideBarClicked.next(true);
      this.isReportsOpened = true;
      this.isRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isServicesOpened = false;
      this.isDashboardOpened = false;
      this.isPropertiesOpened = false;
      this.isCustomerCareOpened = false;

      setTimeout(() => {
        this.sideBarTextShow = true;
      }, 200);
    } else {
      this.isReportsOpened = true;
      this.isRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isServicesOpened = false;
      this.isDashboardOpened = false;
      this.isPropertiesOpened = false;
      this.isCustomerCareOpened = false;
      this.sideBarTextShow = true;
    }
  }

  miniSideBarClickedCustomerCare() {
    var sideBarValue = this.otherServices.miniSideBarClicked.getValue();
    if (sideBarValue == false) {
      this.otherServices.miniSideBarClicked.next(true);
      this.isCustomerCareOpened = true;
      this.isReportsOpened = false;
      this.isRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isServicesOpened = false;
      this.isDashboardOpened = false;
      this.isPropertiesOpened = false;

      setTimeout(() => {
        this.sideBarTextShow = true;
      }, 200);
    } else {
      this.isCustomerCareOpened = true;
      this.isReportsOpened = false;
      this.isRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isServicesOpened = false;
      this.isDashboardOpened = false;
      this.isPropertiesOpened = false;
      this.sideBarTextShow = true;
    }
  }

  // ngDoCheck() {
  //   this.currentPage = this.router.url.split("?")[0].split("/")[1];

  //   if (this.currentPage == "my-requests") {
  //     this.miniSideBarClickedRequests();
  //   } else if (this.currentPage == "my-properties") {
  //     this.miniSideBarClickedProperties();
  //   } else if (this.currentPage == "reports") {
  //     this.miniSideBarClickedReports();
  //   } else if (this.currentPage == "customer-care") {
  //     this.miniSideBarClickedCustomerCare();
  //   }
  // }
}
