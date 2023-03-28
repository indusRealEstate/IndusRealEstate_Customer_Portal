import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";
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

  userRequestsCount: number = 0;
  userPropertiesCount: number = 0;

  screenHeight: number;
  screenWidth: number;

  displayedColumns: string[] = [
    // "name",
    "details",
    "propertyName",
    "dateIssued",
    "status",
    "actions",
  ];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private otherServices: OtherServices
  ) {
    this.isRecentHappeningsLoading = true;
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    this.getScreenSize();

    if (
      user[0]["auth_type"] == "landlord" ||
      user[0]["auth_type"] == "tenant"
    ) {
      if (user[0]["auth_type"] != "tenant") {
        this.isLandlord = true;
      } else {
        this.isLandlord = false;
      }
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

  selectedStatusType: any;
  statusType: any[] = ["All", "Approved", "Declined", "Pending"];

  selectedPeriod: any;
  periods: any[] = ["All", "Last 24 hours", "Last 12 hours", "Last 6 hours"];

  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
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
          JSON.stringify({
            recentHap: this.recentHeppenings,
            req_count: this.userRequestsCount,
            prop_count: this.userPropertiesCount,
          })
        );
      }, 2000);
    }
  }

  async ngOnInit() {
    this.isUserSignOut();
    this.getUserDataFromLocal();
    await this.initFunction();
  }

  getUserRequestCount(userId) {
    this.apiService.getUserRequestDetails(userId).subscribe((data: any[]) => {
      setTimeout(() => {
        this.userRequestsCount = data.length;
      }, 200);
    });
  }

  getUserPropertiesCount(userId) {
    this.apiService.getUserProperties(userId).subscribe((data: any[]) => {
      setTimeout(() => {
        this.userPropertiesCount = data.length;
      }, 200);
    });
  }

  async initFunction() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    var userId = user[0]["id"];

    var recentHeppeningsSessionData =
      sessionStorage.getItem("recentHeppenings");

    if (recentHeppeningsSessionData != null) {
      var data = JSON.parse(recentHeppeningsSessionData);
      this.recentHeppenings = data["recentHap"];
      this.userRequestsCount = data["req_count"];
      this.userPropertiesCount = data["prop_count"];
      this.isRecentHappeningsLoading = false;
    } else {
      await this.getUserRecentHappenings().then(() => {
        setTimeout(() => {
          this.isRecentHappeningsLoading = false;
        }, 800);
      });
      this.getUserRequestCount(userId);

      if (user[0]["auth_type"] == "landlord") {
        this.getUserPropertiesCount(userId);
      }
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

  myRequestCardClicked() {
    this.router.navigate(["/my-requests"], {
      queryParams: { uid: this.user.id },
    });

    this.otherServices.myRequestClickedHome.next(true);
  }

  myPropertiesCardClicked() {
    this.router.navigate(["/my-properties"], {
      queryParams: { uid: this.user.id },
    });

    this.otherServices.myPropertiesClickedHome.next(true);
  }

  reportsCardClicked() {
    this.router.navigate(["/reports"], {
      queryParams: { uid: this.user.id },
    });

    this.otherServices.reportsClickedHome.next(true);
  }

  customerCareCardClicked() {
    this.router.navigate(["/customer-care"], {
      queryParams: { uid: this.user.id },
    });

    this.otherServices.customerCareClickedHome.next(true);
  }
}
