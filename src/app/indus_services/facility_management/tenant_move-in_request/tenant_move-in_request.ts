import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    if (this.authenticationService.currentUserValue) {
      var userData = localStorage.getItem("currentUser");
      var user = JSON.parse(userData);
      if (user[0]["auth_type"] != "admin") {
        this.isUserSignedIn = true;

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
        router.navigate(["/admin-dashboard"]);
      }
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  ngOnInit(): void {}
}