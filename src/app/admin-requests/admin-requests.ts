import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { RequestStatuses } from "app/models/request_statuses";
import { FirebaseService } from "app/services/firebase.service";
import { RequestService } from "app/services/request.service";
import { RequestsTable } from "./components/requests-table/requests-table";

@Component({
  selector: "admin-requests",
  templateUrl: "./admin-requests.html",
  styleUrls: ["./admin-requests.scss"],
})
export class AdminRequests implements OnInit {
  isUserSignedIn: boolean = false;

  allRequests: any[] = [];

  allRequests_length: number = 0;
  allRequestsMatTableData: MatTableDataSource<any>;
  isContentLoading: boolean = false;

  // paginator: MatPaginator;
  @ViewChild("request_table_0") request_table_0: RequestsTable;
  @ViewChild("request_table_1") request_table_1: RequestsTable;
  @ViewChild("request_table_2") request_table_2: RequestsTable;
  @ViewChild("request_table_3") request_table_3: RequestsTable;
  @ViewChild("request_table_4") request_table_4: RequestsTable;
  @ViewChild("request_table_5") request_table_5: RequestsTable;
  @ViewChild("request_table_6") request_table_6: RequestsTable;
  @ViewChild("request_table_7") request_table_7: RequestsTable;
  @ViewChild("request_table_8") request_table_8: RequestsTable;
  @ViewChild("request_table_9") request_table_9: RequestsTable;

  matTabIndex: any = 0;

  open_requests_count: any = 0;
  assigned_requests_count: any = 0;
  inProgress_requests_count: any = 0;
  completed_requests_count: any = 0;
  hold_requests_count: any = 0;
  reOpen_requests_count: any = 0;
  reAssigned_requests_count: any = 0;
  rejected_requests_count: any = 0;
  cancelled_requests_count: any = 0;

  constructor(
    private firebaseService: FirebaseService,
    private requestService: RequestService,
  ) {
    this.getScreenSize();
    this.isContentLoading = true;
  }

  screenHeight: number;
  screenWidth: number;
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  ngAfterViewInit() {}

  async ngOnInit() {
    this.fetchData();
    this.firebaseService.getData().subscribe((req_data: any[]) => {
      if (
        this.request_table_0.paginator != undefined ||
        this.request_table_1.paginator != undefined
      ) {
        var ev = {
          limit: this.getCurrentTable().paginator.pageSize,
          pageNumber: this.getCurrentTable().paginator.pageIndex,
        };
        this.pageChange(ev, false);
        this.resetPaginatorLength();
        this.requestService.getAllRequestsAdminCount().subscribe((c) => {
          this.allRequests_length = c;
        });

        this.requestService
          .getAllRequestsAdminCountByStatus(RequestStatuses.open)
          .subscribe((c) => {
            this.open_requests_count = c;
          });
      }
    });
  }

  fetchData() {
    if (this.getCurrentTable() != undefined) {
      this.getCurrentTable().searchBar.searchText = "";
    }
    this.clearAllData();
    this.getAllRequestsCount();
    var status = this.getRequestStatusOnIndex(this.matTabIndex);
    this.requestService
      .getAllRequestsAdmin(10, 1, status)
      .subscribe((va: any[]) => {
        this.allRequests = va;
        this.resetPaginatorLength();
        this.allRequestsMatTableData = new MatTableDataSource(va);
      })
      .add(() => {
        this.isContentLoading = false;
      });
  }

  pageChange(event, edit: boolean) {
    if (this.getCurrentTable().searchBar.searchText != "") {
      var limit = event.limit;
      var pageNumber = event.pageNumber + 1;
      var status = this.getRequestStatusOnIndex(this.matTabIndex);
      this.requestService
        .changePageRequestsSearch(
          this.getCurrentTable().searchBar.searchText,
          limit,
          pageNumber,
          status
        )
        .subscribe((va: any[]) => {
          this.allRequests = va;
          this.allRequestsMatTableData = new MatTableDataSource(va);
        })
        .add(() => {
          this.isContentLoading = false;

          if (edit == true) {
            // this.resetPaginatorLength();
            this.getCurrentTable().pageChangerLoading = false;
          } else {
            this.getCurrentTable().pageChangerLoading = false;
          }
        });
    } else {
      if (this.getCurrentTable().table_filter.flaggedRequestsFilterOn == true) {
        var limit = event.limit;
        var pageNumber = event.pageNumber + 1;
        var status = this.getRequestStatusOnIndex(this.matTabIndex);
        this.requestService
          .changePageRequestsFLag(limit, pageNumber, status)
          .subscribe((va: any[]) => {
            this.allRequests = va;
            this.allRequestsMatTableData = new MatTableDataSource(va);
          })
          .add(() => {
            this.isContentLoading = false;

            if (edit == true) {
              // this.resetPaginatorLength();
              this.getCurrentTable().pageChangerLoading = false;
            } else {
              this.getCurrentTable().pageChangerLoading = false;
            }
          });
      } else {
        var limit = event.limit;
        var pageNumber = event.pageNumber + 1;
        var status = this.getRequestStatusOnIndex(this.matTabIndex);
        this.requestService
          .getAllRequestsAdmin(limit, pageNumber, status)
          .subscribe((va: any[]) => {
            this.allRequests = va;
            this.allRequestsMatTableData = new MatTableDataSource(va);
          })
          .add(() => {
            this.isContentLoading = false;

            if (edit == true) {
              this.resetPaginatorLength();
              this.getAllRequestsCount();
              this.getCurrentTable().pageChangerLoading = false;
            } else {
              this.getCurrentTable().pageChangerLoading = false;
            }
          });
      }
    }
  }

  getAllRequestsCount() {
    this.requestService.getAllRequestsAdminCount().subscribe((c) => {
      this.allRequests_length = c;
    });

    this.requestService
      .getAllRequestsAdminCountByStatus(RequestStatuses.open)
      .subscribe((c) => {
        this.open_requests_count = c;
      });

    this.requestService
      .getAllRequestsAdminCountByStatus(RequestStatuses.assigned)
      .subscribe((c) => {
        this.assigned_requests_count = c;
      });

    this.requestService
      .getAllRequestsAdminCountByStatus(RequestStatuses.inProgress)
      .subscribe((c) => {
        this.inProgress_requests_count = c;
      });

    this.requestService
      .getAllRequestsAdminCountByStatus(RequestStatuses.completed)
      .subscribe((c) => {
        this.completed_requests_count = c;
      });

    this.requestService
      .getAllRequestsAdminCountByStatus(RequestStatuses.hold)
      .subscribe((c) => {
        this.hold_requests_count = c;
      });

    this.requestService
      .getAllRequestsAdminCountByStatus(RequestStatuses.reOpen)
      .subscribe((c) => {
        this.reOpen_requests_count = c;
      });

    this.requestService
      .getAllRequestsAdminCountByStatus(RequestStatuses.reAssigned)
      .subscribe((c) => {
        this.reAssigned_requests_count = c;
      });

    this.requestService
      .getAllRequestsAdminCountByStatus(RequestStatuses.rejected)
      .subscribe((c) => {
        this.rejected_requests_count = c;
      });

    this.requestService
      .getAllRequestsAdminCountByStatus(RequestStatuses.cancelled)
      .subscribe((c) => {
        this.cancelled_requests_count = c;
      });
  }

  clearAllData() {
    this.open_requests_count = 0;
    this.assigned_requests_count = 0;
    this.inProgress_requests_count = 0;
    this.completed_requests_count = 0;
    this.hold_requests_count = 0;
    this.reOpen_requests_count = 0;
    this.reAssigned_requests_count = 0;
    this.rejected_requests_count = 0;
    this.cancelled_requests_count = 0;
  }

  requestUpdate(event) {
    this.getCurrentTable().table_filter.closeFlaggedRequestFilter();
    this.getCurrentTable().table_filter.closeTimelineFilter();
    if (event.type == "flag") {
      var index = this.allRequests.findIndex(
        (req) => req.request_id == event.req_id
      );
      this.allRequests[index].flag = 1;
      this.getCurrentTable().pageChangerLoading = false;
    }
    if (event.type == "unflag") {
      var index = this.allRequests.findIndex(
        (req) => req.request_id == event.req_id
      );
      this.allRequests[index].flag = 0;
      this.getCurrentTable().pageChangerLoading = false;
    }

    if (event.type == "spam") {
      this.clearAllData();
      var ev = {
        limit: this.getCurrentTable().paginator.pageSize,
        pageNumber: this.getCurrentTable().paginator.pageIndex,
      };
      var fired = 0;
      this.getCurrentTable().requestUpdating.subscribe((res) => {
        if (res == true && fired < 1) {
          this.pageChange(ev, true);
          fired++;
        }
      });
    }

    if (event.type == "archived") {
      this.clearAllData();
      var ev = {
        limit: this.getCurrentTable().paginator.pageSize,
        pageNumber: this.getCurrentTable().paginator.pageIndex,
      };
      var fired = 0;
      this.getCurrentTable().requestUpdating.subscribe((res) => {
        if (res == true && fired < 1) {
          this.pageChange(ev, true);
          fired++;
        }
      });
    }

    if (event.type == "delete") {
      this.clearAllData();

      var ev = {
        limit: this.getCurrentTable().paginator.pageSize,
        pageNumber: this.getCurrentTable().paginator.pageIndex,
      };
      var fired = 0;
      this.getCurrentTable().requestUpdating.subscribe((res) => {
        if (res == true && fired < 1) {
          this.pageChange(ev, true);
          fired++;
        }
      });
    }
  }

  refreshTable() {
    this.isContentLoading = true;
    this.fetchData();
  }

  filterByFlag(event) {
    this.getCurrentTable().pageChangerLoading = true;
    if (event == 1) {
      this.getCurrentTable().searchBar.searchText = "";
      var limit = this.getCurrentTable().paginator.pageSize;
      var pageNumber = this.getCurrentTable().paginator.pageIndex + 1;
      var status = this.getRequestStatusOnIndex(this.matTabIndex);
      this.requestService
        .getAllRequestsAdminFlag(limit, pageNumber, status)
        .subscribe((va: any) => {
          console.log(va);
          this.allRequests = va.reqs;
          this.getCurrentTable().tableLength = va.count;
          this.allRequestsMatTableData = new MatTableDataSource(va.reqs);
        })
        .add(() => {
          this.getCurrentTable().pageChangerLoading = false;
        });
    } else {
      this.getCurrentTable().table_filter.flaggedRequestsFilterOn = false;
      var ev = {
        limit: this.getCurrentTable().paginator.pageSize,
        pageNumber: this.getCurrentTable().paginator.pageIndex,
      };
      this.pageChange(ev, true);
    }
  }

  closeTimeLineFilter(event) {
    if (event == 0) {
      // this.allRequestsMatTableData.data = this.allRequests;
      // this.filterRequests(this.matTabIndex);
    }
  }

  searchReqs(text) {
    this.getCurrentTable().table_filter.closeFlaggedRequestFilter();
    this.getCurrentTable().table_filter.closeTimelineFilter();

    var event = {
      limit: this.getCurrentTable().paginator.pageSize,
      pageNumber: this.getCurrentTable().paginator.pageIndex,
    };
    var status = this.getRequestStatusOnIndex(this.matTabIndex);

    this.requestService
      .getAllRequestsAdminSearch(
        text,
        event.limit,
        event.pageNumber + 1,
        status
      )
      .subscribe((res: any) => {
        // console.log(res);
        if (res != "no_input") {
          this.allRequestsMatTableData.data = res.reqs;
          this.getCurrentTable().tableLength = res.count;
        } else {
          var ev = {
            limit: this.getCurrentTable().paginator.pageSize,
            pageNumber: this.getCurrentTable().paginator.pageIndex,
          };
          this.pageChange(ev, false);
          this.getCurrentTable().tableLength = res.count;
        }
      })
      .add(() => {
        this.getCurrentTable().pageChangerLoading = false;
      });
  }

  getCurrentTable(): RequestsTable {
    switch (this.matTabIndex) {
      case 0:
        return this.request_table_0;
      case 1:
        return this.request_table_1;
      case 2:
        return this.request_table_2;
      case 3:
        return this.request_table_3;
      case 4:
        return this.request_table_4;
      case 5:
        return this.request_table_5;
      case 6:
        return this.request_table_6;
      case 7:
        return this.request_table_7;
      case 8:
        return this.request_table_8;
      case 9:
        return this.request_table_9;
      default:
        return this.request_table_0;
    }
  }

  resetPaginatorLength() {
    var status = this.getRequestStatusOnIndex(this.matTabIndex);
    switch (status) {
      case "no-filter":
        this.requestService.getAllRequestsAdminCount().subscribe((len) => {
          this.request_table_0.paginator.length = len;
        });
        break;
      default:
        this.requestService
          .getAllRequestsAdminCountByStatus(status)
          .subscribe((len) => {
            this.getCurrentTable().paginator.length = len;
          });
        break;
    }
  }

  getRequestStatusOnIndex(index) {
    switch (index) {
      case 0:
        return "no-filter";
      case 1:
        return RequestStatuses.open;
      case 2:
        return RequestStatuses.assigned;
      case 3:
        return RequestStatuses.inProgress;
      case 4:
        return RequestStatuses.completed;
      case 5:
        return RequestStatuses.hold;
      case 6:
        return RequestStatuses.reOpen;
      case 7:
        return RequestStatuses.reAssigned;
      case 8:
        return RequestStatuses.rejected;
      case 9:
        return RequestStatuses.cancelled;
      default:
        return "no-filter";
    }
  }

  matTabClick(tab: any) {
    this.getCurrentTable().searchBar.searchText = "";
    this.getCurrentTable().searchBar.searchBarOpened = false;
    this.allRequestsMatTableData.filter = "";
    this.matTabIndex = tab.index;

    this.getCurrentTable().table_filter.closeFlaggedRequestFilter();
    this.getCurrentTable().table_filter.closeTimelineFilter();

    var event = {
      limit: this.getCurrentTable().paginator.pageSize,
      pageNumber: this.getCurrentTable().paginator.pageIndex,
    };

    this.isContentLoading = true;
    this.pageChange(event, false);
  }
}
