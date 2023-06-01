import { Component, OnInit, HostListener, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AdminService } from "app/services/admin.service";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { OtherServices } from "app/services/other.service";
import { MatMenuTrigger } from "@angular/material/menu";

@Component({
  selector: "admin-req-landlord",
  templateUrl: "./admin-requests-landlord.html",
  styleUrls: ["./admin-requests-landlord.scss"],
})
export class AdminReqsLandlord implements OnInit {
  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;

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

  statusMenuOpened: boolean = false;
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
    private otherServices: OtherServices
  ) {
    // this.isLoading = true;
    this.isContentLoading = true;

    this.getScreenSize();
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    if (user[0]["auth_type"] == "admin") {
      this.route.queryParams.subscribe((e) => {
        if (e == null) {
          router.navigate([`/admin-requests-landlord`], {
            queryParams: { uid: user[0]["id"] },
          });
        } else if (e != user[0]["id"]) {
          router.navigate([`/admin-requests-landlord`], {
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

  requestFor(req_type, auth_type) {
    if (req_type == "NEW_LANDLORD_REQ") {
      return "Admin";
    } else if (req_type == "NEW_TENANT_AC") {
      return "Admin";
    } else if (req_type == "ADD_PROPERTY_REC_EXIST_LANDLORD") {
      return "Admin";
    } else {
      if (auth_type == "landlord") {
        return "Tenant";
      } else if (auth_type == "tenant") {
        return "Landlord";
      }
    }
  }

  fetchData() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    var adminReqDataSession = JSON.parse(
      sessionStorage.getItem("admin_reqs_session_landlord")
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
        .getAllLandlordRequestsAdmin({
          userId: user[0]["id"],
        })
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
              "admin_reqs_session_landlord",
              JSON.stringify(this.allRequests)
            );
          }
        });
      sessionStorage.setItem(
        "admin_reqs_fetched_time_landlord",
        JSON.stringify(new Date().getMinutes())
      );
    }
  }

  async ngOnInit() {
    var now = new Date().getMinutes();
    var previous = JSON.parse(
      sessionStorage.getItem("admin_reqs_fetched_time_landlord")
    );

    var adminReqDataSession = JSON.parse(
      sessionStorage.getItem("admin_reqs_session_landlord")
    );

    if (previous != null) {
      var diff = now - Number(previous);

      if (diff >= 5) {
        sessionStorage.removeItem("admin_reqs_session_landlord");
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
    sessionStorage.removeItem("admin_reqs_session_landlord");
    this.isContentLoading = true;
    this.flaggedRequestsFilterOn = false;
    this.statusFilterOn = false;
    this.timeLineFilterOn = false;
    this.fetchData();
  }

  statusMenuOpen() {
    setTimeout(() => {
      this.statusMenuOpened = true;
    }, 10);
  }

  clickMainMenu(event) {
    event.stopPropagation();
    this.statusMenuOpened = false;
  }

  mainMenuMouseOver() {
    this.statusMenuOpened = false;
  }

  mainMenuOpened(req) {
    this.statusMenuOpened = false;

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
        "admin_reqs_session_landlord",
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
        "admin_reqs_session_landlord",
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

  archiveRequest(req, trigger: MatMenuTrigger, index: number) {
    req.archive = 1;

    this.allRequests.splice(index, 1);
    this.allRequestsMatTableData.data = this.allRequests;

    var req_id = this.getReqId(req);
    this.apiService
      .updateRequestArchive(req_id, 1, req.request_type)
      .subscribe((val) => {
        // console.log(val);
      });

    if (this.allRequests.length != 0) {
      sessionStorage.setItem(
        "admin_reqs_session_landlord",
        JSON.stringify(this.allRequests)
      );
    }

    sessionStorage.removeItem("admin_reqs_session_archive");
    sessionStorage.removeItem("admin_reqs_session");

    trigger.closeMenu();
  }

  reportAsSpam(req, trigger: MatMenuTrigger, index) {
    req.spam = 1;

    this.allRequests.splice(index, 1);
    this.allRequestsMatTableData.data = this.allRequests;

    var req_id = this.getReqId(req);
    this.apiService
      .updateRequestSpam(req_id, 1, req.request_type)
      .subscribe((val) => {
        // console.log(val);
      });

    if (req.flag == 1) {
      req.flag = 0;

      this.apiService
        .updateRequestFlag(req_id, 0, req.request_type)
        .subscribe((val) => {
          // console.log(val);
        });
    }

    if (req.archive == 1) {
      req.archive = 0;

      this.apiService
        .updateRequestArchive(req_id, 0, req.request_type)
        .subscribe((val) => {
          // console.log(val);
        });
    }

    if (this.allRequests.length != 0) {
      sessionStorage.setItem(
        "admin_reqs_session_landlord",
        JSON.stringify(this.allRequests)
      );
    }

    sessionStorage.removeItem("admin_reqs_session_spam");
    sessionStorage.removeItem("admin_reqs_session");

    trigger.closeMenu();
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

  getRequestType(req_type) {
    if (req_type == "NEW_LANDLORD_REQ") {
      return "New Landlord Account";
    } else if (req_type == "NEW_TENANT_AC") {
      return "New Tenant Account";
    } else if (req_type == "ADD_PROPERTY_REC_EXIST_LANDLORD") {
      return "New Property Add";
    } else if (req_type == "PAYMENT") {
      return "Payment Request";
    } else if (req_type == "INSPECTION_REQ") {
      return "Inspection Request";
    } else if (req_type == "CONDITIONING_REQ") {
      return "Property Conditioning Request";
    } else if (req_type == "MAINTENANCE_REQ") {
      return "Maintenance Request";
    } else if (req_type == "TENANT_MOVE_IN") {
      return "Tenant Move-in Request";
    } else if (req_type == "TENANT_MOVE_OUT") {
      return "Tenant Move-out Request";
    }
  }

  reviewRequest(req: any) {
    var req_id: any;

    if (req.request_type == "ADD_PROPERTY_REC_EXIST_LANDLORD") {
      req_id = req.property_req_id;
    } else if (req.request_type == "NEW_LANDLORD_REQ") {
      req_id = req.request_details_id;
    } else if (req.request_type == "NEW_TENANT_AC") {
      req_id = req.unique_id;
    } else if (req.request_type == "PAYMENT") {
      req_id = req.request_id;
    } else {
      req_id = req.request_no;
    }

    var req_base64 = this.otherServices.convertToBase64(JSON.stringify(req));

    this.router.navigate([`/review-request-admin`], {
      queryParams: { req: req_base64, type: req.request_type },
    });
  }

  applyFilter(filterValue: any) {
    var val = new String(filterValue).trim().toLowerCase();
    this.allRequestsMatTableData.filter = val;
  }
}
