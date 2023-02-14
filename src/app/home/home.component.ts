import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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

  isRecentHappeningsLoading: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private otherService: OtherServices,
    private route: ActivatedRoute
  ) {
    this.isRecentHappeningsLoading = true;
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    if (user[0]["auth_type"] == "landlord") {
      this.isLandlord = true;
      this.route.queryParams.subscribe((e) => {
        if (e == null) {
          router.navigate(["/home"], { queryParams: { uid: user[0]["id"] } });
        } else if (e != user[0]["id"]) {
          router.navigate(["/home"], { queryParams: { uid: user[0]["id"] } });
        }
      });
    } else if (user[0]["auth_type"] == "tenant") {
      this.isLandlord = false;
      this.route.queryParams.subscribe((e) => {
        if (e == null) {
          router.navigate(["/home"], { queryParams: { uid: user[0]["id"] } });
        } else if (e != user[0]["id"]) {
          router.navigate(["/home"], { queryParams: { uid: user[0]["id"] } });
        }
      });
    } else {
      this.isLandlord = false;
      router.navigate(["/admin-dashboard"], {
        queryParams: { uid: user[0]["id"] },
      });
    }

    this.scrollToTop();
  }

  scrollToTop() {
    // window.scrollTo(0, 0);
  }

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  async getUserRecentHappenings() {
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
      }, 2000);
    }
  }

  async ngOnInit() {
    this.isUserSignOut();
    this.getUserDataFromLocal();
    await this.initFunction();

    console.log(window.location);
  }

  async initFunction() {
    var recentHeppeningsSessionData =
      sessionStorage.getItem("recentHeppenings");

    if (recentHeppeningsSessionData != null) {
      var data = JSON.parse(recentHeppeningsSessionData);
      this.recentHeppenings = data;
      this.isRecentHappeningsLoading = false;
    } else {
      await this.getUserRecentHappenings().then(() => {
        setTimeout(() => {
          this.isRecentHappeningsLoading = false;
        }, 800);
      });
      sessionStorage.setItem(
        "recentHappeningsDiff",
        JSON.stringify(new Date().getMinutes())
      );
    }

    var now = new Date().getMinutes();

    var diff =
      now - Number(JSON.parse(sessionStorage.getItem("recentHappeningsDiff")));

    if (diff >= 3) {
      this.isRecentHappeningsLoading = true;
      sessionStorage.removeItem("recentHappeningsDiff");
      sessionStorage.removeItem("recentHeppenings");
      this.getUserRecentHappenings();
      sessionStorage.setItem(
        "recentHappeningsDiff",
        JSON.stringify(new Date().getMinutes())
      );
      setTimeout(() => {
        this.isRecentHappeningsLoading = false;
      }, 800);
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
