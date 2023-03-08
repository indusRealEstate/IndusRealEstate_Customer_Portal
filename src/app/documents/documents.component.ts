import { Component, HostListener, OnInit } from "@angular/core";
// import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";

@Component({
  selector: "app-documents",
  templateUrl: "./documents.component.html",
  styleUrls: ["./documents.component.scss"],
})
export class DocumentsComponent implements OnInit {
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
    "docName",
    "uploadDate",
    "docSize",
    "links",
  ];

  dataSource: any[] = [];

  searchType: any[] = [
    "Document Name",
    // "Request type",
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
    this.getScreenSize()
    this.route.queryParams.subscribe((e) => {
      if (e == null) {
        router.navigate([`/documents`], {
          queryParams: { uid: user[0]["id"] },
        });
      } else if (e != user[0]["id"]) {
        router.navigate([`/documents`], {
          queryParams: { uid: user[0]["id"] },
        });
      }
    });
  }

  screenHeight: number;
  screenWidth: number;
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
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
      if (this.selectedSearchType == "Document Name") {
        this.searchResult.length = 0;
        this.dataSource.map((val) => {
          if (
            new String(val.document_name).trim().toLowerCase() ==
            new String(this.searchText).trim().toLowerCase()
          ) {
            return this.searchResult.push(val);
          }
        });
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

    var sessionData = JSON.parse(sessionStorage.getItem("my-docs-session"));

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

    this.apiService.getUserDocuments(userId).subscribe((data: any[]) => {
      this.dataSource = data;
    });
    setTimeout(() => {
      this.isLoading = false;
      if (this.dataSource.length != 0) {
        sessionStorage.setItem(
          "my-docs-session",
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

  // navigateToRequestPage(req_no) {
  //   this.router.navigate(["/request-page"], {
  //     queryParams: { "req-no": req_no },
  //   });
  // }
}
