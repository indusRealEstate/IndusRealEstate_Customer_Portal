import { Component, HostListener, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AdminService } from "app/services/admin.service";

@Component({
  selector: "announcements",
  templateUrl: "./announcements.html",
  styleUrls: ["./announcements.scss"],
})
export class Announcements implements OnInit {
  displayedColumns: string[] = [
    // "name",
    "Id",
    "Type",
    "Title",
    "Description"
  ];
  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;

  constructor(
    private appAdminService: AdminService,
    private dialog: MatDialog
  ) {
    // this.isLoading = true;
    this.isContentLoading = true;

    this.getScreenSize();
  }

  screenHeight: number;
  screenWidth: number;
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  ngAfterViewInit() {}

  async ngOnInit() {
    // addAnnouncements() {
    //   this.dialog
    //     .open(AddAnnouncementDialog, {
    //       width: "75%",
    //       height: "43rem",
    //     })
    //     .afterClosed()
    //     .subscribe((res) => {
          
    //     });
    // }
  }
}
