import { Component, HostListener, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { AdminService } from "app/services/admin.service";
import { FirebaseService } from "app/services/firebase.service";

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

  matTabIndex: any = 0;

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
          console.log("all exist");
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
    this.adminService
      .getAllRequestsAdmin()
      .subscribe((va: any[]) => {
        this.allRequests = va;
        this.allRequestsMatTableData = new MatTableDataSource(va);
      })
      .add(() => {
        this.isContentLoading = false;
        if (this.matTabIndex != 0) {
          this.filterRequests(this.matTabIndex);
        }
      });
  }

  refreshTable() {
    this.isContentLoading = true;
    this.fetchData();
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

  ngAfterViewInit() {}

  matTabClick(tab: any) {
    this.allRequestsMatTableData.filter = "";
    this.matTabIndex = tab.index;
    this.filterRequests(tab.index);
  }
}
