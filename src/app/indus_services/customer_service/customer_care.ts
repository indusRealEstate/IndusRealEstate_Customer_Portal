import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";

@Component({
  selector: "customer_care",
  templateUrl: "./customer_care.html",
  styleUrls: ["./customer_care.scss"],
})
export class CustomerCareComponent implements OnInit {
  id: number;
  isUserSignedIn: boolean = false;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute
  ) {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.route.queryParams.subscribe((e) => {
      if (e == null) {
        router.navigate(["/customer-care"], {
          queryParams: { uid: user[0]["id"] },
        });
      } else if (e != user[0]["id"]) {
        router.navigate(["/customer-care"], {
          queryParams: { uid: user[0]["id"] },
        });
      }
    });
  }

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  ngOnInit(): void {
    this.isUserSignOut();
  }
}
