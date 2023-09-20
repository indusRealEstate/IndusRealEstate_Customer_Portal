import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { AddUnitDialog } from "app/components/add_unit_dialog/add_unit_dialog";
import { TableSearchBarComponent } from "app/components/searchbar-table/searchbar-table";
import { AuthenticationService } from "app/services/authentication.service";
import { RequestService } from "app/services/request.service";

@Component({
  selector: "admin-requests-archive",
  templateUrl: "./admin-requests-archive.html",
  styleUrls: ["./admin-requests-archive.scss"],
})
export class AdminRequestsArchive implements OnInit {
  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;

  displayedColumns: string[] = [
    // "name",
    "request_id",
    "request_date",
    "request_time",
    "request_type",
    "building",
    "unitNo",
    "reqFor",
    "reqcategory",
    "status",
    "userName",
    "more",
  ];

  allRequests: any[] = [];
  allRequestsMatTableData: MatTableDataSource<any>;
  ngAfterViewInitInitialize: boolean = false;

  loadingTable: any[] = [1, 2, 3, 4, 5];

  statusMenuOpened: boolean = false;
  flaggedRequest: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  pageChangerLoading: boolean = false;
  @ViewChild(TableSearchBarComponent) searchBar: TableSearchBarComponent;

  tableLength: number = 0;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private requestService: RequestService,
    private dialog: MatDialog
  ) {
    // this.isLoading = true;
    this.isContentLoading = true;

    this.getScreenSize();

    authenticationService.validateToken().subscribe((res) => {
      if (res != "not-expired") {
        authenticationService.logout();
      }
    });
  }

  allProperties: any[] = [];
  allUnits: any[] = [];
  allUsers: any[] = [];

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

  fetchData(limit?) {
    this.requestService
      .getArchivedRequestsAdmin(limit != undefined ? limit : 10, 1)
      .subscribe((va: any) => {
        this.allRequests = va.reqs;
        this.allRequestsMatTableData = new MatTableDataSource(va.reqs);
        this.tableLength = va.count;
      })
      .add(() => {
        this.isContentLoading = false;
      });
  }

  pageChange(event) {
    this.pageChangerLoading = true;
    if (this.searchBar.searchText != "") {
      this.requestService
        .changePageArchiveRequestsSearch(
          this.searchBar.searchText,
          event.pageSize,
          event.pageIndex + 1
        )
        .subscribe((va: any) => {
          this.allRequests = va;
          this.allRequestsMatTableData = new MatTableDataSource(va);
        })
        .add(() => {
          this.pageChangerLoading = false;
        });
    } else {
      this.requestService
        .getArchivedRequestsAdmin(event.pageSize, event.pageIndex + 1)
        .subscribe((va: any) => {
          console.log(va);
          this.allRequests = va.reqs;
          this.allRequestsMatTableData = new MatTableDataSource(va.reqs);
        })
        .add(() => {
          this.pageChangerLoading = false;
        });
    }
  }

  async ngOnInit() {
    this.fetchData();
  }

  clearAllVariables() {
    this.allRequests.length = 0;
  }

  refreshTable() {
    this.isContentLoading = true;
    this.fetchData();
  }

  searchRequests(filterValue: any) {
    this.pageChangerLoading = true;
    if (filterValue != "") {
      this.requestService
        .getAllArchivedRequestsSearch(
          filterValue,
          this.paginator.pageSize,
          this.paginator.pageIndex + 1
        )
        .subscribe((va: any) => {
          this.allRequests = va.reqs;
          this.allRequestsMatTableData = new MatTableDataSource(va.reqs);
          this.tableLength = va.count;
        })
        .add(() => {
          this.pageChangerLoading = false;
        });
    } else {
      this.fetchData(this.paginator.pageSize);
    }
  }

  addUnitDialogOpen() {
    this.dialog
      .open(AddUnitDialog, {
        width: "80%",
        height: "60rem",
      })
      .afterClosed()
      .subscribe((res) => {});
  }

  navigateToUnitDetailPage(unit_id) {
    this.router.navigate(["/property-unit-details"], {
      queryParams: { unit_id: unit_id },
    });
  }

  navigateToPropertyDetailsPage(prop_id) {
    this.router.navigate(["/property-details"], {
      queryParams: { prop_id: prop_id },
    });
  }

  navigateToUserDetailsPage(user_id, auth) {
    this.router.navigate(["/user-details"], {
      queryParams: { user_id: user_id, auth: auth },
    });
  }

  viewRequestsDetails(data: any) {
    this.router.navigate(["/requests-details"], {
      queryParams: {
        request_id: data.request_id,
      },
    });
  }

  updateMore(data: any, type: string) {
    var index = this.allRequests.findIndex(
      (req) => req.request_id == data.request_id
    );
    this.allRequests.splice(index, 1);
    this.allRequestsMatTableData._updateChangeSubscription();
    let output = {
      id: data.request_id,
      type: type,
    };
    this.requestService
      .updateRequestMore(JSON.stringify(output))
      .subscribe((value) => {
        // this.refreshTable();
      });
  }

  removeAllRequests() {
    var data = [];
    this.allRequests.forEach((req) => {
      data.push(req.request_id);
    });

    if (data.length == this.allRequests.length) {
      this.allRequests.length = 0;
      this.allRequestsMatTableData._updateChangeSubscription();
      this.requestService
        .removeAllRequestsFromArchive(
          JSON.stringify({ reqs: data, type: "archive" })
        )
        .subscribe((res) => {
          console.log(res);
        });
    }
  }

  getOnlyName(data: any) {
    return JSON.parse(data).name;
  }

  isNameEmpty(data: any) {
    if (JSON.parse(data).name !== undefined) {
      return true;
    } else {
      return false;
    }
  }
}
