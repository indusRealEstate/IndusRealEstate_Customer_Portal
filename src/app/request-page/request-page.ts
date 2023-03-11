import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";

@Component({
  selector: "request-page",
  templateUrl: "./request-page.html",
  styleUrls: ["./request-page.scss"],
})
export class RequestPage implements OnInit {
  isUserSignedIn: boolean = false;

  requestData: any;

  isLoading: boolean = false;

  previousUrl: string;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute
  ) {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
      var userData = localStorage.getItem("currentUser");
      var user = JSON.parse(userData);
      if (
        user[0]["auth_type"] == "landlord" ||
        user[0]["auth_type"] == "tenant"
      ) {
        this.isLoading = true;
        this.route.queryParams.subscribe((e) => {
          this.initFunction(e);
        });
      } else {
        router.navigate([`/admin-dashboard`]);
      }
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  initFunction(e) {
    try {
      if (sessionStorage.getItem("my-requests-session") != null) {
        var requestsDataSession = JSON.parse(
          sessionStorage.getItem("my-requests-session")
        );
        this.requestData = requestsDataSession["data"].find(
          (x) => x.request_no == e["req-no"]
        );

        if (this.requestData == undefined || this.requestData == null) {
          this.router.navigate(["/404"]);
        }
      } else {
        this.apiService.getRequestLandlord(e).subscribe((e) => {
          this.requestData = e;
        });
      }

      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    } catch (error) {
      console.log(error);
    }
  }

  docViewBtnClicked() {
    console.log("doc btn");
  }

  ngOnInit() {}
}
