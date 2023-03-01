import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import PerfectScrollbar from "perfect-scrollbar";
import * as $ from "jquery";
// import { Subscription } from "rxjs";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";

@Component({
  selector: "app-admin-layout",
  templateUrl: "./admin-layout.component.html",
})
export class AdminLayoutComponent implements OnInit {
  // private _router: Subscription;
  // private lastPoppedUrl: string;
  // private yScrollStack: number[] = [];
  isUserSignedOut: boolean = false;
  isLogoutProcessing: boolean = false;
  successNotificationMessage: any;
  errorNotificationMessage: any;

  constructor(
    public location: Location,
    private router: Router,
    private authenticationService: AuthenticationService,
    // private route: ActivatedRoute,
    private otherServices: OtherServices
  ) {
    if (this.authenticationService.currentUserValue) {
      otherServices.isUserSignedOut.next(false);
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
  }

  onActivate(event) {
    // window.scroll(0,0);

    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
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
