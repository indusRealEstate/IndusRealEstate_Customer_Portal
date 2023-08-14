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
      var count = 0;
      var latest_reqs = [];
      req_data.forEach(async (req) => {
        if (
          this.allRequests.filter((all_req) => all_req.request_id == req.id)
            .length == 0
        ) {
          latest_reqs.push(req.id);
          console.log(req, "new request found");
        } else {
          await this.firebaseService.deleteData(req.id);
        }
        count++;
      });

      // setTimeout(() => {
      if (
        count == req_data.length &&
        latest_reqs.length != 0 &&
        this.isContentLoading == false
      ) {
        console.log("count matched", latest_reqs);
        this.adminService
          .getLatestServiceRequest(
            JSON.stringify({
              reqs: latest_reqs,
            })
          )
          .subscribe((l_req: any[]) => {
            console.log(l_req, "all new request data");
            l_req.forEach((req) => {
              if (!this.allRequests.includes(req)) {
                console.log(req, "adding new request");
                this.allRequests.splice(0, 0, req);
                this.allRequestsMatTableData = new MatTableDataSource(
                  this.allRequests
                );
              }
            });
          });
      }
      // }, 500);
    });
  }

  fetchData() {
    this.clearAllData();
    this.adminService
      .getAllRequestsAdmin()
      .subscribe((va: any[]) => {
        this.allRequests = va;
        this.allRequestsMatTableData = new MatTableDataSource(va);

        va.forEach((r) => {
          this.addRequestsCount(r.request_status);
        });
      })
      .add(() => {
        this.isContentLoading = false;

        if (this.matTabIndex != 0) {
          this.filterRequests(this.matTabIndex);
        }

        setTimeout(() => {
          this.initializePaginator(this.matTabIndex);
        });
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
    console.log(event);

    if (event.type == "flag") {
      var index = this.allRequests.findIndex(
        (req) => req.request_id == event.req_id
      );
      this.allRequests[index].flag = 1;
    }
    if (event.type == "unflag") {
      var index = this.allRequests.findIndex(
        (req) => req.request_id == event.req_id
      );
      this.allRequests[index].flag = 0;
    }

    if (event.type == "spam") {
      var index = this.allRequests.findIndex(
        (req) => req.request_id == event.req_id
      );
      this.allRequests.splice(index, 1);
      this.allRequestsMatTableData._updateChangeSubscription();
      this.clearAllData();
      this.allRequests.forEach((r) => {
        this.addRequestsCount(r.request_status);
      });
      this.filterRequests(this.matTabIndex);
    }
    if (event.type == "archived") {
      var index = this.allRequests.findIndex(
        (req) => req.request_id == event.req_id
      );
      this.allRequests.splice(index, 1);
      this.allRequestsMatTableData._updateChangeSubscription();
      this.clearAllData();
      this.allRequests.forEach((r) => {
        this.addRequestsCount(r.request_status);
      });
      this.filterRequests(this.matTabIndex);
    }
  }

  refreshTable() {
    this.isContentLoading = true;
    this.fetchData();
  }

  addRequestsCount(status) {
    switch (status) {
      case RequestStatuses.open:
        this.open_requests_count++;
        break;
      case RequestStatuses.assigned:
        this.assigned_requests_count++;
        break;
      case RequestStatuses.inPropress:
        this.inProgress_requests_count++;
        break;
      case RequestStatuses.completed:
        this.completed_requests_count++;
        break;
      case RequestStatuses.hold:
        this.hold_requests_count++;
        break;
      case RequestStatuses.reOpen:
        this.reOpen_requests_count++;
        break;
      case RequestStatuses.reAssigned:
        this.reAssigned_requests_count++;
        break;
      case RequestStatuses.rejected:
        this.rejected_requests_count++;
        break;
      case RequestStatuses.cancelled:
        this.cancelled_requests_count++;
        break;
      default:
        break;
    }
  }

  filterRequests(index) {
    var status = this.getRequestStatusOnIndex(index);
    if (status != "no-filter") {
      var filteredArray = this.allRequests.filter(
        (req) => req.request_status == status
      );
      this.allRequestsMatTableData.data = filteredArray;
    } else {
      this.allRequestsMatTableData.data = this.allRequests;
    }
  }

  getRequestStatusOnIndex(index) {
    switch (index) {
      case 0:
        return "no-filter";
      case 1:
        return "open";
      case 2:
        return "assigned";
      case 3:
        return "inprogress";
      case 4:
        return "completed";
      case 5:
        return "hold";
      case 6:
        return "reopen";
      case 7:
        return "reassigned";
      case 8:
        return "rejected";
      case 9:
        return "cancelled";
      default:
        return "no-filter";
    }
  }

  initializePaginator(index) {
    switch (index) {
      case 0:
        this.allRequestsMatTableData.paginator = this.request_table_0.paginator;
        break;
      case 1:
        this.allRequestsMatTableData.paginator = this.request_table_1.paginator;
        break;
      case 2:
        this.allRequestsMatTableData.paginator = this.request_table_2.paginator;
        break;
      case 3:
        this.allRequestsMatTableData.paginator = this.request_table_3.paginator;
        break;
      case 4:
        this.allRequestsMatTableData.paginator = this.request_table_4.paginator;
        break;
      case 5:
        this.allRequestsMatTableData.paginator = this.request_table_5.paginator;
        break;
      case 6:
        this.allRequestsMatTableData.paginator = this.request_table_6.paginator;
        break;
      case 7:
        this.allRequestsMatTableData.paginator = this.request_table_7.paginator;
        break;
      case 8:
        this.allRequestsMatTableData.paginator = this.request_table_8.paginator;
        break;
      case 9:
        this.allRequestsMatTableData.paginator = this.request_table_9.paginator;
        break;
      default:
        this.allRequestsMatTableData.paginator = this.request_table_0.paginator;
        break;
    }
  }

  matTabClick(tab: any) {
    this.allRequestsMatTableData.filter = "";
    this.matTabIndex = tab.index;
    this.filterRequests(tab.index);
    this.initializePaginator(tab.index);
  }
}
