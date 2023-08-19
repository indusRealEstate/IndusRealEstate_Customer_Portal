import { Component, HostListener, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AddAnnouncementDialog } from "app/components/add-announcement-dialog/add-announcement-dialog";
import { AdminService } from "app/services/admin.service";
export interface PeriodicElement {
  Id: number;
  Building:string;
  Type: string;
  Title: string;
  Description: string;

}

// const ELEMENT_DATA: PeriodicElement[] = [
//   {Id: 1, Type:'Emergancy', Title: 'Water supply', Description: 'Water Supply will not availabe today from 9:00AM to 1:00PM',Building:"Building-1"},
 
// ];

@Component({
  selector: "announcements",
  templateUrl: "./announcements.html",
  styleUrls: ["./announcements.scss"],
})
export class Announcements implements OnInit {
  //dataSource = ELEMENT_DATA;
  displayedColumns: string[] = [
    // "name",
    "Id",
    "Type",
    "Building",
    "Title",
    "Description",
    "More"
  ];
  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;
  annoucement_data: Object |any ;

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
  
  addAnnouncements() {
    this.dialog
      .open(AddAnnouncementDialog, {
        width: "40%",
        height: "30rem",
      })
      .afterClosed()
      .subscribe((res) => {
        
      });
  }
  
  async ngOnInit() {
    let data = {};
    this.appAdminService
      .selectAllAnnouncement(JSON.stringify(data))
      .subscribe((val) => {
        this.annoucement_data = val;
        console.log(this.annoucement_data);
      });
    
}
}