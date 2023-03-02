import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router, RoutesRecognized } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";
import { filter, pairwise, take } from "rxjs";

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
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private otherServices: OtherServices
  ) {
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
      router.navigate([`/404`]);
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

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  docViewBtnClicked(){
    console.log("doc btn")
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  ngOnDestroy() {}
}
