import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";

@Component({
  selector: "admin_properties",
  templateUrl: "./admin_properties.html",
  styleUrls: ["./admin_properties.scss"],
})
export class AdminProperties implements OnInit {
  isUserSignedIn: boolean = false;
  isLoading: boolean = false;

  allProperties: any[] = [];

  currentPropertyType: any;
  adminPropertyTypes: string[] = ["rent", "sale"];

  constructor(
    private adminService: AdminService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private otherServices: OtherServices
  ) {
    this.isLoading = true;
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
        } else if (!this.adminPropertyTypes.includes(e.prop_type)) {
          router.navigate(["/404"]);
        } else {
          this.currentPropertyType = e.prop_type;

          otherServices.adminPropertyPageToggle.subscribe((val) => {
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

  displayedColumns: string[] = [
    // "name",
    "requestNo",
    "dateIssued",
    "clientName",
    "propertyName",
    "location",
    "requestType",
    "agent",
    "status",
    "view",
  ];

  dataSource: any[] = [];

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  async ngOnInit() {
    this.allProperties.length = 0;
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    var sessionDataRent = sessionStorage.getItem("all_rent_properties");
    var sessionDataSale = sessionStorage.getItem("all_sale_properties");

    if (this.currentPropertyType == "rent") {
      if (sessionDataRent != null) {
        this.dataSource = JSON.parse(sessionDataRent);
        this.isLoading = false;
      } else {
        await this.getAllProperties(user[0]["id"], "rent").finally(() => {
          // console.log(this.allLandlordClients);

          setTimeout(() => {
            this.dataSource = this.allProperties;
            this.isLoading = false;

            sessionStorage.setItem(
              "all_rent_properties",
              JSON.stringify(this.allProperties)
            );
          }, 2000);
        });
      }
    } else {
      if (sessionDataSale != null) {
        this.dataSource = JSON.parse(sessionDataSale);
        this.isLoading = false;
      } else {
        await this.getAllProperties(user[0]["id"], "sale").finally(() => {
          // console.log(this.allLandlordClients);

          setTimeout(() => {
            this.dataSource = this.allProperties;
            this.isLoading = false;

            sessionStorage.setItem(
              "all_sale_properties",
              JSON.stringify(this.allProperties)
            );
          }, 2000);
        });
      }
    }
  }

  async getAllProperties(userId, type) {
    this.adminService
      .getAllProperties(userId)
      .subscribe(async (e: Array<any>) => {
        var i = 0;
        for (let c of e) {
          i++;
          if (c.property_state == type) {
            this.allProperties.push(c);
          }
        }
      });
  }
}