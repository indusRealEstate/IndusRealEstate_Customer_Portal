import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";

@Component({
  selector: "add-property",
  templateUrl: "./add_property_from.html",
  styleUrls: ["./add_property_from.scss"],
})
export class AddPropertyForm implements OnInit {
  selectedReport: any = "--None--";
  selectedDateRange: any = "--None--";
  isUserSignedIn: boolean = false;
  textareaValue: any = "hello";

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute
  ) {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    if (user[0]["auth_type"] == "landlord") {
      this.route.queryParams.subscribe((e) => {
        if (e == null) {
          router.navigate([`/add-property-form`], {
            queryParams: { uid: user[0]["id"] },
          });
        } else if (e != user[0]["id"]) {
          router.navigate([`/add-property-form`], {
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
  ngOnInit() {}
}
