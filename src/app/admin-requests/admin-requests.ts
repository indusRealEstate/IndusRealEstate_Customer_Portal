import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { AdminService } from "app/services/admin.service";
import { FirebaseService } from "app/services/firebase.service";
import { RequestsTable } from "./components/requests-table/requests-table";
import { RequestStatuses } from "app/models/request_statuses";

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
    private adminService: AdminService
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
        var ev = this.getPageChangeEvent(this.matTabIndex);
        this.pageChange(ev, false);
        this.resetPaginatorLength();
        this.adminService.getAllRequestsAdminCount().subscribe((c) => {
          this.allRequests_length = c;
        });

        this.adminService
          .getAllRequestsAdminCountByStatus(RequestStatuses.open)
          .subscribe((c) => {
            this.open_requests_count = c;
          });
      }
    });
  }

  fetchData() {
    this.clearAllData();
    this.getAllRequestsCount();
    var status = this.getRequestStatusOnIndex(this.matTabIndex);
    this.adminService
      .getAllRequestsAdmin(10, 1, status)
      .subscribe((va: any[]) => {
        this.allRequests = va;
        this.allRequestsMatTableData = new MatTableDataSource(va);
      })
      .add(() => {
        this.isContentLoading = false;
      });
  }

  pageChange(event, edit: boolean) {
    var limit = event.limit;
    var pageNumber = event.pageNumber + 1;
    var status = this.getRequestStatusOnIndex(this.matTabIndex);
    this.adminService
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
          this.resetPageChangeLoader();
        } else {
          this.resetPageChangeLoader();
        }
      });
  }

  getAllRequestsCount() {
    this.adminService.getAllRequestsAdminCount().subscribe((c) => {
      this.allRequests_length = c;
    });

    this.adminService
      .getAllRequestsAdminCountByStatus(RequestStatuses.open)
      .subscribe((c) => {
        this.open_requests_count = c;
      });

    this.adminService
      .getAllRequestsAdminCountByStatus(RequestStatuses.assigned)
      .subscribe((c) => {
        this.assigned_requests_count = c;
      });

    this.adminService
      .getAllRequestsAdminCountByStatus(RequestStatuses.inProgress)
      .subscribe((c) => {
        this.inProgress_requests_count = c;
      });

    this.adminService
      .getAllRequestsAdminCountByStatus(RequestStatuses.completed)
      .subscribe((c) => {
        this.completed_requests_count = c;
      });

    this.adminService
      .getAllRequestsAdminCountByStatus(RequestStatuses.hold)
      .subscribe((c) => {
        this.hold_requests_count = c;
      });

    this.adminService
      .getAllRequestsAdminCountByStatus(RequestStatuses.reOpen)
      .subscribe((c) => {
        this.reOpen_requests_count = c;
      });

    this.adminService
      .getAllRequestsAdminCountByStatus(RequestStatuses.reAssigned)
      .subscribe((c) => {
        this.reAssigned_requests_count = c;
      });

    this.adminService
      .getAllRequestsAdminCountByStatus(RequestStatuses.rejected)
      .subscribe((c) => {
        this.rejected_requests_count = c;
      });

    this.adminService
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
    if (event.type == "flag") {
      var index = this.allRequests.findIndex(
        (req) => req.request_id == event.req_id
      );
      this.allRequests[index].flag = 1;
      this.resetPageChangeLoader();
    }
    if (event.type == "unflag") {
      var index = this.allRequests.findIndex(
        (req) => req.request_id == event.req_id
      );
      this.allRequests[index].flag = 0;
      this.resetPageChangeLoader();
    }

    if (event.type == "spam") {
      this.clearAllData();
      var ev = this.getPageChangeEvent(this.matTabIndex);
      this.request_table_0.requestUpdating.subscribe((res) => {
        if (res == false) {
          this.pageChange(ev, true);
        }
      });
    }

    if (event.type == "archived") {
      this.clearAllData();
      var ev = this.getPageChangeEvent(this.matTabIndex);
      this.request_table_0.requestUpdating.subscribe((res) => {
        if (res == false) {
          console.log(ev);
          this.pageChange(ev, true);
        }
      });
    }
    
    if (event.type == "delete") {
      this.clearAllData();
      var ev = this.getPageChangeEvent(this.matTabIndex);
      this.request_table_0.requestUpdating.subscribe((res) => {
        if (res == false) {
          this.pageChange(ev, true);
        }
      });
    }
  }

  refreshTable() {
    this.isContentLoading = true;
    this.fetchData();
  }

  closeFilterByFlag(event) {
    if (event == 0) {
      this.allRequestsMatTableData.data = this.allRequests;
      // this.filterRequests(this.matTabIndex);
    }
  }

  closeTimeLineFilter(event) {
    if (event == 0) {
      this.allRequestsMatTableData.data = this.allRequests;
      // this.filterRequests(this.matTabIndex);
    }
  }

  searchReqs(text) {
    var event = this.getPageChangeEvent(this.matTabIndex);
    var status = this.getRequestStatusOnIndex(this.matTabIndex);
    this.adminService
      .getAllRequestsAdminSearch(
        text,
        event.limit,
        event.pageNumber + 1,
        status
      )
      .subscribe((res: any) => {
        if (res != "no_input") {
          this.allRequestsMatTableData.data = res;
          this.resultsPaginatorInitialize(res.length);
        } else {
          var ev = this.getPageChangeEvent(this.matTabIndex);
          this.pageChange(ev, false);
          this.resetPaginatorLength();
        }
      })
      .add(() => {
        this.resetPageChangeLoader();
      });
  }

  resetPageChangeLoader() {
    switch (this.matTabIndex) {
      case 0:
        this.request_table_0.pageChangerLoading = false;
        break;
      case 1:
        this.request_table_1.pageChangerLoading = false;
        break;
      case 2:
        this.request_table_2.pageChangerLoading = false;
        break;
      case 3:
        this.request_table_3.pageChangerLoading = false;
        break;
      case 4:
        this.request_table_4.pageChangerLoading = false;
        break;
      case 5:
        this.request_table_5.pageChangerLoading = false;
        break;
      case 6:
        this.request_table_6.pageChangerLoading = false;
        break;
      case 7:
        this.request_table_7.pageChangerLoading = false;
        break;
      case 8:
        this.request_table_8.pageChangerLoading = false;
        break;
      case 9:
        this.request_table_9.pageChangerLoading = false;
        break;

      default:
        this.request_table_0.pageChangerLoading = false;
        break;
    }
  }

  resetPaginatorLength() {
    switch (this.matTabIndex) {
      case 0:
        this.adminService.getAllRequestsAdminCount().subscribe((len) => {
          this.request_table_0.paginator.length = len;
        });
        break;
      case 1:
        this.adminService
          .getAllRequestsAdminCountByStatus(RequestStatuses.open)
          .subscribe((len) => {
            this.request_table_1.paginator.length = len;
          });
        break;
      case 2:
        this.adminService
          .getAllRequestsAdminCountByStatus(RequestStatuses.assigned)
          .subscribe((len) => {
            this.request_table_2.paginator.length = len;
          });
        break;
      case 3:
        this.adminService
          .getAllRequestsAdminCountByStatus(RequestStatuses.inProgress)
          .subscribe((len) => {
            this.request_table_3.paginator.length = len;
          });
        break;
      case 4:
        this.adminService
          .getAllRequestsAdminCountByStatus(RequestStatuses.completed)
          .subscribe((len) => {
            this.request_table_4.paginator.length = len;
          });
        break;
      case 5:
        this.adminService
          .getAllRequestsAdminCountByStatus(RequestStatuses.hold)
          .subscribe((len) => {
            this.request_table_5.paginator.length = len;
          });
        break;
      case 6:
        this.adminService
          .getAllRequestsAdminCountByStatus(RequestStatuses.reOpen)
          .subscribe((len) => {
            this.request_table_6.paginator.length = len;
          });
        break;
      case 7:
        this.adminService
          .getAllRequestsAdminCountByStatus(RequestStatuses.reAssigned)
          .subscribe((len) => {
            this.request_table_7.paginator.length = len;
          });
        break;
      case 8:
        this.adminService
          .getAllRequestsAdminCountByStatus(RequestStatuses.rejected)
          .subscribe((len) => {
            this.request_table_8.paginator.length = len;
          });
        break;
      case 9:
        this.adminService
          .getAllRequestsAdminCountByStatus(RequestStatuses.cancelled)
          .subscribe((len) => {
            this.request_table_9.paginator.length = len;
          });
        break;

      default:
        this.adminService.getAllRequestsAdminCount().subscribe((len) => {
          this.request_table_0.paginator.length = len;
        });
        break;
    }
  }

  resultsPaginatorInitialize(length) {
    switch (this.matTabIndex) {
      case 0:
        this.request_table_0.paginator.length = length;
        break;
      case 1:
        this.request_table_1.paginator.length = length;
        break;

      default:
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

  getPageChangeEvent(index) {
    switch (index) {
      case 0:
        this.request_table_0.table_filter.closeFlaggedRequestFilter();
        this.request_table_0.table_filter.closeTimelineFilter();
        var event = {
          limit: this.request_table_0.paginator.pageSize,
          pageNumber: this.request_table_0.paginator.pageIndex,
        };
        return event;
      case 1:
        this.request_table_1.table_filter.closeFlaggedRequestFilter();
        this.request_table_1.table_filter.closeTimelineFilter();
        var event = {
          limit: this.request_table_1.paginator.pageSize,
          pageNumber: this.request_table_1.paginator.pageIndex,
        };
        return event;
      case 2:
        this.request_table_2.table_filter.closeFlaggedRequestFilter();
        this.request_table_2.table_filter.closeTimelineFilter();
        var event = {
          limit: this.request_table_2.paginator.pageSize,
          pageNumber: this.request_table_2.paginator.pageIndex,
        };
        return event;
      case 3:
        this.request_table_3.table_filter.closeFlaggedRequestFilter();
        this.request_table_3.table_filter.closeTimelineFilter();
        var event = {
          limit: this.request_table_3.paginator.pageSize,
          pageNumber: this.request_table_3.paginator.pageIndex,
        };
        return event;
      case 4:
        this.request_table_4.table_filter.closeFlaggedRequestFilter();
        this.request_table_4.table_filter.closeTimelineFilter();
        var event = {
          limit: this.request_table_4.paginator.pageSize,
          pageNumber: this.request_table_4.paginator.pageIndex,
        };
        return event;
      case 5:
        this.request_table_5.table_filter.closeFlaggedRequestFilter();
        this.request_table_5.table_filter.closeTimelineFilter();
        var event = {
          limit: this.request_table_5.paginator.pageSize,
          pageNumber: this.request_table_5.paginator.pageIndex,
        };
        return event;
      case 6:
        this.request_table_6.table_filter.closeFlaggedRequestFilter();
        this.request_table_6.table_filter.closeTimelineFilter();
        var event = {
          limit: this.request_table_6.paginator.pageSize,
          pageNumber: this.request_table_6.paginator.pageIndex,
        };
        return event;
      case 7:
        this.request_table_7.table_filter.closeFlaggedRequestFilter();
        this.request_table_7.table_filter.closeTimelineFilter();
        var event = {
          limit: this.request_table_7.paginator.pageSize,
          pageNumber: this.request_table_7.paginator.pageIndex,
        };
        return event;
      case 8:
        this.request_table_8.table_filter.closeFlaggedRequestFilter();
        this.request_table_8.table_filter.closeTimelineFilter();
        var event = {
          limit: this.request_table_8.paginator.pageSize,
          pageNumber: this.request_table_8.paginator.pageIndex,
        };
        return event;
      case 9:
        this.request_table_9.table_filter.closeFlaggedRequestFilter();
        this.request_table_9.table_filter.closeTimelineFilter();
        var event = {
          limit: this.request_table_9.paginator.pageSize,
          pageNumber: this.request_table_9.paginator.pageIndex,
        };
        return event;
      default:
        this.request_table_0.table_filter.closeFlaggedRequestFilter();
        this.request_table_0.table_filter.closeTimelineFilter();
        var event = {
          limit: this.request_table_0.paginator.pageSize,
          pageNumber: this.request_table_0.paginator.pageIndex,
        };
        return event;
    }
  }

  matTabClick(tab: any) {
    this.allRequestsMatTableData.filter = "";
    this.matTabIndex = tab.index;

    var event = this.getPageChangeEvent(tab.index);

    this.isContentLoading = true;
    this.pageChange(event, false);
  }
}
