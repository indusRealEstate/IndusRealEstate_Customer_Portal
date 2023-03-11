import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";

@Component({
  selector: "tenant_move-in_request",
  templateUrl: "./tenant_move-in_request.html",
  styleUrls: ["./tenant_move-in_request.scss"],
})
export class Tenant_Move_in_Request implements OnInit {
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
    if (user != null) {
      this.route.queryParams.subscribe((e) => {
        if (e == null) {
          router.navigate(["/tenant-move-in-request"], {
            queryParams: { uid: user[0]["id"] },
          });
        } else if (e != user[0]["id"]) {
          router.navigate(["/tenant-move-in-request"], {
            queryParams: { uid: user[0]["id"] },
          });
        }
      });
    } else {
      router.navigate(["/login"]);
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

  ngOnInit(): void {}

  ngAfterViewInit(): void {}
}
