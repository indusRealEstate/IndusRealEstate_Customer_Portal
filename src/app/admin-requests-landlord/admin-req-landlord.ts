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
  selector: "admin-req-landlord",
  templateUrl: "./admin-requests-landlord.html",
  styleUrls: ["./admin-requests-landlord.scss"],
})
export class AdminReqsLandlord implements OnInit {
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
      sessionStorage.getItem("admin_reqs_session_landlord")
    );

    if (adminReqDataSession != null) {
      this.allRequests = adminReqDataSession;
      this.allRequestsMatTableData = new MatTableDataSource(this.allRequests);
      this.isContentLoading = false;
      this.ngAfterViewInitInitialize = true;
    } else {
      this.adminService
        .getAllRequestsAdmin({
          userId: user[0]["id"],
        })
        .subscribe((va: any[]) => {
          var count = 0;
          for (let index = 0; index < va.length; index++) {
            count++;
            if (va[index].auth_type == "landlord") {
              this.allRequests.push(va[index]);
            }
          }

          setTimeout(() => {
            if (count == va.length) {
              this.isContentLoading = false;
              this.allRequestsMatTableData = new MatTableDataSource(
                this.allRequests
              );
              if (this.allRequests.length != 0) {
                sessionStorage.setItem(
                  "admin_reqs_session_landlord",
                  JSON.stringify(this.allRequests)
                );
              }
            }
          }, 100);
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
      sessionStorage.removeItem("admin_reqs_session_landlord");
      this.adminService
        .getAllRequestsAdmin({
          userId: user[0]["id"],
        })
        .subscribe((va: any[]) => {
          var count = 0;
          for (let index = 0; index < va.length; index++) {
            count++;
            if (va[index].auth_type == "landlord") {
              this.allRequests.push(va[index]);
            }
          }
          setTimeout(() => {
            if (count == va.length) {
              this.isContentLoading = false;
              this.allRequestsMatTableData = new MatTableDataSource(
                this.allRequests
              );
              if (this.allRequests.length != 0) {
                sessionStorage.setItem(
                  "admin_reqs_session_landlord",
                  JSON.stringify(this.allRequests)
                );
              }
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

  refreshTable() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    sessionStorage.removeItem("admin_reqs_session_landlord");
    this.isContentLoading = true;

    this.adminService
      .getAllRequestsAdmin({
        userId: user[0]["id"],
      })
      .subscribe((va: any[]) => {
        var count = 0;
        for (let index = 0; index < va.length; index++) {
          count++;
          if (va[index].auth_type == "landlord") {
            this.allRequests.push(va[index]);
          }
        }
        setTimeout(() => {
          if (count == va.length) {
            this.isContentLoading = false;
            this.allRequestsMatTableData = new MatTableDataSource(
              this.allRequests
            );
            if (this.allRequests.length != 0) {
              sessionStorage.setItem(
                "admin_reqs_session_landlord",
                JSON.stringify(this.allRequests)
              );
            }
          }
        }, 100);
      })
      .add(() => {
        setTimeout(() => {
          if (this.allRequestsMatTableData != undefined) {
            this.allRequestsMatTableData.paginator = this.paginator;
          }
        }, 500);
      });
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
