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
import { ReviewRequestDialog } from "./review_req_dialog/review_req_dialog";

@Component({
  selector: "admin-req",
  templateUrl: "./admin-requests.html",
  styleUrls: ["./admin-requests.scss"],
})
export class AdminReqs implements OnInit {
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
    "clientType",
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
    if (user[0]["auth_type"] == "admin") {
      this.route.queryParams.subscribe((e) => {
        if (e == null) {
          router.navigate([`/admin-requests`], {
            queryParams: { uid: user[0]["id"] },
          });
        } else if (e != user[0]["id"]) {
          router.navigate([`/admin-requests`], {
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
      }
    } else {
      setTimeout(() => {
        if (this.allRequestsMatTableData != undefined) {
          this.allRequestsMatTableData.paginator = this.paginator;
        }
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

    var adminReqDataSession = JSON.parse(
      sessionStorage.getItem("admin_reqs_session")
    );

    if (adminReqDataSession != null) {
      this.allRequests = adminReqDataSession;
      this.allRequestsMatTableData = new MatTableDataSource(
        adminReqDataSession
      );
      this.isContentLoading = false;
      this.ngAfterViewInitInitialize = true;
    } else {
      this.adminService
        .getAllRequestsAdmin({
          userId: user[0]["id"],
        })
        .subscribe((va: any[]) => {
          this.allRequests = va;
          this.allRequestsMatTableData = new MatTableDataSource(va);
          setTimeout(() => {
            this.isContentLoading = false;
            if (this.allRequests.length != 0) {
              sessionStorage.setItem(
                "admin_reqs_session",
                JSON.stringify(this.allRequests)
              );
            }
          }, 50);
        });
      sessionStorage.setItem(
        "admin_reqs_fetched_time",
        JSON.stringify(new Date().getMinutes())
      );
    }

    console.log(this.allRequests);

    var now = new Date().getMinutes();

    var diff =
      now -
      Number(JSON.parse(sessionStorage.getItem("admin_reqs_fetched_time")));

    if (diff >= 20) {
      // this.isLoading = true;
      this.isContentLoading = true;
      this.clearAllVariables();
      sessionStorage.removeItem("admin_reqs_fetched_time");
      sessionStorage.removeItem("admin_reqs_session");
      this.adminService
        .getAllRequestsAdmin({
          userId: user[0]["id"],
        })
        .subscribe((va: any[]) => {
          this.allRequests = va;
          setTimeout(() => {
            this.isContentLoading = false;
            this.allRequestsMatTableData = new MatTableDataSource(
              this.allRequests
            );
            if (this.allRequests.length != 0) {
              sessionStorage.setItem(
                "admin_reqs_session",
                JSON.stringify(this.allRequests)
              );
            }
          }, 100);
        });
      sessionStorage.setItem(
        "admin_reqs_fetched_time",
        JSON.stringify(new Date().getMinutes())
      );
    }
  }

  clearAllVariables() {
    this.allRequests.length = 0;
  }

  // async initFunction(userId) {

  // }

  getRequestType(req_type) {
    if (req_type == "NEW_LANDLORD_REQ") {
      return "New Landlord Account";
    } else if (req_type == "NEW_TENANT_AC") {
      return "New Tenant Account";
    } else if (req_type == "ADD_PROPERTY_REC_EXIST_LANDLORD") {
      return "New Property Add";
    } else if (req_type == "PAYMENT") {
      return "Payment Request";
    }
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
