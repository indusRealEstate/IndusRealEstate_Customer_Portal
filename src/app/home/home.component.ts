import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";
import * as Chartist from "chartist";
import { User } from "../../../models/user/user.model";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  recentHeppenings: any[] = [];
  isUserSignedIn: boolean = false;
  user: User;
  isLandlord: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private otherService: OtherServices
  ) {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    if (user[0]["auth_type"] == "landlord") {
      this.isLandlord = true;
    } else {
      this.isLandlord = false;
    }
  }

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  getUserRecentHappenings() {
    var data = localStorage.getItem("currentUser");
    var user = JSON.parse(data);
    var userId = user[0]["id"];

    try {
      this.apiService.getUserRecentHappenings(userId).subscribe((data: any) => {
        this.recentHeppenings = data;
      });
    } catch (error) {
    } finally {
      setTimeout(() => {
        sessionStorage.setItem(
          "recentHeppenings",
          JSON.stringify(this.recentHeppenings)
        );
      }, 200);
    }
  }

  ngOnInit() {
    this.isUserSignOut();
    this.getUserDataFromLocal();
    this.initFunction();
  }

  initFunction() {
    var recentHeppeningsSessionData =
      sessionStorage.getItem("recentHeppenings");

    if (recentHeppeningsSessionData != null) {
      var data = JSON.parse(recentHeppeningsSessionData);
      this.recentHeppenings = data;
    } else {
      this.getUserRecentHappenings();
      sessionStorage.setItem(
        "recentHappeningsDiff",
        JSON.stringify(new Date().getMinutes())
      );
    }

    var now = new Date().getMinutes();

    var diff =
      now - Number(JSON.parse(sessionStorage.getItem("recentHappeningsDiff")));

    if (diff >= 3) {
      sessionStorage.removeItem("recentHappeningsDiff");
      sessionStorage.removeItem("recentHeppenings");
      this.getUserRecentHappenings();
      sessionStorage.setItem(
        "recentHappeningsDiff",
        JSON.stringify(new Date().getMinutes())
      );

      console.log("refreshed- recent");
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
  }
}
