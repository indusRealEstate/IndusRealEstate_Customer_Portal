import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";

@Component({
  selector: "announcement-details-dialog",
  styleUrls: ["./announcement-details-dialog.scss"],
  templateUrl: "./announcement-details-dialog.html",
})
export class AnnouncementDetailsDialog implements OnInit {
  announcementData: any;
  emergency: any = "";

  attachments: any[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AnnouncementDetailsDialog>,
    private router: Router
  ) {
    this.announcementData = data;

    this.emergency =
      data.emergency == "0" ? "Not Emergency" : "Emergency";
    this.attachments = JSON.parse(data.attachments);
    console.log(data);
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  downloadAttachment(att) {}

  onCloseDialog() {
    this.dialogRef.close();
  }

  navigateToProprety(data: any) {
    this.onCloseDialog();
    this.router.navigate(["/property-details"], {
      queryParams: {
        prop_id: data,
      },
    });
  }
}
