import { Component, HostListener, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
// import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { ViewDocDialog } from "app/components/view-doc-dialog/view-doc-dialog";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";

@Component({
  selector: "app-documents-individual",
  templateUrl: "./documents-individual.component.html",
  styleUrls: ["./documents-individual.component.scss"],
})
export class IndividualDocumentsComponent implements OnInit {
  selectedSearchType: any;

  searchText: any;

  searchResult: any[] = [];

  isTableEmpty: boolean = false;

  isUserSignedIn: boolean = false;

  userData: any;

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
    private route: ActivatedRoute,
    private otherServices: OtherServices,
    private dialog: MatDialog
  ) {
    this.getScreenSize();
    this.isLoading = true;
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
      var userData = localStorage.getItem("currentUser");
      var user = JSON.parse(userData);
      if (user[0]["auth_type"] == "admin") {
        this.route.queryParams.subscribe((e) => {
          this.initFunction(e);
        });
      } else {
        router.navigate([`/404`]);
      }
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  initFunction(param) {
    this.apiService
      .getUserDocuments(param["userId"])
      .subscribe((data: any[]) => {
        this.dataSource = data;
      });

    this.apiService.getUser(param["userId"]).subscribe((userdata) => {
      this.userData = userdata[0];
    });

    setTimeout(() => {
      if (this.dataSource.length == 0) {
        this.isTableEmpty = true;
        this.isLoading = false;
      } else {
        console.log(this.userData);
        this.isTableEmpty = false;
        this.isLoading = false;
      }
    }, 1500);
  }

  screenHeight: number;
  screenWidth: number;
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  viewDoc(doc) {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.dialog.open(ViewDocDialog, {
      data: {
        doc: doc,
        user_id: user[0]["id"],
        auth_type: user[0]["auth_type"],
      },
      width: "1300px",
      height: "700px",
    });
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

  ngOnInit() {}
}
