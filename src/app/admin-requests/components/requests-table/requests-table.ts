import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { TableFiltersComponent } from "app/components/table-filters/table-filters";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";
import { MatDialog } from "@angular/material/dialog";
import { ViewAllAsignStaff } from "app/components/view_all_assign_staff/view_all_assign_staff";

@Component({
  selector: "requests-table",
  templateUrl: "./requests-table.html",
  styleUrls: ["./requests-table.scss"],
})
export class RequestsTable implements OnInit {
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
    "staff",
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

  @ViewChild("table_filter") table_filter: TableFiltersComponent;

  @Input() tableTitle = "";

  assigned_user: object = {
    job: "",
    user_name: "",
    user_id: "",
    date_and_time: "",
  };

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private adminService: AdminService,
    private otherServices: OtherServices,
    public dialog: MatDialog
  ) {
    // this.isLoading = true;
    this.isContentLoading = true;

    this.getScreenSize();

    this.otherServices.admin_requests_tab_toggle.subscribe((val) => {
      if (val == true) {
        this.fetchData();
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

  getbuildingName(prop_id) {
    if (this.allProperties != null) {
      var property = this.allProperties.find(
        (prop) => prop.property_id == prop_id
      );
      if (property != undefined) {
        return property.property_name;
      } else {
        return "loading..";
      }
    } else {
      return "loading..";
    }
  }

  getUnitNo(unit_id) {
    if (this.allUnits != null) {
      var unit = this.allUnits.find((u) => u.unit_id == unit_id);

      if (unit != undefined) {
        return unit.unit_no;
      } else {
        return "loading..";
      }
    } else {
      return "loading..";
    }
  }

  getUserName(user_id) {
    if (this.allUsers != null) {
      var user = this.allUsers.find((u) => u.user_id == user_id);

      if (user != undefined) {
        return user.name;
      } else {
        return "loading..";
      }
    } else {
      return "loading..";
    }
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
        // this.allRequestsMatTableData.paginator.pageSize = 10;
      }
    } else {
      setTimeout(() => {
        if (this.allRequestsMatTableData != undefined) {
          this.allRequestsMatTableData.paginator = this.paginator;
          // this.allRequestsMatTableData.paginator.pageSize = 10;
        }
      });
    }
  }

  fetchData() {
    this.adminService
      .getAllRequestsAdmin()
      .subscribe((va: any[]) => {
        this.allRequests = va;

        var status = this.getRequestStatusOnIndex();
        if (status == "no-filter") {
          this.allRequestsMatTableData = new MatTableDataSource(va);
        } else {
          var filteredArray = this.allRequests.filter(
            (req) => req.request_status == status
          );
          this.allRequestsMatTableData = new MatTableDataSource(filteredArray);
        }

        setTimeout(() => {
          if (this.allRequestsMatTableData != undefined) {
            this.allRequestsMatTableData.paginator = this.paginator;
            // this.allRequestsMatTableData.paginator.pageSize = 10;
          }
        });
      })
      .add(() => {
        this.isContentLoading = false;
      });
  }

  getAllData() {
    var propertiesDataSession = JSON.parse(
      sessionStorage.getItem("admin_properties_session")
    );

    if (propertiesDataSession == null) {
      this.adminService.getallPropertiesAdmin().subscribe((val: any[]) => {
        this.allProperties = val;
      });
    } else {
      this.allProperties = propertiesDataSession;
    }

    var unitsDataSession = JSON.parse(
      sessionStorage.getItem("admin_properties_units_session")
    );

    if (unitsDataSession == null) {
      this.adminService.getallPropertiesUnitsAdmin().subscribe((val: any[]) => {
        this.allUnits = val;
      });
    } else {
      this.allUnits = unitsDataSession;
    }

    var usersDataSession = JSON.parse(
      sessionStorage.getItem("all_users_session")
    );

    if (usersDataSession == null) {
      this.adminService.getAllUsersAdmin().subscribe((val: any[]) => {
        this.allUsers = val;
      });
    } else {
      this.allUsers = usersDataSession;
    }
  }

  async ngOnInit() {
    this.getAllData();
    this.fetchData();
  }

  clearAllVariables() {
    this.allRequests.length = 0;
  }

  refreshTable() {
    this.isContentLoading = true;
    if (this.table_filter != undefined) {
      this.table_filter.flaggedRequestsFilterOn = false;
      this.table_filter.statusFilterOn = false;
      this.table_filter.timeLineFilterOn = false;
    }
    this.fetchData();
  }

  applyFilter(filterValue: any) {
    var val = new String(filterValue).trim().toLowerCase();
    this.allRequestsMatTableData.filter = val;
  }

  navigateToUnitDetailPage(unit_id) {
    this.router.navigate(["/admin-property-unit-details"], {
      queryParams: { unit_id: unit_id },
    });
  }

  navigateToPropertyDetailsPage(prop_id) {
    this.router.navigate(["/property-details"], {
      queryParams: { prop_id: prop_id },
    });
  }

  navigateToUserDetailsPage(user_id) {
    this.router.navigate(["/admin-user-details"], {
      queryParams: { user_id: user_id },
    });
  }

  viewRequestsDetails(data: any) {
    this.router.navigate(["/admin-requests-details"], {
      queryParams: {
        request_id: data.request_id,
      },
    });
  }

  updateMore(data: any, type: string) {
    let output = {
      id: data.request_id,
      type: type,
    };
    this.adminService
      .updateRequestMore(JSON.stringify(output))
      .subscribe((value) => {
        this.refreshTable();
      });
  }

  getstaffName(data) {
    var obj = JSON.parse(data.staff_assigned);
    return obj.user_name;
  }
  ///////////////////////////////////////////////////////////////////// filter functions//////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////// filter functions//////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////// filter functions//////////////////////////////////////////////////////////////////

  showAllFlaggedRequests() {}
  closeFlaggedRequestFilter() {}
  closeStatusFilter() {}
  filterByTimeline() {}
  closeTimelineFilter() {}

  getRequestStatusOnIndex() {
    switch (this.tableTitle) {
      case "All Requests":
        return "no-filter";
      case "Open Requests":
        return "open";
      case "Assigned Requests":
        return "assigned";
      case "In Progress Requests":
        return "inprogress";
      case "Completed Requests":
        return "completed";
      case "Hold Requests":
        return "hold";
      case "Re-Open Requests":
        return "reopen";
      case "Re-Assigned Requests":
        return "reassigned";
      case "Rejected Requests":
        return "rejected";
      case "Cancelled Requests":
        return "cancelled";
      default:
        return "no-filter";
    }
  }

  viewAllAssignStaffList(data: any) {
    this.dialog.open(ViewAllAsignStaff, {
      data,
    });
  }

  getOnlyName(data: any){
    return JSON.parse(data).name;
  }

  isNameEmpty(data: any){
    if(JSON.parse(data).name !== undefined){
      return true
    }
    else{
      return false
    }
  }
}
