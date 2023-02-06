import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AdminService } from "app/services/admin.service";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";

@Component({
  selector: "admin-requests",
  templateUrl: "./admin-requests.html",
  styleUrls: ["./admin-requests.scss"],
})
export class AdminRequests implements OnInit {
  isUserSignedIn: boolean = false;

  isLoading: boolean = false;

  allRequests: any[] = [];

  isLandlordRequestsEmpty: boolean = false;
  isTenantRequestsEmpty: boolean = false;

  categoryAllRequests: "fixtures" | "payments" | "cat_3" | "cat_4" = "fixtures";
  propertyTypeAllRequests: "all" | "villa" | "appartment" = "all";

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private adminService: AdminService
  ) {
    this.isLoading = true;
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    if (user[0]["auth_type"] == "admin") {
      this.route.queryParams.subscribe((e) => {
        if (e == null) {
          router.navigate([`/admin-requests`], {
            queryParams: { uid: user[0]["id"] },
          });
        } else if (e != user[0]["id"]) {
          router.navigate([`/admin-requests`], {
            queryParams: { uid: user[0]["id"] },
          });
        }
      });
    } else {
      router.navigate([`/404`]);
    }
  }

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }
  ngOnInit() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.fetchAllRequests(user[0]["id"]);

    setTimeout(() => {
      this.checkRequestsEmpty();

      setTimeout(() => {
        this.isLoading = false;
      }, 1500);
    }, 1500);
  }

  fetchAllRequests(userId) {
    this.adminService
      .getAllAddPropertyRequests(userId)
      .subscribe((prop_req: Array<any>) => {
        this.allRequests = prop_req;

        setTimeout(() => {
          for (let req of this.allRequests) {
            this.apiService.getUser(req["user_id"]).subscribe((userDetails) => {
              if (req) {
                Object.assign(req, { userData: userDetails[0] });
              }
            });
          }
        }, 500);
      });

    // this.adminService
    //   .getAllPaymentRequests(userId)
    //   .subscribe((payment_req: Array<any>) => {
        
    //   });
  }

  checkRequestsEmpty() {
    var tenantReqs = 0;
    var landlordReqs = 0;
    for (let req of this.allRequests) {
      if (req.userData.auth_type == "landlord") {
        landlordReqs++;
      } else if (req.userData.auth_type == "tenant") {
        tenantReqs++;
      }
    }

    setTimeout(() => {
      if (landlordReqs == 0) {
        this.isLandlordRequestsEmpty = true;
      }
      if (tenantReqs == 0) {
        this.isTenantRequestsEmpty = true;
      }
    }, 1000);
  }
}
