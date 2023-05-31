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
import { OtherServices } from "app/services/other.service";
import { MatMenuTrigger } from "@angular/material/menu";

@Component({
  selector: "admin-requests-archive",
  templateUrl: "./admin-requests-archive.html",
  styleUrls: ["./admin-requests-archive.scss"],
})
export class AdminRequestsArchive implements OnInit {
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
  statusMenuOpened: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private adminService: AdminService,
    private otherServices: OtherServices,
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
          router.navigate([`/admin-requests-archive`], {
            queryParams: { uid: user[0]["id"] },
          });
        } else if (e != user[0]["id"]) {
          router.navigate([`/admin-requests-archive`], {
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

  async ngOnInit() {
    this.imagesUrl = this.apiService.getBaseUrlImages();
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    var adminReqDataSession = JSON.parse(
      sessionStorage.getItem("admin_reqs_session_archive")
    );

    if (adminReqDataSession != null) {
      this.allRequests = adminReqDataSession;
      this.allRequestsMatTableData = new MatTableDataSource(this.allRequests);
      this.isContentLoading = false;
      this.ngAfterViewInitInitialize = true;
    } else {
      this.adminService
        .getAllRequestsAdminArchive({
          userId: user[0]["id"],
        })
        .subscribe((va: any[]) => {
          this.allRequests = va;
          this.allRequestsMatTableData = new MatTableDataSource(va);
        })
        .add(() => {
          this.isContentLoading = false;
          if (this.allRequests.length != 0) {
            sessionStorage.setItem(
              "admin_reqs_session_archive",
              JSON.stringify(this.allRequests)
            );
          }
        });
      sessionStorage.setItem(
        "admin_reqs_fetched_time",
        JSON.stringify(new Date().getMinutes())
      );
    }

    var now = new Date().getMinutes();

    var diff =
      now -
      Number(JSON.parse(sessionStorage.getItem("admin_reqs_fetched_time")));

    if (diff >= 20) {
      // this.isLoading = true;
      this.isContentLoading = true;
      this.clearAllVariables();
      sessionStorage.removeItem("admin_reqs_fetched_time");
      sessionStorage.removeItem("admin_reqs_session_archive");
      this.adminService
        .getAllRequestsAdminArchive({
          userId: user[0]["id"],
        })
        .subscribe((va: any[]) => {
          this.allRequests = va;
          this.allRequestsMatTableData = new MatTableDataSource(va);
        })
        .add(() => {
          this.isContentLoading = false;
          if (this.allRequests.length != 0) {
            sessionStorage.setItem(
              "admin_reqs_session_archive",
              JSON.stringify(this.allRequests)
            );
          }
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

  refreshTable() {
    this.clearAllVariables();
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    sessionStorage.removeItem("admin_reqs_session_archive");
    this.isContentLoading = true;

    this.adminService
      .getAllRequestsAdminArchive({
        userId: user[0]["id"],
      })
      .subscribe((va: any[]) => {
        this.allRequests = va;
        this.allRequestsMatTableData = new MatTableDataSource(va);
      })
      .add(() => {
        this.isContentLoading = false;
        if (this.allRequests.length != 0) {
          sessionStorage.setItem(
            "admin_reqs_session_archive",
            JSON.stringify(this.allRequests)
          );
        }
        setTimeout(() => {
          if (this.allRequestsMatTableData != undefined) {
            this.allRequestsMatTableData.paginator = this.paginator;
            this.allRequestsMatTableData.paginator._changePageSize(10);
          }
        }, 100);
      });
  }

  clickMainMenu(event) {
    event.stopPropagation();
    this.statusMenuOpened = false;
  }

  mainMenuMouseOver() {
    this.statusMenuOpened = false;
  }

  mainMenuOpened() {
    this.statusMenuOpened = false;
  }

  removeFromArchives(req: any, trigger: MatMenuTrigger, index: number) {
    req.archive = 0;

    const filteredarray = this.allRequests.filter((d) => d.archive == 1);
    this.allRequests = filteredarray;

    this.allRequestsMatTableData = new MatTableDataSource(this.allRequests);

    this.allRequestsMatTableData.paginator = this.paginator;
    this.allRequestsMatTableData.paginator._changePageSize(10);

    var req_id = this.getReqId(req);
    this.apiService
      .updateRequestArchive(req_id, 0, req.request_type)
      .subscribe((val) => {
        // console.log(val);
      });

    if (this.allRequests.length != 0) {
      sessionStorage.setItem(
        "admin_reqs_session_archive",
        JSON.stringify(this.allRequests)
      );
    } else {
      sessionStorage.removeItem("admin_reqs_session_archive");
    }

    sessionStorage.removeItem("admin_reqs_session");
    sessionStorage.removeItem("admin_reqs_session_landlord");
    sessionStorage.removeItem("admin_reqs_session_tenant");

    trigger.closeMenu();
  }

  removeAllFromArchives() {
    var count = 0;
    for (let index = 0; index < this.allRequests.length; index++) {
      count++;
      var req_id = this.getReqId(this.allRequests[index]);
      this.apiService
        .updateRequestArchive(req_id, 0, this.allRequests[index].request_type)
        .subscribe((val) => {
          // console.log(val);
        });
    }

    if (count == this.allRequests.length) {
      this.allRequests.length = 0;
      this.allRequestsMatTableData = new MatTableDataSource(this.allRequests);
      this.allRequestsMatTableData.paginator = this.paginator;
      this.allRequestsMatTableData.paginator._changePageSize(10);
      sessionStorage.removeItem("admin_reqs_session_archive");
      sessionStorage.removeItem("admin_reqs_session");
      sessionStorage.removeItem("admin_reqs_session_landlord");
      sessionStorage.removeItem("admin_reqs_session_tenant");
    }
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
