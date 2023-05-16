import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";

@Component({
  selector: "app-my-landlord",
  templateUrl: "./my-landlord.html",
  styleUrls: ["./my-landlord.scss"],
})
export class MyLandlordComponent implements OnInit {
  isUserSignedIn: boolean = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private apiService: ApiService
  ) {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
      var userData = localStorage.getItem("currentUser");
      var user = JSON.parse(userData);

      if (user[0]["auth_type"] != "admin") {
        this.route.queryParams.subscribe((e) => {
          if (e == null) {
            router.navigate([`/my-landlord`], {
              queryParams: { uid: user[0]["id"] },
            });
          } else if (e != user[0]["id"]) {
            router.navigate([`/my-landlord`], {
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

  ngOnInit() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.apiService.getLandlordDetails(user[0]["id"]).subscribe((val) => {
      console.log(val);
    });
  }
}
