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
  selector: "app-requests-payment",
  templateUrl: "./payment-req.html",
  styleUrls: ["./payment-req.scss"],
})
export class RequestsComponentPayment implements OnInit {
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
          router.navigate([`/payment-requests`], {
            queryParams: { uid: user[0]["id"] },
          });
        } else if (e != user[0]["id"]) {
          router.navigate([`/payment-requests`], {
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
      this.allRequestsMatTableData = new MatTableDataSource(this.allRequests);
      this.allRequestsMatTableData.paginator = this.paginator;
    } else {
      setTimeout(() => {
        this.allRequestsMatTableData = new MatTableDataSource(this.allRequests);
        this.allRequestsMatTableData.paginator = this.paginator;
      }, 1000);
    }
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
      sessionStorage.getItem("payment-reqs-session")
    );

    if (adminReqDataSession != null) {
      this.allRequests = adminReqDataSession;
      // this.isLoading = false;
      this.isContentLoading = false;
      this.ngAfterViewInitInitialize = true;
    } else {
      await this.initFunction(user[0]["id"], user[0]["auth_type"]);
      sessionStorage.setItem(
        "payment_reqs_fetched_time",
        JSON.stringify(new Date().getMinutes())
      );
    }

    var now = new Date().getMinutes();

    var diff =
      now -
      Number(JSON.parse(sessionStorage.getItem("payment_reqs_fetched_time")));

    if (diff >= 10) {
      // this.isLoading = true;
      this.isContentLoading = true;
      this.clearAllVariables();
      sessionStorage.removeItem("payment_reqs_fetched_time");
      sessionStorage.removeItem("payment-reqs-session");
      await this.initFunction(user[0]["id"], user[0]["auth_type"]);
      sessionStorage.setItem(
        "payment_reqs_fetched_time",
        JSON.stringify(new Date().getMinutes())
      );
    }
  }

  clearAllVariables() {
    this.allRequests.length = 0;
  }

  async initFunction(userId, auth) {
    this.apiService
      .getUserPaymentRequests(userId, auth)
      .subscribe((va: any[]) => {
        this.allRequests = va;
        console.log(va);
      });

    setTimeout(() => {
      this.isContentLoading = false;
      if (this.allRequests.length != 0) {
        sessionStorage.setItem(
          "payment-reqs-session",
          JSON.stringify(this.allRequests)
        );
      }
    }, 1500);
  }

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
