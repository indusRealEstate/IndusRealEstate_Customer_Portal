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
  isLoading: boolean = false;
  isContentLoading: boolean = true;

  dataPresentInitialize: boolean = false;
  ngDoCheckInitialize_landlord: boolean = false;
  ngDoCheckInitialize_tenant: boolean = false;

  noDataPresent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  allClients: any[] = [];

  usrImgPath: any = "https://indusmanagement.ae/api/upload/img/user/";

  userId: any = JSON.parse(localStorage.getItem("currentUser"))[0]["id"];

  constructor(
    private adminService: AdminService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute
  ) {
    this.isLoading = true;
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
    this.dataPresentInitialize = false;
    this.ngDoCheckInitialize_landlord = true;
    this.ngDoCheckInitialize_tenant = true;
    this.noDataPresent.next(false);
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
      this.isLoading = false;
      this.isContentLoading = false;
      // this.ngDoCheckInitialize = true;
    } else {
      await this.getAllClients(this.userId, "landlord").finally(() => {
        // console.log(this.allLandlordClients);

        setTimeout(() => {
          setTimeout(() => {
            this.noDataPresent.subscribe((val) => {
              if (val == true) {
                // console.log("no data");
                this.getAllClientsDetails(this.userId);
              }
            });
          }, 1000);
        }, 2000);
      });
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);

      setTimeout(async () => {
        await this.checkEveryDataPresent().finally(() => {
          if (this.dataPresentInitialize == true) {
            this.isContentLoading = false;
            sessionStorage.setItem(
              "all_landlord_clients",
              JSON.stringify(this.allClients)
            );
            this.dataPresentInitialize = false;
          }
        });
      }, 5000);
    }
  }

  // ngOnDestroy() {
  //   this.noDataPresent.unsubscribe();
  // }

  async removeDuplicates(myArr: Array<any>) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map((mapObj) => mapObj.id).indexOf(obj.id) === pos;
    });
  }

  async getAllClients(userId, type) {
    this.adminService.getAllClients(userId).subscribe(async (e: Array<any>) => {
      var i = 0;
      for (let c of e) {
        i++;
        if (c.auth_type == type) {
          this.allClients.push(c);
        }
      }

      if (i == e.length) {
        await this.removeDuplicates(this.allClients).then((val) => {
          this.allClients = val;
          setTimeout(async () => {
            await this.getAllClientsDetails(userId);
          }, 1000);
        });
      }
    });
  }

  async checkEveryDataPresent() {
    var dataLack = 0;
    for (let c of this.allClients) {
      if (c.user_details == null) {
        dataLack++;
      }
    }
    setTimeout(() => {
      if (dataLack == 0) {
        this.noDataPresent.next(false);
        this.dataPresentInitialize = true;
      } else {
        this.noDataPresent.next(true);
        this.dataPresentInitialize = false;
      }
    }, 500);
  }

  async getAllClientsDetails(userId) {
    this.adminService
      .getAllClientsDetails(userId)
      .subscribe((c_details: Array<any>) => {
        var i = 0;
        for (let det of c_details) {
          i++;
          for (let c of this.allClients) {
            if (c.id == det.user_id) {
              Object.assign(c, { user_details: det });
            }
          }
        }

        if (i == c_details.length) {
          this.checkEveryDataPresent();
        }
      });
  }
}
