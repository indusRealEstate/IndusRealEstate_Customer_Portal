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
import { TableFiltersComponent } from "app/components/table-filters/table-filters";

@Component({
  selector: "admin-req",
  templateUrl: "./admin-requests.html",
  styleUrls: ["./admin-requests.scss"],
})
export class AdminReqs implements OnInit {
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

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild("table_filter") table_filter: TableFiltersComponent;

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
      sessionStorage.getItem("admin_reqs_session")
    );
    if (adminReqDataSession != null) {
      this.allRequests = adminReqDataSession;
      this.allRequestsMatTableData.data = adminReqDataSession;
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
              "admin_reqs_session",
              JSON.stringify(this.allRequests)
            );
          }
        });
      sessionStorage.setItem(
        "admin_reqs_fetched_time_admin",
        JSON.stringify(new Date().getMinutes())
      );
    }
  }

  async ngOnInit() {
    var now = new Date().getMinutes();
    var previous = JSON.parse(
      sessionStorage.getItem("admin_reqs_fetched_time_admin")
    );

    var adminReqDataSession = JSON.parse(
      sessionStorage.getItem("admin_reqs_session")
    );

    if (previous != null) {
      var diff = now - Number(previous);

      if (diff >= 5) {
        sessionStorage.removeItem("admin_reqs_session");
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
    sessionStorage.removeItem("admin_reqs_session");
    this.isContentLoading = true;
    if (this.table_filter != undefined) {
      this.table_filter.flaggedRequestsFilterOn = false;
      this.table_filter.statusFilterOn = false;
      this.table_filter.timeLineFilterOn = false;
    }
    this.fetchData();
  }

  statusMenuOpen(status) {
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
        "admin_reqs_session",
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
        "admin_reqs_session",
        JSON.stringify(this.allRequests)
      );
    }

    if (req.auth_type == "landlord") {
      sessionStorage.removeItem("admin_reqs_session_landlord");
    } else if (req.auth_type == "tenant") {
      sessionStorage.removeItem("admin_reqs_session_tenant");
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

  archiveRequest(req, trigger: MatMenuTrigger, index) {
    req.archive = 1;

    this.allRequests.splice(index, 1);
    this.allRequestsMatTableData.data = this.allRequests;

    var req_id = this.getReqId(req);
    this.apiService
      .updateRequestArchive(req_id, 1, req.request_type)
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

    if (this.allRequests.length != 0) {
      sessionStorage.setItem(
        "admin_reqs_session",
        JSON.stringify(this.allRequests)
      );
    }

    sessionStorage.removeItem("admin_reqs_session_archive");
    sessionStorage.removeItem("admin_reqs_session_landlord");
    sessionStorage.removeItem("admin_reqs_session_tenant");

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
        "admin_reqs_session",
        JSON.stringify(this.allRequests)
      );
    }

    sessionStorage.removeItem("admin_reqs_session_archive");
    sessionStorage.removeItem("admin_reqs_session_landlord");
    sessionStorage.removeItem("admin_reqs_session_tenant");

    trigger.closeMenu();
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

  getRequestType(req_type) {
    if (req_type == "NEW_LANDLORD_REQ") {
      return "Request for new Landlord Account";
    } else if (req_type == "NEW_TENANT_AC") {
      return "Request for new Tenant Account";
    } else if (req_type == "ADD_PROPERTY_REC_EXIST_LANDLORD") {
      return "Add New Property Request";
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
