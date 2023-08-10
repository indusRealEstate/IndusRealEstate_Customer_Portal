import { Component, HostListener, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import PerfectScrollbar from "perfect-scrollbar";
import * as $ from "jquery";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";
import { FirebaseService } from "app/services/firebase.service";

@Component({
  selector: "app-admin-layout",
  templateUrl: "./admin-layout.component.html",
  styleUrls: ["./admin-layout.component.scss"],
})
export class AdminLayoutComponent implements OnInit {
  isUserSignedOut: boolean = false;
  isLogoutProcessing: boolean = false;

  sideBarClicked: boolean = false;
  successNotificationMessage: any;
  errorNotificationMessage: any;
  screenHeight: number;
  screenWidth: number;

  constructor(
    public location: Location,
    private router: Router,
    private authenticationService: AuthenticationService,
    private otherServices: OtherServices,
    private firebaseService: FirebaseService
  ) {
    if (this.authenticationService.currentUserValue) {
      this.firebaseService.firebaseLogin().then(async () => {});
      otherServices.isUserSignedOut.next(false);
      // this.chatService.socket_connect();
    } else {
      otherServices.isUserSignedOut.next(true);
      this.router.navigate(["/login"]);
    }

    otherServices.isUserSignedOut.subscribe((val) => {
      this.isUserSignedOut = val;
    });

    this.otherServices.isLogoutProcessing.subscribe((e) => {
      this.isLogoutProcessing = e;
    });

    otherServices.miniSideBarClicked.subscribe((val) => {
      this.sideBarClicked = val;
    });
  }

  onActivate(event) {
    // window.scroll(0,0);

    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }

  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  decideScreenRatio() {
    this.getScreenSize();

    if (this.screenWidth <= 430) {
      return "mobile-class";
    } else {
      return "pc-class";
    }
  }

  ngOnInit() {
    // this.isUserSignOut();
    const isWindows = navigator.platform.indexOf("Win") > -1 ? true : false;
  }
  ngAfterViewInit() {
    this.runOnRouteChange();
  }

  runOnRouteChange(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemMainPanel = <HTMLElement>document.querySelector(".main-panel");
      const ps = new PerfectScrollbar(elemMainPanel);
      ps.update();
    }
  }
  isMac(): boolean {
    let bool = false;
    if (
      navigator.platform.toUpperCase().indexOf("MAC") >= 0 ||
      navigator.platform.toUpperCase().indexOf("IPAD") >= 0
    ) {
      bool = true;
    }
    return bool;
  }
}
