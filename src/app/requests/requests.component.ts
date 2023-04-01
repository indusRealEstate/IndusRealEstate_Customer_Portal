import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";

@Component({
  selector: "app-requests",
  templateUrl: "./requests.component.html",
  styleUrls: ["./requests.component.scss"],
})
export class RequestsComponent implements OnInit {
  selectedSearchType: any;

  searchText: any = "";

  searchResult: any[] = [];

  currentRequestPageType: any;
  requestPagesTypes: string[] = [
    "my-requests",
    "maintenance",
    "tenant-move-in",
    "tenant-move-out",
    "payment",
    "conditioning",
  ];

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

  dataSourceMyReq: any[] = [];
  dataSourceAuths: any[] = [];
  dataSourceUpdated: any[] = [];

  requestToggleVal: number;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private otherServices: OtherServices
  ) {
    this.isLoading = true;
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
      var userData = localStorage.getItem("currentUser");
      var user = JSON.parse(userData);

      if (user[0]["auth_type"] != "admin") {
        this.route.queryParams.subscribe((e) => {
          if (e == null) {
            router.navigate(["/404"]);
          } else if (e.uid != user[0]["id"]) {
            router.navigate(["/404"]);
          } else if (!this.requestPagesTypes.includes(e.req_type)) {
            router.navigate(["/404"]);
          } else {
            this.currentRequestPageType = e.req_type;

            otherServices.requestsToggle.subscribe((val) => {
              if (val == true) {
                // console.log("not okay");
                this.isLoading = true;
                this.ngOnInit();
              }
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

  // ngOnDestroy() {
  //   this.otherServices.requestsToggle.unsubscribe();
  // }

  getRequestCardTitle() {
    switch (this.currentRequestPageType) {
      case "my-requests":
        return "My Requests";
      case "maintenance":
        return "Maintenance Requests";
      case "tenant-move-in":
        return "Tenant Move-in Requests";
      case "tenant-move-out":
        return "Tenant Move-out Requests";
      case "payment":
        return "Payment Requests";
      case "conditioning":
        return "Property Conditioning Requests";
      default:
        break;
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

      for (let index = 0; index < this.dataSourceUpdated.length; index++) {
        var e = JSON.stringify(this.dataSourceUpdated[index])
          .trim()
          .replace(/ /g, "")
          .toLowerCase()
          .includes(
            new String(this.searchText).trim().replace(/ /g, "").toLowerCase()
          );

        if (e == true) {
          this.searchResult.push(this.dataSourceUpdated[index]);
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

  async sortRequestsByType() {
    if (this.currentRequestPageType != "my-requests") {
      if (this.currentRequestPageType == "payment") {
        this.dataSourceUpdated.length = 0;
        for (let index = 0; index < this.dataSourceAuths.length; index++) {
          if (this.dataSourceAuths[index].request_type == "payment") {
            this.dataSourceUpdated.push(this.dataSourceAuths[index]);
          }
        }
      } else if (this.currentRequestPageType == "maintenance") {
        this.dataSourceUpdated.length = 0;
        for (let index = 0; index < this.dataSourceAuths.length; index++) {
          if (this.dataSourceAuths[index].request_type == "maintenance") {
            this.dataSourceUpdated.push(this.dataSourceAuths[index]);
          }
        }
      } else if (this.currentRequestPageType == "tenant-move-in") {
        this.dataSourceUpdated.length = 0;
        for (let index = 0; index < this.dataSourceAuths.length; index++) {
          if (this.dataSourceAuths[index].request_type == "tenant_move_in") {
            this.dataSourceUpdated.push(this.dataSourceAuths[index]);
          }
        }
      } else if (this.currentRequestPageType == "tenant-move-out") {
        this.dataSourceUpdated.length = 0;
        for (let index = 0; index < this.dataSourceAuths.length; index++) {
          if (this.dataSourceAuths[index].request_type == "tenant_move_out") {
            this.dataSourceUpdated.push(this.dataSourceAuths[index]);
          }
        }
      } else if (this.currentRequestPageType == "conditioning") {
        this.dataSourceUpdated.length = 0;
        for (let index = 0; index < this.dataSourceAuths.length; index++) {
          if (this.dataSourceAuths[index].request_type == "conditioning") {
            this.dataSourceUpdated.push(this.dataSourceAuths[index]);
          }
        }
      }
    } else {
      // console.log('my-req')
      this.dataSourceUpdated.length = 0;
      for (let index = 0; index < this.dataSourceMyReq.length; index++) {
        this.dataSourceUpdated.push(this.dataSourceMyReq[index]);
      }
    }
  }

  ngDoCheck() {
    if (this.isLoading == false) {
      if (this.currentRequestPageType == "my-requests") {
        var sessionDataMyReq = JSON.parse(
          sessionStorage.getItem("my-requests-session")
        );
        if (sessionDataMyReq != null) {
          if (this.dataSourceUpdated.length == 0) {
            this.isLoading = true;
          }
        }
      }
    }
  }

  async ngOnInit() {
    this.dataSourceMyReq.length = 0;
    this.dataSourceAuths.length = 0;
    this.dataSourceUpdated.length = 0;
    var sessionDataMyReq = JSON.parse(
      sessionStorage.getItem("my-requests-session")
    );
    var sessionDataAuths = JSON.parse(
      sessionStorage.getItem("requests-session-auth")
    );

    // console.log(sessionDataAuths, "auth");
    // console.log(sessionDataMyReq, "my-req");

    if (this.currentRequestPageType == "my-requests") {
      if (sessionDataMyReq != null) {
        // console.log("my-req");
        this.dataSourceMyReq = sessionDataMyReq["data"];
        await this.sortRequestsByType().finally(() => {
          setTimeout(() => {
            this.isLoading = false;
          }, 300);
        });
      } else {
        this.getUserRequestDetails();
      }
    } else {
      if (sessionDataAuths != null) {
        this.dataSourceAuths = sessionDataAuths["data"];
        await this.sortRequestsByType().finally(() => {
          setTimeout(() => {
            this.isLoading = false;
          }, 300);
        });
      } else {
        this.getUserRequestDetails();
      }
    }
  }

  getUserRequestDetails() {
    var data = localStorage.getItem("currentUser");
    var user = JSON.parse(data);
    var userId = user[0]["id"];

    if (this.currentRequestPageType == "my-requests") {
      this.apiService
        .getUserRequestDetails(userId, "self")
        .subscribe((req_data: any[]) => {
          if (req_data.length != 0) {
            this.dataSourceMyReq = req_data;
          }
        });

      setTimeout(async () => {
        await this.sortRequestsByType().finally(() => {
          setTimeout(() => {
            this.isLoading = false;
          }, 300);
        });
        if (this.dataSourceMyReq.length != 0) {
          sessionStorage.setItem(
            "my-requests-session",
            JSON.stringify({
              data: this.dataSourceMyReq,
            })
          );
        }
      }, 3000);
    } else {
      if (user[0]["auth_type"] == "landlord") {
        this.apiService
          .getUserRequestDetails(userId, "tenant")
          .subscribe((data: any[]) => {
            if (data.length != 0) {
              this.dataSourceAuths = data;
            }
          });
      } else {
        this.apiService
          .getUserRequestDetails(userId, "landlord")
          .subscribe((data: any[]) => {
            if (data.length != 0) {
              this.dataSourceAuths = data;
            }
          });
      }

      setTimeout(async () => {
        await this.sortRequestsByType().finally(() => {
          setTimeout(() => {
            this.isLoading = false;
          }, 300);
        });
        if (this.dataSourceAuths.length != 0) {
          sessionStorage.setItem(
            "requests-session-auth",
            JSON.stringify({
              data: this.dataSourceAuths,
            })
          );
        }
      }, 3000);
    }
  }

  navigateToRequestPage(req_no) {
    this.router.navigate(["/request-page"], {
      queryParams: { "req-no": req_no, req_type: this.currentRequestPageType },
    });
  }
}
