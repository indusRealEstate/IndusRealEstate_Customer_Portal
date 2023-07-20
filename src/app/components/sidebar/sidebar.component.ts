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

export const HOMEROUTEADMIN: any[] = [
  {
    path: "/admin-dashboard",
    title: "Overview",
    icon: "assets/img/svg/sidebar/activity.svg",
    class: "",
  },
  {
    path: "/admin-properties-sale",
    title: "Sale Properties",
    icon: "assets/img/svg/sidebar/buildings.svg",
    class: "",
  },
  {
    path: "/admin-properties-rent",
    title: "Rent Properties",
    icon: "assets/img/svg/sidebar/buildings.svg",
    class: "",
  },
  // {
  //   path: "/admin-all-landlords",
  //   title: "All Landlord Clients",
  //   icon: "assets/img/svg/sidebar/clients.svg",
  //   class: "",
  // },
  // {
  //   path: "/admin-all-tenants",
  //   title: "All Tenant Clients",
  //   icon: "assets/img/svg/sidebar/clients.svg",
  //   class: "",
  // },
];

export const ARCHIVEDREQUESTSROUTEADMIN: RouteInfo[] = [
  {
    path: "/admin-requests-archive",
    title: "Archived Requests",
    icon: "assets/img/pngs/archive.png",
    class: "",
  },
  {
    path: "/admin-requests-spam",
    title: "Spam Requests",
    icon: "assets/img/pngs/spam-icon.png",
    class: "",
  },
];

export const CHATSROUTEADMIN: RouteInfo[] = [
  {
    path: "/user-chats",
    title: "Chats",
    icon: "assets/img/svg/sidebar/messages-1.svg",
    class: "",
  },
];

export const DOCUMENTSROUTEADMIN: RouteInfo[] = [
  {
    path: "/all-clients-documents",
    title: "All Clients Documents",
    icon: "assets/img/svg/sidebar/file-text.svg",
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
];

export const ROUTES: RouteInfo[] = [];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  homeRouteAdmin: any[];

  documentsRouteAdmin: any[];

  requestsRouteAdmin: any[];

  archivedRequestsRouteAdmin: any[];
  chatsRouteAdmin: any[];

  user: User;
  userProfilePic: any = false;
  userDetails: any;
  profilePicUpdatingLoader: boolean = false;
  userProfileFetching: boolean = false;
  sideBarClicked: boolean = true;

  sideBarTextShow: boolean = true;

  isDashboardOpened: boolean = true;

  isServicesOpened: boolean = false;
  isDocumentsOpened: boolean = false;
  isRequestsOpened: boolean = false;
  isArchiveRequestsOpened: boolean = false;
  isChatsOpened: boolean = false;
  isPaymentsOpened: boolean = false;

  currentPage: any;

  usrImgPath: any = "https://indusre.app/api/upload/img/user/";

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

    otherServices.userSignedIn.subscribe((home_val) => {
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

    this.homeRouteAdmin = HOMEROUTEADMIN.filter((menuItem) => menuItem);

    this.documentsRouteAdmin = DOCUMENTSROUTEADMIN.filter(
      (menuItem) => menuItem
    );

    this.requestsRouteAdmin = REQUESTSROUTEADMIN.filter((menuItem) => menuItem);
    this.archivedRequestsRouteAdmin = ARCHIVEDREQUESTSROUTEADMIN.filter(
      (menuItem) => menuItem
    );
    this.chatsRouteAdmin = CHATSROUTEADMIN.filter((menuItem) => menuItem);
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  servicesSideBarClicked() {
    this.otherServices.servicePageToggle.next(true);
    setTimeout(() => {
      this.otherServices.servicePageToggle.next(false);
    }, 0);
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
    this.apiServices
      .getUserDetails(userId)
      .subscribe((e: any) => {
        this.userDetails = e[0];
        if (e[0]["profile_photo"] != "") {
          this.userProfilePic = e[0]["profile_photo"];
        } else {
          this.userProfilePic = false;
        }
      })
      .add(() => {
        this.userProfileFetching = false;
      });
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
        this.isDocumentsOpened == false &&
        this.isPaymentsOpened == false &&
        this.isServicesOpened == false &&
        this.isRequestsOpened == false &&
        this.isArchiveRequestsOpened == false &&
        this.isChatsOpened == false
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
      this.isArchiveRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isServicesOpened = false;
      this.isChatsOpened = false;

      setTimeout(() => {
        this.sideBarTextShow = true;
      }, 200);
    } else {
      this.isDashboardOpened = true;
      this.isRequestsOpened = false;
      this.isArchiveRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isServicesOpened = false;
      this.isChatsOpened = false;
      this.sideBarTextShow = true;
    }
  }

  miniSideBarClickedProperties() {
    var sideBarValue = this.otherServices.miniSideBarClicked.getValue();
    if (sideBarValue == false) {
      this.otherServices.miniSideBarClicked.next(true);
      this.isRequestsOpened = false;
      this.isArchiveRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isDashboardOpened = false;
      this.isServicesOpened = false;
      this.isChatsOpened = false;

      setTimeout(() => {
        this.sideBarTextShow = true;
      }, 200);
    } else {
      this.isRequestsOpened = false;
      this.isArchiveRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isDashboardOpened = false;
      this.isServicesOpened = false;
      this.isChatsOpened = false;
      this.sideBarTextShow = true;
    }
  }
  miniSideBarClickedTenants() {
    var sideBarValue = this.otherServices.miniSideBarClicked.getValue();
    if (sideBarValue == false) {
      this.otherServices.miniSideBarClicked.next(true);
      this.isRequestsOpened = false;
      this.isArchiveRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isDashboardOpened = false;
      this.isServicesOpened = false;
      this.isChatsOpened = false;

      setTimeout(() => {
        this.sideBarTextShow = true;
      }, 200);
    } else {
      this.isRequestsOpened = false;
      this.isArchiveRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isDashboardOpened = false;
      this.isServicesOpened = false;
      this.isChatsOpened = false;
      this.sideBarTextShow = true;
    }
  }

  miniSideBarClickedLandlord() {
    var sideBarValue = this.otherServices.miniSideBarClicked.getValue();
    if (sideBarValue == false) {
      this.otherServices.miniSideBarClicked.next(true);
      this.isRequestsOpened = false;
      this.isArchiveRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isDashboardOpened = false;
      this.isServicesOpened = false;
      this.isChatsOpened = false;

      setTimeout(() => {
        this.sideBarTextShow = true;
      }, 200);
    } else {
      this.isRequestsOpened = false;
      this.isArchiveRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isDashboardOpened = false;
      this.isServicesOpened = false;
      this.isChatsOpened = false;
      this.sideBarTextShow = true;
    }
  }

  miniSideBarClickedServices() {
    var sideBarValue = this.otherServices.miniSideBarClicked.getValue();
    if (sideBarValue == false) {
      this.otherServices.miniSideBarClicked.next(true);
      this.isServicesOpened = true;
      this.isRequestsOpened = false;
      this.isArchiveRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isDashboardOpened = false;
      this.isChatsOpened = false;

      setTimeout(() => {
        this.sideBarTextShow = true;
      }, 200);
    } else {
      this.isServicesOpened = true;
      this.isRequestsOpened = false;
      this.isArchiveRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isDashboardOpened = false;
      this.isChatsOpened = false;
      this.sideBarTextShow = true;
    }
  }

  miniSideBarClickedDocuments() {
    var sideBarValue = this.otherServices.miniSideBarClicked.getValue();
    if (sideBarValue == false) {
      this.otherServices.miniSideBarClicked.next(true);
      this.isDocumentsOpened = true;
      this.isRequestsOpened = false;
      this.isArchiveRequestsOpened = false;
      this.isServicesOpened = false;
      this.isDashboardOpened = false;
      this.isChatsOpened = false;

      setTimeout(() => {
        this.sideBarTextShow = true;
      }, 200);
    } else {
      this.isDocumentsOpened = true;
      this.isRequestsOpened = false;
      this.isArchiveRequestsOpened = false;
      this.isServicesOpened = false;
      this.isDashboardOpened = false;
      this.isChatsOpened = false;
      this.sideBarTextShow = true;
    }
  }

  miniSideBarClickedRequests() {
    var sideBarValue = this.otherServices.miniSideBarClicked.getValue();
    if (sideBarValue == false) {
      this.otherServices.miniSideBarClicked.next(true);
      this.isRequestsOpened = true;
      this.isArchiveRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isServicesOpened = false;
      this.isDashboardOpened = false;
      this.isChatsOpened = false;

      setTimeout(() => {
        this.sideBarTextShow = true;
      }, 200);
    } else {
      this.isRequestsOpened = true;
      this.isArchiveRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isServicesOpened = false;
      this.isDashboardOpened = false;
      this.isChatsOpened = false;
      this.sideBarTextShow = true;
    }
  }

  miniSideBarClickedArchivedRequests() {
    var sideBarValue = this.otherServices.miniSideBarClicked.getValue();
    if (sideBarValue == false) {
      this.otherServices.miniSideBarClicked.next(true);
      this.isArchiveRequestsOpened = true;
      this.isRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isServicesOpened = false;
      this.isDashboardOpened = false;
      this.isChatsOpened = false;

      setTimeout(() => {
        this.sideBarTextShow = true;
      }, 200);
    } else {
      this.isArchiveRequestsOpened = true;
      this.isRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isServicesOpened = false;
      this.isDashboardOpened = false;
      this.isChatsOpened = false;
      this.sideBarTextShow = true;
    }
  }

  miniSideBarClickedReports() {
    var sideBarValue = this.otherServices.miniSideBarClicked.getValue();
    if (sideBarValue == false) {
      this.otherServices.miniSideBarClicked.next(true);
      this.isRequestsOpened = false;
      this.isArchiveRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isServicesOpened = false;
      this.isDashboardOpened = false;
      this.isChatsOpened = false;

      setTimeout(() => {
        this.sideBarTextShow = true;
      }, 200);
    } else {
      this.isRequestsOpened = false;
      this.isArchiveRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isServicesOpened = false;
      this.isDashboardOpened = false;
      this.isChatsOpened = false;
      this.sideBarTextShow = true;
    }
  }

  miniSideBarClickedCustomerCare() {
    var sideBarValue = this.otherServices.miniSideBarClicked.getValue();
    if (sideBarValue == false) {
      this.otherServices.miniSideBarClicked.next(true);
      this.isRequestsOpened = false;
      this.isArchiveRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isServicesOpened = false;
      this.isDashboardOpened = false;
      this.isChatsOpened = false;

      setTimeout(() => {
        this.sideBarTextShow = true;
      }, 200);
    } else {
      this.isRequestsOpened = false;
      this.isArchiveRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isServicesOpened = false;
      this.isDashboardOpened = false;
      this.isChatsOpened = false;
      this.sideBarTextShow = true;
    }
  }

  miniSideBarClickedChats() {
    var sideBarValue = this.otherServices.miniSideBarClicked.getValue();
    if (sideBarValue == false) {
      this.otherServices.miniSideBarClicked.next(true);
      this.isChatsOpened = true;
      this.isRequestsOpened = false;
      this.isArchiveRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isServicesOpened = false;
      this.isDashboardOpened = false;

      setTimeout(() => {
        this.sideBarTextShow = true;
      }, 200);
    } else {
      this.isChatsOpened = true;
      this.isRequestsOpened = false;
      this.isArchiveRequestsOpened = false;
      this.isDocumentsOpened = false;
      this.isServicesOpened = false;
      this.isDashboardOpened = false;
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
