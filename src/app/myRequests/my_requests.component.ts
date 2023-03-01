import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
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

  searchText: any;

  searchResult: any[] = [];

  isUserSignedIn: boolean = false;

  isSearchTypeNotSelected: boolean = false;
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

  searchType: any[] = [
    // "Name",
    "Request number",
    "Request type",
    "Property name",
    // "Created date",
  ];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute
  ) {
    this.isLoading = true;
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

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
    if (this.selectedSearchType == null) {
      this.isSearchTypeNotSelected = true;

      setTimeout(() => {
        this.isSearchTypeNotSelected = false;
      }, 2500);
    } else if (this.searchText == null || this.searchText == "") {
      this.isSearchTextEmpty = true;

      setTimeout(() => {
        this.isSearchTextEmpty = false;
      }, 2500);
    } else {
      this.isSearchBtnClicked = true;
      if (this.selectedSearchType == "Request number") {
        this.searchResult.length = 0;
        this.dataSource.map((val) => {
          if (
            new String(val.request_no).trim().toLowerCase() ==
            new String(this.searchText).trim().toLowerCase()
          ) {
            return this.searchResult.push(val);
          }
        });
      } else if (this.selectedSearchType == "Request type") {
        this.searchResult.length = 0;
        this.dataSource.map((val) => {
          if (
            new String(val.request_type).trim().toLowerCase() ==
            new String(this.searchText).trim().toLowerCase()
          ) {
            return this.searchResult.push(val);
          }
        });
        console.log(this.searchResult);
      } else if (this.selectedSearchType == "Property name") {
        this.searchResult.length = 0;
        this.dataSource.map((val) => {
          if (
            new String(val.property_name).trim().toLowerCase() ==
            new String(this.searchText).trim().toLowerCase()
          ) {
            return this.searchResult.push(val);
          }
        });
        console.log(this.searchResult);
      }
    }
  }

  closeResults() {
    this.searchResult.length = 0;
    this.isSearchBtnClicked = false;
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
    this.isUserSignOut();

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

      setTimeout(() => {
        this.isLoading = false;
        sessionStorage.setItem(
          "my-requests-session",
          JSON.stringify({
            data: data,
          })
        );
      }, 3000);
    });
  }
}
