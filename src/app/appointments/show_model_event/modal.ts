// import { Component, Inject, OnInit } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { ApiService } from 'app/services/api.service';
// import { OtherServices } from 'app/services/other.service';
// @Component({
//   selector: 'app-modal',
//   templateUrl: './modal.html',
//   styleUrls: ['./modal.css']
// })
// export class ModalComponent implements OnInit {
//   title: any;
//   start: any;
//   eventId: any;

//   constructor(
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     public dialogRef: MatDialogRef<ModalComponent>,
//     private apiService: ApiService,
//     private otherService: OtherServices,

//   ) { }
//   ngOnInit(): void {
//     this.title = this.data["title"]
//     this.start = this.data["start"]
//     this.eventId = this.data["event_id"]
//   }

//   closeModal() {
//     this.dialogRef.close();
//     this.otherService.isDialogClosed = true;
//   }

//   deleteEvent() {

//     var userData = localStorage.getItem('currentUser');
//     var user = JSON.parse(userData);
//     var userId = user[0]["id"];

//     let now = new Date();
//     var dateDay = Number(now.toISOString().split("T")[0].split("-")[2]);
//     var currentDate = now.toISOString().split("T")[0].split("-")[0] + '-' + now.toISOString().split("T")[0].split("-")[1] + '-' + dateDay.toString();

//     var recentHapenings_event_removed = {
//       "user_id": userId,
//       "content": `You have removed an appointment on ${this.data["date"]} named ${this.data["title"]}`,
//       "date": currentDate,
//     }

//     try {
//       this.apiService.removeAppointment({ "event_id": this.eventId }).subscribe(data => {
//       });
//       sessionStorage.removeItem('allEvents');
//       sessionStorage.removeItem('currentMonthEvents');

//       this.apiService.addUserRecentHappenings(recentHapenings_event_removed).subscribe(data => { });


//       this.closeModal();
//       // this.otherService.isUserAppointmentUpdated = true;
//     } catch (error) {
//       console.log(error);
//     } finally {
//       this.otherService.isDialogClosed = false;
//     }

//   }
// }