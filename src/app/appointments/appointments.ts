import { formatDate } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatMenuTrigger } from "@angular/material/menu";
import { ActivatedRoute, Router } from "@angular/router";
import { CalendarOptions, EventSourceInput } from "@fullcalendar/core"; // useful for typechecking
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import { ViewEventDialog } from "app/components/view-event-dialog/view-event-dialog";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";

@Component({
  selector: "app-appointments",
  templateUrl: "./appointments.html",
  styleUrls: ["./appointments.scss"],
})
export class AppointmentsComponent implements OnInit {
  pageLoaded: boolean = false;
  menuTopLeftPosition = { x: "0", y: "0" };
  all_events: any[] = [
    {
      title: "Tenant Meeting",
      date: "2023-06-27",
      start: "2023-06-27T10:30:00",
      end: "2023-06-27T12:00:00",
      description: "Meeting regarding the new Tenant move-in.",
      url: "",
    },
  ];

  new_event_name: any = "";
  new_event_description: any = "";
  new_event_start_time: any;
  new_event_end_time: any;

  calendarOptions: CalendarOptions = {
    initialView: "dayGridMonth",
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    events: this.all_events,
    dateClick: (date) => {
      // console.log(date.date);
    },
    dayCellDidMount: (ev) => {
      ev.el.addEventListener("contextmenu", (jsEvent) => {
        if (ev.date.getTime() > new Date().getTime() || ev.isToday == true) {
          jsEvent.preventDefault();

          this.menuTopLeftPosition.x = jsEvent.clientX + "px";
          this.menuTopLeftPosition.y = jsEvent.clientY + "px";
          this.right_click_day = ev.dayNumberText;

          this.right_click_date = formatDate(
            new Date(ev.date),
            "yyyy-MM-dd",
            "en"
          );

          // console.log(val);
          this.rightMenuTrigger.openMenu();

          // console.log(this.rightMenuTrigger.menuOpened);
        }
      });
    },
    eventDidMount: (ev) => {
      ev.el.addEventListener("contextmenu", (jsEvent) => {});
    },
    eventClick: (event) => {
      this.dialog.open(ViewEventDialog, {
        data: {
          event: event,
          start: event.event.start,
          end: event.event.end,
        },
        width: "30%",
        height: "20rem",
      });
    },
  };

  right_click_day: any;
  right_click_date: any;

  @ViewChild(MatMenuTrigger) rightMenuTrigger: MatMenuTrigger;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private otherServices: OtherServices,
    private dialog?: MatDialog
  ) {
    if (this.authenticationService.currentUserValue) {
      var userData = localStorage.getItem("currentUser");
      var user = JSON.parse(userData);

      this.route.queryParams.subscribe((e) => {
        if (e == null) {
          router.navigate([`/appointments`], {
            queryParams: { uid: user[0]["id"] },
          });
        } else if (e != user[0]["id"]) {
          router.navigate([`/appointments`], {
            queryParams: { uid: user[0]["id"] },
          });
        }
      });
    } else {
      this.router.navigate(["/login"]);
    }
  }

  ngOnInit() {}

  ngDoCheck() {
    $(".cdk-overlay-container").on("contextmenu", (event) => {
      event.preventDefault();
      // console.log(event);

      this.rightMenuTrigger.closeMenu();
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.pageLoaded = true;
    }, 500);
  }

  addEvent(trigger: MatMenuTrigger) {
    // console.log(this.new_event_start_time);
    if (
      this.new_event_name != "" &&
      this.new_event_description != "" &&
      this.new_event_start_time != undefined &&
      this.new_event_end_time != undefined
    ) {
      trigger.closeMenu();

      var parts_start = new String(this.new_event_start_time).split(" ");
      var parts_end = new String(this.new_event_end_time).split(" ");

      // console.log(parts[4], parts[5], parts[6], parts[7], parts[8]);

      var time_start =
        parts_start[4] +
        " " +
        parts_start[5] +
        " " +
        parts_start[6] +
        " " +
        parts_start[7] +
        " " +
        parts_start[8];

      var time_end =
        parts_end[4] +
        " " +
        parts_end[5] +
        " " +
        parts_end[6] +
        " " +
        parts_end[7] +
        " " +
        parts_end[8];

      var first_date = formatDate(
        new Date(this.right_click_date),
        "EEE MMM d y",
        "en"
      );

      var full_date_start = first_date + " " + time_start;

      var full_date_end = first_date + " " + time_end;
      // console.log(full_date);

      let newEvent = {
        title: this.new_event_name,
        date: this.right_click_date,
        start: new Date(full_date_start),
        end: new Date(full_date_end),
        description: this.new_event_description,
      };

      console.log(new Date(full_date_start));

      this.all_events.push(newEvent);
      this.calendarOptions.events = [...this.all_events];

      this.new_event_name = "";
      this.new_event_description = "";
      this.new_event_start_time = undefined;
      this.new_event_end_time = undefined;
    }
  }
}
