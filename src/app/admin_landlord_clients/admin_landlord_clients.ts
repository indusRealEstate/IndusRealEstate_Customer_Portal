import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "admin_landlord_clients",
  templateUrl: "./admin_landlord_clients.html",
  styleUrls: ["./admin_landlord_clients.scss"],
})
export class AdminLandlordClients implements OnInit {
  isUserSignedIn: boolean = false;
  isLoading: boolean = false;
  isContentLoading: boolean = false;

  noDataPresent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  allLandlordClients: any[] = [];
  constructor(
    private adminService: AdminService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute
  ) {
    this.isLoading = true;
    this.isContentLoading = true;

    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    if (user[0]["auth_type"] != "admin") {
      router.navigate(["/404"]);
    } else {
      this.route.queryParams.subscribe((e) => {
        if (e == null) {
          router.navigate(["/admin-landlord-clients"], {
            queryParams: { uid: user[0]["id"] },
          });
        } else if (e != user[0]["id"]) {
          router.navigate(["/admin-landlord-clients"], {
            queryParams: { uid: user[0]["id"] },
          });
        }
      });
    }
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

  async ngOnInit() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    var sessionData = sessionStorage.getItem("all_landlord_clients");

    if (sessionData != null) {
      this.allLandlordClients = JSON.parse(sessionData);
      this.isLoading = false;
      this.isContentLoading = false;
    } else {
      await this.getAllClients(user[0]["id"]).finally(() => {
        // console.log(this.allLandlordClients);

        setTimeout(() => {
          setTimeout(() => {
            this.noDataPresent.subscribe((val) => {
              if (val == true) {
                // console.log("no data");
                this.getAllClientsDetails(user[0]["id"]);
              } else {
                // console.log("data present");
                setTimeout(() => {
                  this.isContentLoading = false;

                  sessionStorage.setItem(
                    "all_landlord_clients",
                    JSON.stringify(this.allLandlordClients)
                  );
                }, 2000);
              }
            });
          }, 1000);
        }, 2000);
      });
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    }
  }

  ngOnDestroy() {
    this.noDataPresent.unsubscribe();
  }


  async getAllClients(userId) {
    this.adminService.getAllClients(userId).subscribe(async (e: Array<any>) => {
      var i = 0;
      for (let c of e) {
        i++;
        if (c.auth_type == "landlord") {
          this.allLandlordClients.push(c);
        }
      }

      if (i == e.length) {
        await this.getAllClientsDetails(userId);
      }
    });
  }

  checkEveryDataPresent() {
    var dataLack = 0;
    for (let c of this.allLandlordClients) {
      if (c.user_details == null) {
        dataLack++;
      }
    }
    setTimeout(() => {
      if (dataLack == 0) {
        this.noDataPresent.next(false);
      } else {
        this.noDataPresent.next(true);
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
          for (let c of this.allLandlordClients) {
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
