import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";

@Component({
  selector: "app-notifications-page",
  templateUrl: "./notifications-page.html",
  styleUrls: ["./notifications-page.scss"],
})
export class NotificationsPage implements OnInit {
  isUserSignedIn: boolean = false;

  msgCount: Array<any> = [1, 2, 3, 5];
  sideBarOpened: boolean = true;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private otherServices: OtherServices
  ) {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
      var userData = localStorage.getItem("currentUser");
      var user = JSON.parse(userData);

      if (user[0]["auth_type"] != "admin") {
        this.route.queryParams.subscribe((e) => {
          if (e == null) {
            router.navigate([`/notifications`], {
              queryParams: { uid: user[0]["id"] },
            });
          } else if (e != user[0]["id"]) {
            router.navigate([`/notifications`], {
              queryParams: { uid: user[0]["id"] },
            });
          }
        });
      } else {
        router.navigate(["/admin-dashboard"]);
      }
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  ngOnInit() {
    this.otherServices.miniSideBarClicked.subscribe((val) => {
      this.sideBarOpened = val;
    });
  }
}
