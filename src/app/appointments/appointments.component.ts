
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CalendarOptions, EventInput, } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { ApiService } from 'app/services/api.service';
import { AuthenticationService } from 'app/services/authentication.service';
import { ModalComponent } from './show_model_event/modal';
import { ModalComponentDate } from './show_modal_date/modal-date';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { OtherServices } from 'app/services/other.service';


@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})
export class AppointmentsComponent implements OnInit {

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  @ViewChildren('calendar')
  cal: QueryList<ElementRef>;

  events: any[] = [];
  currentMonthEvents: any[] = [];
  showEventModel: boolean = false;
  eventDetails: any;
  rawEventData: any[] = [];
  isLoading: boolean = false;


  calendarOptions: CalendarOptions = {
    editable: true,
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
  };

  isUserSignedIn: boolean = false;


  constructor(
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private changeDetectorRef: ChangeDetectorRef,
    public http: HttpClient,
    public matDialog: MatDialog,
    private otherServices: OtherServices,
  ) { }

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(['/login']);
    }
  }

  initFunction() {
    this.isUserSignOut();

    var sessionData = sessionStorage.getItem('allEvents');
    var sessionDataCurrentMonth = sessionStorage.getItem('currentMonthEvents');
    if (sessionData != null) {
      var rawData = JSON.parse(sessionData);
      this.events = rawData;
      console.log("from session");

      var data = localStorage.getItem('currentUser');
      var user = JSON.parse(data);
      var userId = user[0]["id"];

      this.apiService.getUserAppoinments(userId).subscribe(data => {
        for (let e of data) {
          this.rawEventData.push(e);
        }
      });

    } else {
      this.getUserAppointments();
      console.log("from api");
    }

    this.changeCalendarOptionsView();

    if (sessionDataCurrentMonth != null) {
      var rawData = JSON.parse(sessionDataCurrentMonth);

      this.currentMonthEvents = rawData;
    } else {
      this.isLoading = true;
      setTimeout(() => {
        this.getCurrentMonthEvents();
      }, 600);
    }
  }

  ngOnInit() {
    this.initFunction();
  }

  changeCalendarOptionsView() {
    var sessionData = sessionStorage.getItem('allEvents');
    setTimeout(() => {
      this.calendarOptions = {
        editable: true,
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
        events: this.events,
        eventClick: (e) => {
          for (let ev of this.rawEventData) {
            if (ev["event_name"] == e.event.title) {
              var dateDay = Number(e.event.start.toISOString().split("T")[0].split("-")[2]);
              var currentDate = e.event.start.toISOString().split("T")[0].split("-")[0] + '-' + e.event.start.toISOString().split("T")[0].split("-")[1] + '-' + dateDay.toString();

              this.openModalEvent(e.event.title, e.event.start, ev["event_id"], currentDate);

            }
          }

        },
        dateClick: (day) => {
          var events = day.view.calendar.getEvents();
          var currentDateEvents: any[] = [];
          if (events != null || events != undefined) {
            for (let e of events) {
              if (e.start.toDateString() == day.date.toDateString()) {
                currentDateEvents.push({ "title": e.title, "start": e.start });
              }
            }
          }

          var today = day.view.calendar.getDate().getTime();
          if (today <= day.date.getTime()) {
            // getting current date.
            var dateDay = Number(day.date.toISOString().split("T")[0].split("-")[2]) + 1;
            var currentDate = day.date.toISOString().split("T")[0].split("-")[0] + '-' + day.date.toISOString().split("T")[0].split("-")[1] + '-' + dateDay.toString();

            this.openModalDate(day.date.toDateString(), currentDateEvents, currentDate);
          }
        },
        datesSet: () => {
          this.getCurrentMonthEvents();
        },

      };
    }, sessionData != null ? 0 : 500);
  }

  getCurrentMonth() {
    let calendarApi = this.calendarComponent.getApi();
    let currentData = calendarApi.getCurrentData();
    let month = currentData.viewTitle;

    return month;
  }

  getCurrentMonthEvents() {
    this.currentMonthEvents.length = 0;

    let calendarApi = this.calendarComponent.getApi();
    let currentData = calendarApi.getCurrentData();
    let month = currentData.viewTitle;

    this.events.map(data => {
      if (month == data["month"]) {
        this.currentMonthEvents.push({
          title: data["title"],
          start: data["start"],
        });
      }
    });

    this.isLoading = false;

    sessionStorage.setItem('currentMonthEvents', JSON.stringify(this.currentMonthEvents));
  }

  getUserAppointments() {
    var data = localStorage.getItem('currentUser');
    var user = JSON.parse(data);
    var userId = user[0]["id"];

    this.apiService.getUserAppoinments(userId).subscribe((data: any[]) => {
      if (data != null) {
        data.sort((a: any, b: any) => new Date(a["time"]).getTime() - new Date(b["time"]).getTime());

        for (let e of data) {
          var eventMonth = this.getMonthByNumber(new Date(e["time"]).getMonth());
          this.rawEventData.push(e);
          this.events.push({
            title: e["event_name"],
            start: e["time"],
            month: eventMonth,
          })

        }
      }

      if (data.length == this.events.length) {
        sessionStorage.setItem('allEvents', JSON.stringify(this.events));
      }

    });
  }

  dialogConfig = new MatDialogConfig();
  modalDialog: MatDialogRef<ModalComponent, any> | undefined;
  modalDialogDate: MatDialogRef<ModalComponentDate, any> | undefined;

  openModalEvent(title: any, start: any, eventId: any, date: any) {
    this.dialogConfig.id = "modal-component";
    // this.dialogConfig.height = "300px";
    this.dialogConfig.width = "550px";
    this.dialogConfig.data = { "title": title, "start": start, "event_id": eventId, "date": date };
    this.modalDialog = this.matDialog.open(ModalComponent, this.dialogConfig);

    this.modalDialog.afterClosed().subscribe(() => {
      if (this.otherServices.isDialogClosed == false) {
        this.isLoading = true;
        this.events.length = 0;
        this.currentMonthEvents.length = 0;

        this.initFunction();
        let calendarApi = this.calendarComponent.getApi();
        calendarApi.refetchEvents();
      }

    });
  }

  openModalDate(dateString: any, events: any[], date: any) {
    this.dialogConfig.id = "modal-component";
    // this.dialogConfig.height = "300px";
    this.dialogConfig.width = "550px";
    this.dialogConfig.data = { "dateString": dateString, "events": events, "date": date };
    this.modalDialogDate = this.matDialog.open(ModalComponentDate, this.dialogConfig);

    this.modalDialogDate.afterClosed().subscribe(() => {
      if (this.otherServices.isDialogClosed == false) {
        this.isLoading = true;
        this.events.length = 0;
        this.currentMonthEvents.length = 0;
        
        this.initFunction();
        this.calendarComponent.ngAfterContentChecked();

      }
    });
  }

  getMonthByNumber(number: number) {
    switch (number) {
      case 0:
        return 'January 2023';
      case 1:
        return 'February 2023';
      case 2:
        return 'March 2023';
      case 3:
        return 'April 2023';
      case 4:
        return 'May 2023';
      case 5:
        return 'June 2023';
      case 6:
        return 'July 2023';
      case 7:
        return 'August 2023';
      case 8:
        return 'September 2023';
      case 9:
        return 'October 2023';
      case 10:
        return 'November 2023';
      case 11:
        return 'December 2023';
      default:
        console.log("No such month exists!");
        break;
    }
  }
}
