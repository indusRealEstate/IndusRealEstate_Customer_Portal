import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";

@Component({
  selector: "app-myRequests",
  templateUrl: "./my_requests.component.html",
  styleUrls: ["./my_requests.component.scss"],
})
export class MyRequestsComponent implements OnInit {
  selectedSearchType: any;

  searchText: any = "";

  searchResult: any[] = [];

  isUserSignedIn: boolean = false;
  isSearchTextEmpty: boolean = false;

  isSearchBtnClicked: boolean = false;

  isLoading: boolean = false;

  displayedColumns: string[] = [
    // "name",
    "requestNo",
    "requestType",
    "propertyName",
    "status",
    "createdDate",
  ];
  dataSource: any[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute
  ) {
    this.isLoading = true;
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
      var userData = localStorage.getItem("currentUser");
      var user = JSON.parse(userData);

      if (user[0]["auth_type"] != "admin") {
        this.route.queryParams.subscribe((e) => {
          if (e == null) {
            router.navigate([`/my-requests`], {
              queryParams: { uid: user[0]["id"] },
            });
          } else if (e != user[0]["id"]) {
            router.navigate([`/my-requests`], {
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

  requestStatusFont(status) {
    switch (status) {
      case "Requesting Approval":
        return "request-approval";
      case "Approved":
        return "approved";
      case "Denied":
        return "denied";
      default:
        break;
    }
  }

  searchRequest() {
    if (this.searchText == null || this.searchText == "") {
      this.isSearchTextEmpty = true;

      setTimeout(() => {
        this.isSearchTextEmpty = false;
      }, 2500);
    } else {
      this.isSearchBtnClicked = true;

      this.searchResult.length = 0;

      for (let index = 0; index < this.dataSource.length; index++) {
        var e = JSON.stringify(this.dataSource[index])
          .trim()
          .replace(/ /g, "")
          .toLowerCase()
          .includes(
            new String(this.searchText).trim().replace(/ /g, "").toLowerCase()
          );

        if (e == true) {
          this.searchResult.push(this.dataSource[index]);
        }
      }
      // this.dataSource.map((val) => {
      //   if (
      //     new String(val.request_no).trim().toLowerCase() ==
      //     new String(this.searchText).trim().toLowerCase()
      //   ) {
      //     return this.searchResult.push(val);
      //   }
      // });
    }
  }

  closeResults() {
    this.searchResult.length = 0;
    this.isSearchBtnClicked = false;
    this.searchText = "";
  }

  ngOnInit() {
    var sessionData = JSON.parse(sessionStorage.getItem("my-requests-session"));

    if (sessionData != null) {
      this.dataSource = sessionData["data"];
      this.isLoading = false;
    } else {
      this.getUserRequestDetails();
    }
  }

  getUserRequestDetails() {
    var data = localStorage.getItem("currentUser");
    var user = JSON.parse(data);
    var userId = user[0]["id"];

    this.apiService.getUserRequestDetails(userId).subscribe((data: any[]) => {
      this.dataSource = data;
    });
    setTimeout(() => {
      this.isLoading = false;
      if (this.dataSource.length != 0) {
        sessionStorage.setItem(
          "my-requests-session",
          JSON.stringify({
            data: this.dataSource,
          })
        );
      }
    }, 3000);

    // setTimeout(() => {
    //   if(this.isLoading == false){
    //     if(this.dataSource.)
    //   }
    // }, 3500);
  }

  navigateToRequestPage(req_no) {
    this.router.navigate(["/request-page"], {
      queryParams: { "req-no": req_no },
    });
  }
}
