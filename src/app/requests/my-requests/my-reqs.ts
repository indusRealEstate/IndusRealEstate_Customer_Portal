import { Component, OnInit, HostListener, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { ReviewRequestDialog } from "app/components/review_req_dialog/review_req_dialog";

@Component({
  selector: "app-requests",
  templateUrl: "./my-requests.component.html",
  styleUrls: ["./my-requests.component.scss"],
})
export class RequestsComponentMyReqs implements OnInit {
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
    private dialog?: MatDialog
  ) {
    // this.isLoading = true;
    this.isContentLoading = true;

    this.getScreenSize();
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    if (user[0]["auth_type"] != "admin") {
      this.route.queryParams.subscribe((e) => {
        if (e == null) {
          router.navigate([`/my-requests`], {
            queryParams: { uid: user[0]["id"] },
          });
        } else if (e != user[0]["id"]) {
          router.navigate([`/my-requests`], {
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
    // console.log(this.allRequests);
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

  async ngOnInit() {
    this.imagesUrl = this.apiService.getBaseUrlImages();
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    var adminReqDataSession = JSON.parse(
      sessionStorage.getItem("my-reqs-session")
    );

    if (adminReqDataSession != null) {
      this.allRequests = adminReqDataSession;
      this.allRequestsMatTableData = new MatTableDataSource(this.allRequests);
      this.isContentLoading = false;
      // console.log(this.allRequests);
      this.ngAfterViewInitInitialize = true;
    } else {
      this.apiService.getUserRequests(user[0]["id"]).subscribe((va: any[]) => {
        this.allRequests = va;
        this.allRequestsMatTableData = new MatTableDataSource(va);
        setTimeout(() => {
          this.isContentLoading = false;
          if (this.allRequests.length != 0) {
            sessionStorage.setItem(
              "my-reqs-session",
              JSON.stringify(this.allRequests)
            );
          }
        }, 50);
      });
      // this.initFunction(user[0]["id"]);
      sessionStorage.setItem(
        "my_reqs_fetched_time",
        JSON.stringify(new Date().getMinutes())
      );
    }

    var now = new Date().getMinutes();

    var diff =
      now - Number(JSON.parse(sessionStorage.getItem("my_reqs_fetched_time")));

    if (diff >= 20) {
      // this.isLoading = true;
      this.isContentLoading = true;
      this.clearAllVariables();
      sessionStorage.removeItem("my_reqs_fetched_time");
      sessionStorage.removeItem("my-reqs-session");
      this.apiService.getUserRequests(user[0]["id"]).subscribe((va: any[]) => {
        this.allRequests = va;
        this.allRequestsMatTableData = new MatTableDataSource(va);
        setTimeout(() => {
          this.isContentLoading = false;
          if (this.allRequests.length != 0) {
            sessionStorage.setItem(
              "my-reqs-session",
              JSON.stringify(this.allRequests)
            );
          }
        }, 50);
      });
      sessionStorage.setItem(
        "my_reqs_fetched_time",
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
    sessionStorage.removeItem("my-reqs-session");
    this.isContentLoading = true;

    this.apiService
      .getUserRequests(user[0]["id"])
      .subscribe((va: any[]) => {
        this.allRequests = va;
        this.allRequestsMatTableData = new MatTableDataSource(va);
        setTimeout(() => {
          this.isContentLoading = false;
          if (this.allRequests.length != 0) {
            sessionStorage.setItem(
              "my-reqs-session",
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

  getRequestType(req_type) {
    if (req_type == "ADD_PROPERTY_REC_EXIST_LANDLORD") {
      return "Add New Property Request";
    } else if (req_type == "INSPECTION_REQ") {
      return "Inspection Request";
    } else if (req_type == "PAYMENT") {
      return "Payment Request";
    } else if (req_type == "MAINTENANCE_REQ") {
      return "Maintenance Request";
    } else if (req_type == "TENANT_MOVE_IN") {
      return "Tenant Move in Request";
    } else if (req_type == "TENANT_MOVE_OUT") {
      return "Tenant Move out Request";
    } else if (req_type == "CONDITIONING_REQ") {
      return "Property Conditioning Request";
    } else if (req_type == "PAYMENT") {
      return "Payment Request";
    }
  }

  reviewRequest(req) {
    this.dialog
      .open(ReviewRequestDialog, {
        width: "65%",
        height: "45rem",
        data: {
          req_data: req,
          section: "my-reqs",
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
