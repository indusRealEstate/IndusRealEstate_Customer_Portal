import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";

@Component({
  selector: "admin_properties_sale",
  templateUrl: "./admin_properties_sale.html",
  styleUrls: ["./admin_properties_sale.scss"],
})
export class AdminPropertiesSale implements OnInit {
  isUserSignedIn: boolean = false;
  isLoading: boolean = false;

  allProperties: any[] = [];

  constructor(
    private adminService: AdminService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute
  ) {
    this.isLoading = true;
    this.getScreenSize();
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    this.route.queryParams.subscribe((e) => {
      if (e == null) {
        router.navigate(["/404"]);
      } else if (e.uid != user[0]["id"]) {
        router.navigate(["/404"]);
      }
    });
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

  ngOnInit() {
    this.allProperties.length = 0;
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    var sessionDataSale = sessionStorage.getItem("all_sale_properties");

    if (sessionDataSale != null) {
      this.dataSource = JSON.parse(sessionDataSale);
      this.isLoading = false;
    } else {
      this.getAllProperties(user[0]["id"], "sale");
    }
  }

  getAllProperties(userId, type) {
    this.adminService
      .getAllProperties(userId, type)
      .subscribe(async (e: Array<any>) => {
        this.allProperties = e;
        this.dataSource = e;
      })
      .add(() => {
        this.isLoading = false;
        sessionStorage.setItem(
          "all_sale_properties",
          JSON.stringify(this.allProperties)
        );
      });
  }
}
