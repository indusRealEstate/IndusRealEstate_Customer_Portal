import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "admin_clients",
  templateUrl: "./admin_clients.html",
  styleUrls: ["./admin_clients.scss"],
})
export class AdminClients implements OnInit {
  isUserSignedIn: boolean = false;
  isLoading: boolean = false;
  isContentLoading: boolean = false;

  noDataPresent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  allClients: any[] = [];

  currentAdminClientsType: any;
  adminClientsTypes: string[] = ["tenant", "landlord"];

  constructor(
    private adminService: AdminService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private otherServices: OtherServices
  ) {
    this.isLoading = true;
    this.isContentLoading = true;

    this.getScreenSize();

    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    if (user[0]["auth_type"] != "admin") {
      router.navigate(["/404"]);
    } else {
      this.route.queryParams.subscribe((e) => {
        if (e == null) {
          router.navigate(["/404"]);
        } else if (e.uid != user[0]["id"]) {
          router.navigate(["/404"]);
        } else if (!this.adminClientsTypes.includes(e.client_type)) {
          router.navigate(["/404"]);
        } else {
          this.currentAdminClientsType = e.client_type;

          otherServices.adminCLientsPageToggle.subscribe((val) => {
            if (val == true) {
              // console.log("not okay");
              this.isLoading = true;
              this.ngOnInit();
            }
          });
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

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  async ngOnInit() {
    this.allClients.length = 0;
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    var sessionDataLandlord = sessionStorage.getItem("all_landlord_clients");
    var sessionDataTenant = sessionStorage.getItem("all_tenant_clients");

    if (this.currentAdminClientsType == "landlord") {
      if (sessionDataLandlord != null) {
        this.allClients = JSON.parse(sessionDataLandlord);
        this.isLoading = false;
        this.isContentLoading = false;
      } else {
        await this.getAllClients(user[0]["id"], "landlord").finally(() => {
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
                      JSON.stringify(this.allClients)
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
    } else {
      if (sessionDataTenant != null) {
        this.allClients = JSON.parse(sessionDataTenant);
        this.isLoading = false;
        this.isContentLoading = false;
      } else {
        await this.getAllClients(user[0]["id"], "tenant").finally(() => {
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
                      "all_tenant_clients",
                      JSON.stringify(this.allClients)
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
  }

  ngOnDestroy() {
    this.noDataPresent.unsubscribe();
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
        await this.getAllClientsDetails(userId);
      }
    });
  }

  checkEveryDataPresent() {
    var dataLack = 0;
    for (let c of this.allClients) {
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
