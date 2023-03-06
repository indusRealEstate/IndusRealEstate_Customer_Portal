import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "admin_sale_properties",
  templateUrl: "./admin_sale_properties.html",
  styleUrls: ["./admin_sale_properties.scss"],
})
export class AdminSaleProperties implements OnInit {
  isUserSignedIn: boolean = false;
  isLoading: boolean = false;

  allSaleProperties: any[] = [];
  constructor(
    private adminService: AdminService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute
  ) {
    this.isLoading = true;

    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    if (user[0]["auth_type"] != "admin") {
      router.navigate(["/404"]);
    } else {
      this.route.queryParams.subscribe((e) => {
        if (e == null) {
          router.navigate(["/admin-properties-sale"], {
            queryParams: { uid: user[0]["id"] },
          });
        } else if (e != user[0]["id"]) {
          router.navigate(["/admin-properties-sale"], {
            queryParams: { uid: user[0]["id"] },
          });
        }
      });
    }
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
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    var sessionData = sessionStorage.getItem("all_sale_properties");

    if (sessionData != null) {
      this.dataSource = JSON.parse(sessionData);
      this.isLoading = false;
    } else {
      await this.getAllProperties(user[0]["id"]).finally(() => {
        // console.log(this.allLandlordClients);

        setTimeout(() => {
          this.dataSource = this.allSaleProperties;
          this.isLoading = false;

          sessionStorage.setItem(
            "all_sale_properties",
            JSON.stringify(this.allSaleProperties)
          );

          console.log(this.allSaleProperties);
        }, 2000);
      });
    }
  }

  async getAllProperties(userId) {
    this.adminService
      .getAllProperties(userId)
      .subscribe(async (e: Array<any>) => {
        var i = 0;
        for (let c of e) {
          i++;
          if (c.property_state == "sale") {
            this.allSaleProperties.push(c);
          }
        }
      });
  }
}
