import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'app/services/api.service';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.html',
  styleUrls: ['./modal.css']
})
export class ModalComponent implements OnInit {
  title: any;
  start: any;
  eventId: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalComponent>,
    private apiService: ApiService,
  ) { }
  ngOnInit(): void {
    this.title = this.data["title"]
    this.start = this.data["start"]
    this.eventId = this.data["event_id"]
  }

  closeModal() {
    this.dialogRef.close();
  }

  deleteEvent() {
    try {
      this.apiService.removeAppointment({ "event_id": this.eventId }).subscribe(data => {
      });
      this.closeModal();
      location.reload();
    } catch (error) {
      console.log(error);
    }

  }
}