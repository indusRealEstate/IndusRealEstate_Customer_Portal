import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'app/services/api.service';

@Component({
  selector: 'app-modal-date',
  templateUrl: './modal-date.html',
  styleUrls: ['./modal-date.scss']
})
export class ModalComponentDate implements OnInit {

  date: any;
  events = [];
  time: string;

  public newEvent: string = '';
  noEventName: boolean = false;
  currentTime: Date = new Date();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalComponentDate>,
    private apiService: ApiService,
  ) { }

  ngOnInit() {
    this.date = this.data["dateString"];
    this.events = this.data["events"];
    if (this.events.length !== 0) {
      this.events.sort(function (x, y) {
        return x["start"] - y["start"];
      });
    }

    this.getCurrentTime();

  }

  getCurrentTime() {
    let now = new Date();
    let hours = ("0" + now.getHours()).slice(-2);
    let minutes = ("0" + now.getMinutes()).slice(-2);
    let str = hours + ':' + minutes;
    this.time = str;
  }

  closeModal() {
    this.dialogRef.close();
  }

  getRandomId() {
    return Math.floor((Math.random() * 6) + 1);
  }

  addEvent() {
    if (this.newEvent.length != 0) {
      this.noEventName = false;

      var userData = localStorage.getItem('currentUser');
      var user = JSON.parse(userData);
      var userId = user[0]["id"];

      var eventId = this.getRandomId();
      console.log(eventId);
      var timeStamp = this.data["date"] + " " + this.time + ":00";
      var eventData = {
        "user_id": userId,
        "event_name": this.newEvent,
        "date": this.data["date"],
        "time": timeStamp,
        "event_id": eventId,
      }

      let now = new Date();
      var dateDay = Number(now.toISOString().split("T")[0].split("-")[2]);
      var currentDate = now.toISOString().split("T")[0].split("-")[0] + '-' + now.toISOString().split("T")[0].split("-")[1] + '-' + dateDay.toString();

      var recentHapenings_event_added = {
        "user_id": userId,
        "content": `You have added an appointment on ${this.data["date"]} named ${this.newEvent}`,
        "date": currentDate,
      }

      try {
        this.apiService.addAppointment(eventData).subscribe(data => {
        });

        this.apiService.addUserRecentHappenings(recentHapenings_event_added).subscribe(data=>{});
        
        this.closeModal();
        location.reload();
      } catch (error) {
        console.log(error);
      }

    } else {
      this.noEventName = true;
    }
  }
}