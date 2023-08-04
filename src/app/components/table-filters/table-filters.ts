import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MatMenuTrigger } from "@angular/material/menu";
import { Router } from "@angular/router";
import { OtherServices } from "app/services/other.service";

@Component({
  selector: "table-filters",
  templateUrl: "./table-filters.html",
  styleUrls: ["./table-filters.scss"],
})
export class TableFiltersComponent implements OnInit {
  userId: any;

  flaggedRequestsFilterOn: boolean = false;
  timeLineFilterOn: boolean = false;
  statusFilterOn: boolean = false;
  timeLineFilterDateNotSelected: boolean = false;
  timeLineFilterselectedWrong: boolean = false;
  statusFilter: any;

  first_selected_timeline: any;
  last_selected_timeline: any;

  @Output() showAllFlaggedReqs = new EventEmitter<string>();
  @Output() closeFlaggedReqs = new EventEmitter<string>();
  @Output() timeLineFilter = new EventEmitter<string>();
  @Output() closeTimeLineFilterEmitter = new EventEmitter<string>();
  // @Output() statusFilterEmitter = new EventEmitter<string>();
  @Output() closeStatusFilterEmitter = new EventEmitter<string>();
  @Output() refresh = new EventEmitter<string>();

  refreshTable() {
    this.refresh.emit();
  }

  showAllFlaggedRequests() {
    this.showAllFlaggedReqs.emit();
    this.flaggedRequestsFilterOn = true;
  }

  filterByTimeline(trigger: MatMenuTrigger) {
    if (this.first_selected_timeline && this.last_selected_timeline) {
      var first = new Date(this.first_selected_timeline).getTime();
      var last = new Date(this.last_selected_timeline).getTime();
      if (last < first) {
        this.timeLineFilterselectedWrong = true;

        setTimeout(() => {
          this.timeLineFilterselectedWrong = false;
        }, 3000);
      } else {
        this.timeLineFilter.emit();
        trigger.closeMenu();
        this.timeLineFilterOn = true;
      }
    } else {
      this.timeLineFilterDateNotSelected = true;

      setTimeout(() => {
        this.timeLineFilterDateNotSelected = false;
      }, 3000);
    }
  }

  // showRequestsOnStatus(status, trigger: MatMenuTrigger) {
  //   this.statusFilterEmitter.emit(status);
  //   this.statusFilter = status;
  //   trigger.closeMenu();
  //   this.statusFilterOn = true;
  // }

  closeFlaggedRequestFilter() {
    this.closeFlaggedReqs.emit();
    this.flaggedRequestsFilterOn = false;
  }
  closeStatusFilter() {
    this.closeStatusFilterEmitter.emit();
    this.statusFilterOn = false;
  }
  closeTimelineFilter() {
    this.closeTimeLineFilterEmitter.emit();
    this.timeLineFilterOn = false;
  }

  constructor(private router: Router, private otherServices: OtherServices) {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.userId = user[0]["id"];
  }

  ngOnInit() {}
}
