import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "admin_clients_landlord",
  templateUrl: "./admin_clients_landlord.html",
  styleUrls: ["./admin_clients_landlord.scss"],
})
export class AdminClientsLandlord implements OnInit {
  isUserSignedIn: boolean = false;
  // isLoading: boolean = false;
  isContentLoading: boolean = true;

  allClients: any[] = [];

  usrImgPath: any = "https://indusre.app/api/upload/img/user/";

  userId: any = JSON.parse(localStorage.getItem("currentUser"))[0]["id"];

  constructor(
    private adminService: AdminService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute
  ) {
    // this.isLoading = true;
    this.isContentLoading = true;

    this.getScreenSize();

    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    if (user[0]["auth_type"] != "admin") {
      router.navigate(["/404"]);
    } else {
      this.route.queryParams.subscribe(async (e) => {
        if (e == null) {
          router.navigate(["/404"]);
        } else if (e.uid != user[0]["id"]) {
          router.navigate(["/404"]);
        }
      });
    }
  }

  screenHeight: number;
  screenWidth: number;
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  restoreBack() {
    this.isContentLoading = true;
    this.allClients.length = 0;
  }

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  async ngOnInit() {
    var sessionDataLandlord = sessionStorage.getItem("all_landlord_clients");
    if (sessionDataLandlord != null) {
      this.allClients = JSON.parse(sessionDataLandlord);
      // this.isLoading = false;
      this.isContentLoading = false;
      // this.ngDoCheckInitialize = true;
    } else {
      await this.getAllClients(this.userId).finally(() => {});
    }
  }

  async getAllClients(userId) {
    this.adminService
      .getAllClients(userId, "landlord")
      .subscribe(async (e: Array<any>) => {
        this.allClients = e;

        setTimeout(() => {
          this.isContentLoading = false;
          setTimeout(() => {
            sessionStorage.setItem(
              "all_landlord_clients",
              JSON.stringify(this.allClients)
            );
          }, 500);
        }, 500);
      });
  }
}
