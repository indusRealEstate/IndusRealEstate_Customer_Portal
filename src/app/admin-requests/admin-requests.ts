import { Component, HostListener, OnInit } from "@angular/core";
import { OtherServices } from "app/services/other.service";

@Component({
  selector: "admin-requests",
  templateUrl: "./admin-requests.html",
  styleUrls: ["./admin-requests.scss"],
})
export class AdminRequests implements OnInit {
  isUserSignedIn: boolean = false;

  constructor(private otherServices: OtherServices) {
    this.getScreenSize();
  }

  allProperties: any[] = [];
  allUnits: any[] = [];
  allUsers: any[] = [];


  screenHeight: number;
  screenWidth: number;
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  async ngOnInit() {}

  matTabClick(tab: any) {
    this.otherServices.admin_requests_tab_toggle.next(true);

    setTimeout(() => {
      this.otherServices.admin_requests_tab_toggle.next(false);
    });
  }
}
