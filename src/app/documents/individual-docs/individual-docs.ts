import { Component, OnInit, HostListener, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { AdminService } from "app/services/admin.service";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { EmailServices } from "app/services/email.service";
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { ViewDocDialog } from "app/components/view-doc-dialog/view-doc-dialog";

@Component({
  selector: "app-documents-individual",
  templateUrl: "./individual-docs.html",
  styleUrls: ["./individual-docs.scss"],
})
export class IndividualDocumentsComponent implements OnInit {
  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;

  // displayedColumns: string[] = [
  //   // "name",
  //   "issueDate",
  //   "reqNo",
  //   "reqType",
  //   "propertyName",
  //   "clientName",
  //   "status",
  //   "actions",
  // ];

  displayedColumns: string[] = [
    // "name",
    "docName",
    "uploadDate",
    "docSize",
    "propertyName",
    "links",
  ];

  allDocuments: any[] = [];
  allDocumentsMatTableData: MatTableDataSource<any>;
  ngAfterViewInitInitialize: boolean = false;

  loadingTable: any[] = [1, 2, 3, 4, 5];
  allDocumentsSearched: any[] = [];

  isUserSearchedRequests: boolean = false;
  isUserSearchedEmpty: boolean = false;

  searchString: any = "";

  imagesUrl: any;

  userAuth: any;

  userDetails: any;

  isUserDetailsLoading: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private adminService: AdminService,
    private dialog?: MatDialog
  ) {
    // this.isLoading = true;
    this.isContentLoading = true;
    this.isUserDetailsLoading = true;

    this.getScreenSize();
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    if (user[0]["auth_type"] == "admin") {
      this.route.queryParams.subscribe((e) => {
        this.route.queryParams.subscribe((e) => {
          this.initFunction(e);
        });
      });
    } else {
      router.navigate([`/404`]);
    }
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

  initFunction(param: any) {
    this.imagesUrl = this.apiService.getBaseUrlImages();
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.userAuth = user[0]["auth_type"];

    this.adminService
      .getUserAllDocuments(user[0]["id"], param["userId"])
      .subscribe((data: any[]) => {
        this.allDocuments = data;
        this.allDocumentsMatTableData = new MatTableDataSource(data);
        setTimeout(() => {
          this.isContentLoading = false;
        }, 50);
      });

    this.apiService.getUser(param["userId"]).subscribe((userdata) => {
      this.userDetails = userdata[0];

      setTimeout(() => {
        this.isUserDetailsLoading = false;
      }, 100);
    });
  }

  screenHeight: number;
  screenWidth: number;
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.allDocumentsMatTableData != undefined) {
        this.allDocumentsMatTableData.paginator = this.paginator;
      }
    }, 1000);
  }

  ngOnInit() {}

  // async initFunction(userId, auth) {

  // }
}
