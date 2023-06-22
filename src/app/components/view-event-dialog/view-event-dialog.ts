import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "view-event-dialog",
  styleUrls: ["./view-event-dialog.scss"],
  templateUrl: "./view-event-dialog.html",
})
export class ViewEventDialog implements OnInit {
  isLoading: boolean = false;
  detectLoaderChanges: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewEventDialog>
  ) {
    this.isLoading = true;

    this.event_data = data["event"];
    this.event_start = data["start"];
    this.event_end = data["end"];
  }

  event_data: any;
  event_title: any;
  event_description: any = "";

  event_start: any;
  event_end: any = "";

  ngOnInit() {
    this.event_title = this.event_data.event.title;
    this.event_description =
      this.event_data.event._def.extendedProps.description;
  }

  onCloseDialog() {
    this.dialogRef.close();
  }
}
