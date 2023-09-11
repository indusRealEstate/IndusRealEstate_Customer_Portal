import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { DownloadService } from "app/services/download.service";
import * as FileSaver from "file-saver";

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
    private router: Router,
    private downloadService: DownloadService
  ) {
    this.announcementData = data;

    this.emergency = data.emergency == "0" ? "Not Emergency" : "Emergency";
    this.attachments = JSON.parse(data.attachments);
    console.log(data);
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  downloadDoc(item) {
    this.downloadService
      .downloadFile(
        `announcement/${this.announcementData.announcement_id}/${item}`
      )
      .subscribe((res: any) => {
        FileSaver.saveAs(res, item);
      });
  }

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
