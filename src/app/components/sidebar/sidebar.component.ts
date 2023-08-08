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
    path: "/admin-properties",
    title: "All Properties",
    icon: "assets/img/svg/sidebar/buildings.svg",
    class: "",
  },
  {
    path: "/admin-properties-units",
    title: "All units",
    icon: "assets/img/svg/sidebar/buildings.svg",
    class: "",
  },
  {
    path: "/all-users",
    title: "Users",
    icon: "assets/img/svg/admin-dashboard/profile-2user.svg",
    class: "",
  },
  {
    path: "/admin-report",
    title: "Report",
    icon: "assets/img/svg/admin-dashboard/report-com.svg",
    class: "",
  },
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
  {
    path: "/admin-request-category",
    title: "Category",
    icon: "assets/img/svg/sidebar/category.svg",
    class: "",
  },
];

export const LEASEROUTEADMIN: RouteInfo[] = [
  {
    path: "/admin-lease",
    title: "All Lease Contracts",
    icon: "assets/img/svg/sidebar/lease-2.svg",
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

  leaseRouteAdmin: any[];

  archivedRequestsRouteAdmin: any[];
  chatsRouteAdmin: any[];

  user: User;
  sideBarClicked: boolean = true;

  sideBarTextShow: boolean = true;

  isDashboardOpened: boolean = true;

  isRequestsOpened: boolean = false;

  isLeaseOpened: boolean = false;
  isArchiveRequestsOpened: boolean = false;
  isChatsOpened: boolean = false;

  currentPage: any;

  miniSidebarItems: any[] = [
    {
      tooltip: "Dashboard",
      icon: "assets/img/svg/sidebar/home.svg",
    },
    {
      tooltip: "Lease Management",
      icon: "assets/img/svg/sidebar/lease.svg",
    },
    {
      tooltip: "Requests",
      icon: "assets/img/svg/sidebar/menu.svg",
    },
    {
      tooltip: "Archives & Spams",
      icon: "assets/img/svg/sidebar/archive.svg",
    },
    {
      tooltip: "Chats",
      icon: "assets/img/svg/sidebar/messages-1.svg",
    },
  ];

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private otherServices: OtherServices
  ) {
    otherServices.miniSideBarClicked.subscribe((val) => {
      this.sideBarClicked = val;
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
  }

  miniSideBarClick(title: string) {
    switch (title) {
      case "Dashboard":
        this.miniSideBarClickedDashboard();
        break;
      case "Lease Management":
        this.miniSideBarClickedLease();
        break;
      case "Requests":
        this.miniSideBarClickedRequests();
        break;
      case "Archives & Spams":
        this.miniSideBarClickedArchivedRequests();
        break;
      case "Chats":
        this.miniSideBarClickedChats();
        break;
      default:
        break;
    }
  }

  miniSideBarBool(title: string): boolean {
    switch (title) {
      case "Dashboard":
        return this.isDashboardOpened;
      case "Lease Management":
        return this.isLeaseOpened;
      case "Requests":
        return this.isRequestsOpened;
      case "Archives & Spams":
        return this.isArchiveRequestsOpened;
      case "Chats":
        return this.isChatsOpened;
      default:
        break;
    }
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

    this.leaseRouteAdmin = LEASEROUTEADMIN.filter((menuItem) => menuItem);
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
      this.isLeaseOpened = false;
      this.isArchiveRequestsOpened = false;
      this.isChatsOpened = false;

      setTimeout(() => {
        this.sideBarTextShow = true;
      }, 200);
    } else {
      this.isDashboardOpened = true;
      this.isRequestsOpened = false;
      this.isArchiveRequestsOpened = false;
      this.isChatsOpened = false;
      this.isLeaseOpened = false;
      this.sideBarTextShow = true;
    }
  }

  miniSideBarClickedRequests() {
    var sideBarValue = this.otherServices.miniSideBarClicked.getValue();
    if (sideBarValue == false) {
      this.otherServices.miniSideBarClicked.next(true);
      this.isRequestsOpened = true;
      this.isArchiveRequestsOpened = false;
      this.isDashboardOpened = false;
      this.isChatsOpened = false;
      this.isLeaseOpened = false;

      setTimeout(() => {
        this.sideBarTextShow = true;
      }, 200);
    } else {
      this.isRequestsOpened = true;
      this.isArchiveRequestsOpened = false;
      this.isDashboardOpened = false;
      this.isChatsOpened = false;
      this.isLeaseOpened = false;
      this.sideBarTextShow = true;
    }
  }

  miniSideBarClickedLease() {
    var sideBarValue = this.otherServices.miniSideBarClicked.getValue();
    if (sideBarValue == false) {
      this.otherServices.miniSideBarClicked.next(true);
      this.isLeaseOpened = true;
      this.isRequestsOpened = false;
      this.isArchiveRequestsOpened = false;
      this.isDashboardOpened = false;
      this.isChatsOpened = false;

      setTimeout(() => {
        this.sideBarTextShow = true;
      }, 200);
    } else {
      this.isLeaseOpened = true;
      this.isRequestsOpened = false;
      this.isArchiveRequestsOpened = false;
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
      this.isDashboardOpened = false;
      this.isChatsOpened = false;
      this.isLeaseOpened = false;

      setTimeout(() => {
        this.sideBarTextShow = true;
      }, 200);
    } else {
      this.isArchiveRequestsOpened = true;
      this.isRequestsOpened = false;
      this.isDashboardOpened = false;
      this.isChatsOpened = false;
      this.isLeaseOpened = false;
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
      this.isDashboardOpened = false;
      this.isLeaseOpened = false;

      setTimeout(() => {
        this.sideBarTextShow = true;
      }, 200);
    } else {
      this.isChatsOpened = true;
      this.isRequestsOpened = false;
      this.isArchiveRequestsOpened = false;
      this.isDashboardOpened = false;
      this.isLeaseOpened = false;
      this.sideBarTextShow = true;
    }
  }
}
