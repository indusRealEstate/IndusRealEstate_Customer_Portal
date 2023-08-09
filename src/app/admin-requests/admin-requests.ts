import { Component, HostListener, OnInit } from "@angular/core";
import { FirebaseService } from "app/services/firebase.service";
import { OtherServices } from "app/services/other.service";

@Component({
  selector: "admin-requests",
  templateUrl: "./admin-requests.html",
  styleUrls: ["./admin-requests.scss"],
})
export class AdminRequests implements OnInit {
  isUserSignedIn: boolean = false;

  constructor(
    private otherServices: OtherServices,
    private firebaseService: FirebaseService
  ) {
    this.getScreenSize();
  }

  screenHeight: number;
  screenWidth: number;
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  async ngOnInit() {
    await this.firebaseService.firebaseLogin().then(async () => {
      this.firebaseService.getData().subscribe((res : any[]) => {
         var new_reqs = [];
         res.forEach((doc)=>{
          if(doc.seen == false){
            
          }
         })
      });
    });
  }

  ngAfterViewInit() {}

  matTabClick(tab: any) {
    this.otherServices.admin_requests_tab_toggle.next(true);

    setTimeout(() => {
      this.otherServices.admin_requests_tab_toggle.next(false);
    });
  }
}
