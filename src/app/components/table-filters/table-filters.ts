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

  first_selected_timeline: any;
  last_selected_timeline: any;

  @Output() showAllFlaggedReqs = new EventEmitter<string>();
  @Output() timeLineFilter = new EventEmitter<string>();
  @Output() statusFilter = new EventEmitter<string>();
  @Output() refresh = new EventEmitter<string>();

  refreshTable() {
    this.refresh.emit();
  }

  showAllFlaggedRequests() {
    this.showAllFlaggedReqs.emit();
    this.flaggedRequestsFilterOn = true;
  }

  filterByTimeline(trigger: MatMenuTrigger) {
    this.timeLineFilter.emit();
    trigger.closeMenu();
    this.timeLineFilterOn = true;
  }

  showRequestsOnStatus(status, trigger: MatMenuTrigger) {
    this.statusFilter.emit(status);
    trigger.closeMenu();
    this.statusFilterOn = true;
  }

  closeFlaggedRequestFilter() {
    this.flaggedRequestsFilterOn = false;
  }
  closeStatusFilter() {
    this.statusFilterOn = false;
  }
  closeTimelineFilter() {
    this.timeLineFilterOn = false;
  }

  constructor(private router: Router, private otherServices: OtherServices) {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.userId = user[0]["id"];
  }

  ngOnInit() {}
}
