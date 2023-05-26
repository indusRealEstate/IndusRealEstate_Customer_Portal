import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { OtherServices } from "app/services/other.service";

@Component({
  selector: "request-timeline",
  templateUrl: "./request-timeline.html",
  styleUrls: ["./request-timeline.scss"],
})
export class RequestTimelineComponent implements OnInit {
  userId: any;

  requestSended: boolean = false;
  pending: boolean = false;
  reviewing: boolean = false;
  denied: boolean = false;
  approved: boolean = false;

  @Output() myEvent = new EventEmitter<string>();

  callParent(val) {
    this.myEvent.emit(val);
  }

  constructor(private router: Router, private otherServices: OtherServices) {}

  setupProcess(status: any) {
    if (status == "pending") {
      this.requestSended = true;
      setTimeout(() => {
        this.pending = true;
      }, 400);
    } else if (status == "review") {
      this.requestSended = true;
      setTimeout(() => {
        this.pending = true;
        setTimeout(() => {
          this.reviewing = true;
        }, 400);
      }, 400);
    } else if (status == "approved") {
      this.requestSended = true;
      setTimeout(() => {
        this.pending = true;
        setTimeout(() => {
          this.reviewing = true;
          setTimeout(() => {
            this.approved = true;
          }, 400);
        }, 400);
      }, 400);
    } else if (status == "declined") {
      this.requestSended = true;
      setTimeout(() => {
        this.pending = true;
        setTimeout(() => {
          this.reviewing = true;
          setTimeout(() => {
            this.denied = true;
          }, 400);
        }, 400);
      }, 400);
    }
  }

  ngOnInit() {}
}
