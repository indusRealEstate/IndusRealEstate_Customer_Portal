import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";

@Component({
  selector: "tenant_registration",
  templateUrl: "./tenant_registration.component.html",
  styleUrls: ["./tenant_registration.component.scss"],
})
export class Tenant_Registration implements OnInit {
  id: number;

  isUserSignedIn: boolean = false;

  constructor(
    private readonly route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.route.queryParams.subscribe((e) => {
      if (e == null) {
        router.navigate(["/tenant-registration"], {
          queryParams: { uid: user[0]["id"] },
        });
      } else if (e != user[0]["id"]) {
        router.navigate(["/tenant-registration"], {
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
