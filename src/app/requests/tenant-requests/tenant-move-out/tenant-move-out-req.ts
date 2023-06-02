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
import { TableFiltersComponent } from "app/components/table-filters/table-filters";

@Component({
  selector: "app-requests-tenant-move-out",
  templateUrl: "./tenant-move-out-req.html",
  styleUrls: ["./tenant-move-out-req.scss"],
})
export class RequestsComponentTenantMoveOut implements OnInit {
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

  flaggedRequest: boolean = false;

  userAuth: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("table_filter") table_filter: TableFiltersComponent;

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
          router.navigate([`/tenant-move-out-requests`], {
            queryParams: { uid: user[0]["id"] },
          });
        } else if (e != user[0]["id"]) {
          router.navigate([`/tenant-move-out-requests`], {
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

  fetchData() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    var adminReqDataSession = JSON.parse(
      sessionStorage.getItem("move_out_reqs_session")
    );
    if (adminReqDataSession != null) {
      this.allRequests = adminReqDataSession;
      this.allRequestsMatTableData.data = adminReqDataSession;
      this.isContentLoading = false;
      this.ngAfterViewInitInitialize = true;
    } else {
      this.apiService
        .getUserTenantMoveOutRequests(user[0]["id"])
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
              "move_out_reqs_session",
              JSON.stringify(this.allRequests)
            );
          }
        });
      sessionStorage.setItem(
        "move_out_reqs_fetched_time",
        JSON.stringify(new Date().getMinutes())
      );
    }
  }

  async ngOnInit() {
    var now = new Date().getMinutes();
    var previous = JSON.parse(
      sessionStorage.getItem("move_out_reqs_fetched_time")
    );

    var adminReqDataSession = JSON.parse(
      sessionStorage.getItem("move_out_reqs_session")
    );

    if (previous != null) {
      var diff = now - Number(previous);

      if (diff >= 5) {
        sessionStorage.removeItem("move_out_reqs_session");
        this.fetchData();
      } else {
        if (adminReqDataSession != null) {
          this.allRequests = adminReqDataSession;
          this.allRequestsMatTableData = new MatTableDataSource(
            adminReqDataSession
          );
          this.isContentLoading = false;
          this.ngAfterViewInitInitialize = true;
        } else {
          this.fetchData();
        }
      }
    } else {
      this.fetchData();
    }
  }

  clearAllVariables() {
    this.allRequests.length = 0;
  }

  refreshTable() {
    console.log("refresh");
    sessionStorage.removeItem("move_out_reqs_session");
    this.isContentLoading = true;
    if (this.table_filter != undefined) {
      this.table_filter.flaggedRequestsFilterOn = false;
      this.table_filter.statusFilterOn = false;
      this.table_filter.timeLineFilterOn = false;
    }
    this.fetchData();
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
        "move_out_reqs_session",
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
        "move_out_reqs_session",
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
    if (this.table_filter != undefined) {
      if (this.table_filter.statusFilterOn == true) {
        this.table_filter.closeStatusFilter();
      }
    }
    if (this.table_filter != undefined) {
      if (this.table_filter.timeLineFilterOn == true) {
        this.table_filter.closeTimelineFilter();
      }
    }

    this.allRequestsMatTableData.data = this.allRequests.filter(
      (d) => d.flag == 1
    );
  }

  closeFlaggedRequestFilter() {
    this.allRequestsMatTableData.data = this.allRequests;
  }

  showRequestsOnStatus(status) {
    if (this.table_filter != undefined) {
      if (this.table_filter.flaggedRequestsFilterOn == true) {
        this.table_filter.closeFlaggedRequestFilter();
      }
    }

    if (this.table_filter != undefined) {
      if (this.table_filter.timeLineFilterOn == true) {
        this.table_filter.closeTimelineFilter();
      }
    }

    this.allRequestsMatTableData.data = this.allRequests.filter(
      (d) => d.status == status
    );
  }

  closeStatusFilter() {
    this.allRequestsMatTableData.data = this.allRequests;
  }

  filterByTimeline() {
    if (this.table_filter != undefined) {
      if (this.table_filter.flaggedRequestsFilterOn == true) {
        this.table_filter.closeFlaggedRequestFilter();
      }
    }
    if (this.table_filter != undefined) {
      if (this.table_filter.statusFilterOn == true) {
        this.table_filter.closeStatusFilter();
      }
    }

    if (this.table_filter != undefined) {
      this.allRequestsMatTableData.data =
        this.allRequestsMatTableData.data.filter(
          (e) =>
            new Date(e.issue_date).getTime() >=
              this.table_filter.first_selected_timeline?.getTime()! &&
            new Date(e.issue_date).getTime() <=
              this.table_filter.last_selected_timeline?.getTime()!
        );
    }
  }

  closeTimelineFilter() {
    this.allRequestsMatTableData.data = this.allRequests;
  }

  reviewRequest(req) {
    this.dialog
      .open(ReviewRequestDialog, {
        width: "65%",
        height: "45rem",
        data: {
          req_data: req,
          section: "move-out",
        },
      })
      .afterClosed()
      .subscribe(async (res) => {});
  }

  applyFilter(filterValue: any) {
    var val = new String(filterValue).trim().toLowerCase();
    this.allRequestsMatTableData.filter = val;
  }
}
