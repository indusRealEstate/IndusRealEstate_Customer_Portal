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
import { ReviewRequestDialog } from "app/components/review_req_dialog/review_req_dialog";
import { MatMenuTrigger } from "@angular/material/menu";

@Component({
  selector: "app-requests-payment",
  templateUrl: "./payment-req.html",
  styleUrls: ["./payment-req.scss"],
})
export class RequestsComponentPayment implements OnInit {
  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;

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
  userAuth: any;

  flaggedRequest: boolean = false;
  flaggedRequestsFilterOn: boolean = false;
  statusFilterOn: boolean = false;
  timeLineFilterOn: boolean = false;
  timeLineFilterDateNotSelected: boolean = false;
  timeLineFilterselectedWrong: boolean = false;
  statusFilter: any;

  first_selected_timeline: any;
  last_selected_timeline: any;

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
      });
    }
  }

  refreshTable() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    sessionStorage.removeItem("payment-reqs-session");
    this.isContentLoading = true;
    this.flaggedRequestsFilterOn = false;
    this.statusFilterOn = false;
    this.timeLineFilterOn = false;
    this.getPaymentReqs(user[0]["id"]);
  }

  mainMenuOpened(req) {
    if (req.flag == 1) {
      this.flaggedRequest = true;
    } else {
      this.flaggedRequest = false;
    }
  }

  flagAsImportant(req, trigger: MatMenuTrigger) {
    if (req.flag == 1) {
      req.flag = 0;

      var req_id = this.getReqId(req);
      this.apiService
        .updateRequestFlag(req_id, 0, req.request_type)
        .subscribe((val) => {
          // console.log(val);
        });

      sessionStorage.setItem(
        "my_reqs_session",
        JSON.stringify(this.allRequests)
      );
    } else {
      req.flag = 1;

      var req_id = this.getReqId(req);
      this.apiService
        .updateRequestFlag(req_id, 1, req.request_type)
        .subscribe((val) => {
          // console.log(val);
        });
      sessionStorage.setItem(
        "my_reqs_session",
        JSON.stringify(this.allRequests)
      );
    }

    trigger.closeMenu();
  }

  getReqId(req) {
    var req_type = req.request_type;
    if (req_type == "ADD_PROPERTY_REC_EXIST_LANDLORD") {
      return req.property_req_id;
    } else if (req_type == "NEW_LANDLORD_REQ") {
      return req.request_details_id;
    } else if (req_type == "NEW_TENANT_AC") {
      return req.unique_id;
    } else if (req_type == "PAYMENT") {
      return req.request_id;
    } else {
      return req.request_no;
    }
  }

  showAllFlaggedRequests() {
    if (this.statusFilterOn == true) {
      this.closeStatusFilter();
    }
    if (this.timeLineFilterOn == true) {
      this.closeTimelineFilter();
    }

    this.allRequestsMatTableData.data = this.allRequests.filter(
      (d) => d.flag == 1
    );

    this.flaggedRequestsFilterOn = true;
  }

  closeFlaggedRequestFilter() {
    this.allRequestsMatTableData.data = this.allRequests;
    this.flaggedRequestsFilterOn = false;
  }

  showRequestsOnStatus(status, trigger: MatMenuTrigger) {
    if (this.flaggedRequestsFilterOn == true) {
      this.closeFlaggedRequestFilter();
    }
    if (this.timeLineFilterOn == true) {
      this.closeTimelineFilter();
    }

    this.allRequestsMatTableData.data = this.allRequests.filter(
      (d) => d.status == status
    );

    this.statusFilter = status;
    this.statusFilterOn = true;
    trigger.closeMenu();
  }

  closeStatusFilter() {
    this.allRequestsMatTableData.data = this.allRequests;
    this.statusFilterOn = false;
  }

  filterByTimeline(trigger: MatMenuTrigger) {
    if (this.first_selected_timeline && this.last_selected_timeline) {
      var first = new Date(this.first_selected_timeline).getTime();
      var last = new Date(this.last_selected_timeline).getTime();
      if (last < first) {
        this.timeLineFilterselectedWrong = true;

        setTimeout(() => {
          this.timeLineFilterselectedWrong = false;
        }, 3000);
      } else {
        if (this.flaggedRequestsFilterOn == true) {
          this.closeFlaggedRequestFilter();
        }
        if (this.statusFilterOn == true) {
          this.closeStatusFilter();
        }
        this.allRequestsMatTableData.data =
          this.allRequestsMatTableData.data.filter(
            (e) =>
              new Date(e.issue_date).getTime() >=
                this.first_selected_timeline?.getTime()! &&
              new Date(e.issue_date).getTime() <=
                this.last_selected_timeline?.getTime()!
          );

        this.timeLineFilterOn = true;

        trigger.closeMenu();
      }
    } else {
      this.timeLineFilterDateNotSelected = true;

      setTimeout(() => {
        this.timeLineFilterDateNotSelected = false;
      }, 3000);
    }
  }

  closeTimelineFilter() {
    this.allRequestsMatTableData.data = this.allRequests;
    this.timeLineFilterOn = false;
  }

  getRequestStatus(req, last) {
    if (req.status == "pending") {
      return "pending-status";
    } else if (req.status == "approved") {
      return "approved-status";
    } else if (req.status == "declined") {
      return "declined-status";
    } else if (req.status == "review") {
      return "review-status";
    }
  }

  reviewRequest(req) {
    this.dialog
      .open(ReviewRequestDialog, {
        width: "65%",
        height: "45rem",
        data: {
          req_data: req,
          section: "payment",
        },
      })
      .afterClosed()
      .subscribe(async (res) => {});
  }

  async ngOnInit() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.userAuth = user[0]["auth_type"];

    var now = new Date().getMinutes();
    var previous = JSON.parse(
      sessionStorage.getItem("payment_reqs_fetched_time")
    );

    var adminReqDataSession = JSON.parse(
      sessionStorage.getItem("payment-reqs-session")
    );

    if (previous != null) {
      var diff = now - Number(previous);

      if (diff >= 5) {
        sessionStorage.removeItem("payment-reqs-session");
        this.getPaymentReqs(user[0]["id"]);
      } else {
        if (adminReqDataSession != null) {
          this.allRequests = adminReqDataSession;
          this.allRequestsMatTableData = new MatTableDataSource(
            adminReqDataSession
          );
          this.isContentLoading = false;
          this.ngAfterViewInitInitialize = true;
        } else {
          this.getPaymentReqs(user[0]["id"]);
        }
      }
    } else {
      this.getPaymentReqs(user[0]["id"]);
    }
  }

  getPaymentReqs(userId) {
    this.apiService
      .getUserPaymentRequests(userId)
      .subscribe((va: any[]) => {
        this.allRequests = va;
        this.allRequestsMatTableData = new MatTableDataSource(va);
        setTimeout(() => {
          if (this.allRequestsMatTableData != undefined) {
            this.allRequestsMatTableData.paginator = this.paginator;
            this.allRequestsMatTableData.paginator._changePageSize(10);
          }
        });
      })
      .add(() => {
        this.isContentLoading = false;
        if (this.allRequests.length != 0) {
          sessionStorage.setItem(
            "payment-reqs-session",
            JSON.stringify(this.allRequests)
          );
        }
      });

    sessionStorage.setItem(
      "payment_reqs_fetched_time",
      JSON.stringify(new Date().getMinutes())
    );
  }

  clearAllVariables() {
    this.allRequests.length = 0;
  }

  applyFilter(filterValue: any) {
    var val = new String(filterValue).trim().toLowerCase();
    this.allRequestsMatTableData.filter = val;
  }
}
