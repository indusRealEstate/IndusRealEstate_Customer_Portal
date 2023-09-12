import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { TableSearchBarComponent } from "app/components/searchbar-table/searchbar-table";
import { TableFiltersComponent } from "app/components/table-filters/table-filters";
import { ViewAllAsignStaff } from "app/components/view_all_assign_staff/view_all_assign_staff";
import { AuthenticationService } from "app/services/authentication.service";
import { RequestService } from "app/services/request.service";
import { BehaviorSubject, Observable } from "rxjs";

@Component({
  selector: "requests-table",
  templateUrl: "./requests-table.html",
  styleUrls: ["./requests-table.scss"],
})
export class RequestsTable implements OnInit {
  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  @Input() isContentLoading: boolean = true;

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

  @Input() allRequestsMatTableData: MatTableDataSource<any>;
  ngAfterViewInitInitialize: boolean = false;

  loadingTable: any[] = [1, 2, 3, 4, 5];

  statusMenuOpened: boolean = false;
  flaggedRequest: boolean = false;

  requestUpdating: Observable<any>;
  updateValue: BehaviorSubject<any> = new BehaviorSubject(false);

  pageChangerLoading: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(TableSearchBarComponent) searchBar: TableSearchBarComponent;

  @ViewChild("table_filter") table_filter: TableFiltersComponent;

  @Input() tableTitle = "";

  @Input() tableLength = 0;

  @Output() refreshTableEmit = new EventEmitter<string>();

  @Output() requestUpdatedEmit = new EventEmitter<any>();

  @Output() flagFilterEmit = new EventEmitter<any>();

  @Output() timeLineFilterEmit = new EventEmitter<any>();

  @Output() pageChangeEmit = new EventEmitter<any>();

  @Output() searchEmit = new EventEmitter<any>();

  assigned_user: object = {
    job: "",
    user_name: "",
    user_id: "",
    date_and_time: "",
  };

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private requestService: RequestService,
    public dialog: MatDialog
  ) {
    this.getScreenSize();

    this.requestUpdating = this.updateValue.asObservable().pipe();
  }

  screenHeight: number;
  screenWidth: number;
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  requestUpdated(req_id, type) {
    this.requestUpdatedEmit.emit({ req_id: req_id, type: type });
  }

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  async ngOnInit() {
    // this.getAllData();
  }

  refreshTable() {
    this.refreshTableEmit.emit();
  }

  pageChange(event) {
    this.pageChangerLoading = true;
    var limit = event.pageSize;
    var pageNumber = event.pageIndex;
    this.pageChangeEmit.emit({ limit: limit, pageNumber: pageNumber });
  }

  applyFilter(filterValue: any) {
    this.pageChangerLoading = true;
    var val = new String(filterValue).trim().toLowerCase();
    this.searchEmit.emit(val);
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
    this.pageChangerLoading = true;
    this.requestUpdated(data.request_id, type);
    let output = {
      id: data.request_id,
      type: type,
    };
    this.requestService
      .updateRequestMore(JSON.stringify(output))
      .subscribe((value) => {})
      .add(() => {
        this.updateValue.next(true);
        this.updateValue.next(false);
      });
  }

  getstaffName(data) {
    var obj = JSON.parse(data.staff_assigned);
    return obj.user_name;
  }
  ///////////////////////////////////////////////////////////////////// filter functions//////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////// filter functions//////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////// filter functions//////////////////////////////////////////////////////////////////

  showAllFlaggedRequests() {
    this.flagFilterEmit.emit(1);
  }
  closeFlaggedRequestFilter() {
    this.flagFilterEmit.emit(0);
  }
  filterByTimeline() {
    // this.timeLineFilterEmit.emit({
    //   start: this.table_filter.first_selected_timeline,
    //   end: this.table_filter.last_selected_timeline,
    // });

    this.allRequestsMatTableData.data =
      this.allRequestsMatTableData.data.filter(
        (req: any) =>
          new Date(req.request_date).getTime() >=
            new Date(this.table_filter.first_selected_timeline).getTime() &&
          new Date(req.request_date).getTime() <=
            new Date(this.table_filter.last_selected_timeline).getTime()
      );
  }
  closeTimelineFilter() {
    this.timeLineFilterEmit.emit(0);
  }

  viewAllAssignStaffList(data: any) {
    this.dialog.open(ViewAllAsignStaff, {
      data,
    });
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

  ngOnDestroy() {
    this.updateValue.unsubscribe();
  }
}
