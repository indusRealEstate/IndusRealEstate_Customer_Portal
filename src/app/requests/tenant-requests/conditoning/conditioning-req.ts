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
import { ReviewRequestDialog } from "app/admin-requests/review_req_dialog/review_req_dialog";

@Component({
  selector: "app-requests-conditioning",
  templateUrl: "./conditioning-req.html",
  styleUrls: ["./conditioning-req.scss"],
})
export class RequestsComponentConditioning implements OnInit {
  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;
  categoryAllRequests: "new_sign_ups" | "add_new_property" | "others" =
    "new_sign_ups";

  requestViewType: "table_view" | "card_view" = "table_view";

  propertyTypeAllRequests:
    | "all"
    | "villa"
    | "appartment"
    | "town_house"
    | "other" = "all";

  displayedColumns: string[] = [
    // "name",
    "issueDate",
    "reqNo",
    "reqType",
    "propertyName",
    "clientName",
    "status",
    "actions",
  ];

  allRequests: any[] = [];
  allRequestsMatTableData: MatTableDataSource<any>;
  ngAfterViewInitInitialize: boolean = false;

  loadingTable: any[] = [1, 2, 3, 4, 5];
  allRequestsSearched: any[] = [];

  isUserSearchedRequests: boolean = false;
  isUserSearchedEmpty: boolean = false;

  filters: any[] = [];

  searchString: any = "";

  imagesUrl: any;

  userAuth: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private adminService: AdminService,
    private dialog?: MatDialog,
    private emailServices?: EmailServices
  ) {
    // this.isLoading = true;
    this.isContentLoading = true;

    this.getScreenSize();
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    if (user[0]["auth_type"] != "admin") {
      this.route.queryParams.subscribe((e) => {
        if (e == null) {
          router.navigate([`/conditioning-requests`], {
            queryParams: { uid: user[0]["id"] },
          });
        } else if (e != user[0]["id"]) {
          router.navigate([`/conditioning-requests`], {
            queryParams: { uid: user[0]["id"] },
          });
        }
      });
    } else {
      router.navigate([`/404`]);
    }
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
    if (this.ngAfterViewInitInitialize == true) {
      if (this.allRequestsMatTableData != undefined) {
        this.allRequestsMatTableData.paginator = this.paginator;
        this.allRequestsMatTableData.paginator._changePageSize(10);
      }
    } else {
      setTimeout(() => {
        if (this.allRequestsMatTableData != undefined) {
          this.allRequestsMatTableData.paginator = this.paginator;
          this.allRequestsMatTableData.paginator._changePageSize(10);
        }
      }, 1000);
    }
  }

  refreshTable() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    sessionStorage.removeItem("conditioning-reqs-session");
    this.isContentLoading = true;

    this.apiService
      .getUserConditioningRequests(user[0]["id"])
      .subscribe((va: any[]) => {
        this.allRequests = va;
        this.allRequestsMatTableData = new MatTableDataSource(va);
        setTimeout(() => {
          this.isContentLoading = false;
          if (this.allRequests.length != 0) {
            sessionStorage.setItem(
              "conditioning-reqs-session",
              JSON.stringify(this.allRequests)
            );
          }
        }, 50);
      })
      .add(() => {
        setTimeout(() => {
          if (this.allRequestsMatTableData != undefined) {
            this.allRequestsMatTableData.paginator = this.paginator;
            this.allRequestsMatTableData.paginator._changePageSize(10);
          }
        }, 500);
      });
  }

  getRequestStatus(req, last) {
    if (req.status == "pending") {
      return "pending-status";
    } else if (req.status == "approved") {
      return "approved-status";
    } else if (req.status == "declined") {
      return "declined-status";
    }
  }

  async ngOnInit() {
    this.imagesUrl = this.apiService.getBaseUrlImages();
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.userAuth = user[0]["auth_type"];

    var adminReqDataSession = JSON.parse(
      sessionStorage.getItem("conditioning-reqs-session")
    );

    if (adminReqDataSession != null) {
      this.allRequests = adminReqDataSession;
      this.allRequestsMatTableData = new MatTableDataSource(this.allRequests);
      this.isContentLoading = false;
      this.ngAfterViewInitInitialize = true;
    } else {
      this.apiService
        .getUserConditioningRequests(user[0]["id"])
        .subscribe((va: any[]) => {
          this.allRequests = va;
          this.allRequestsMatTableData = new MatTableDataSource(va);
          setTimeout(() => {
            this.isContentLoading = false;

            if (this.allRequests.length != 0) {
              sessionStorage.setItem(
                "conditioning-reqs-session",
                JSON.stringify(this.allRequests)
              );
            }
          }, 50);
        });
      sessionStorage.setItem(
        "conditioning_reqs_fetched_time",
        JSON.stringify(new Date().getMinutes())
      );
    }

    var now = new Date().getMinutes();

    var diff =
      now -
      Number(
        JSON.parse(sessionStorage.getItem("conditioning_reqs_fetched_time"))
      );

    if (diff >= 10) {
      // this.isLoading = true;
      this.isContentLoading = true;
      this.clearAllVariables();
      sessionStorage.removeItem("conditioning_reqs_fetched_time");
      sessionStorage.removeItem("conditioning-reqs-session");
      this.apiService
        .getUserConditioningRequests(user[0]["id"])
        .subscribe((va: any[]) => {
          this.allRequests = va;
          this.allRequestsMatTableData = new MatTableDataSource(va);
          setTimeout(() => {
            this.isContentLoading = false;

            if (this.allRequests.length != 0) {
              sessionStorage.setItem(
                "conditioning-reqs-session",
                JSON.stringify(this.allRequests)
              );
            }
          }, 50);
        });
      sessionStorage.setItem(
        "conditioning_reqs_fetched_time",
        JSON.stringify(new Date().getMinutes())
      );
    }
  }

  clearAllVariables() {
    this.allRequests.length = 0;
  }

  // async initFunction(userId, auth) {

  // }

  reviewRequest(req) {
    this.dialog
      .open(ReviewRequestDialog, {
        width: "70%",
        height: "40rem",
        data: {
          req_data: req,
        },
      })
      .afterClosed()
      .subscribe(async (res) => {});
  }
}
