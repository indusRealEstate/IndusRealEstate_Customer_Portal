import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";

@Component({
  selector: "admin_tenant_clients",
  templateUrl: "./admin_tenant_clients.html",
  styleUrls: ["./admin_tenant_clients.scss"],
})
export class AdminTenantClients implements OnInit {
  isUserSignedIn: boolean = false;
  isLoading: boolean = false;
  constructor(
    private adminService: AdminService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
  ) {
    this.isLoading = true;

    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    if (user[0]["auth_type"] != "admin") {
      router.navigate(["/404"]);
    } else {
      this.route.queryParams.subscribe((e) => {
        if (e == null) {
          router.navigate(["/admin-tenant-clients"], {
            queryParams: { uid: user[0]["id"] },
          });
        } else if (e != user[0]["id"]) {
          router.navigate(["/admin-tenant-clients"], {
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

  async ngOnInit() {}

  cacheInSession() {}

  async getAllClients(userId) {
    this.adminService.getAllClients(userId).subscribe((e: Array<any>) => {});
  }
}
