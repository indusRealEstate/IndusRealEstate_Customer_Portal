import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "app/services/authentication.service";
import { AdminService } from "app/services/admin.service";
import { DownloadService } from "app/services/download.service";
import { HttpClient } from "@angular/common/http";
import { ViewMaintenanceImageDialog } from "app/components/view-maintenance-image-dialog/view-maintenance-image-dialog";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "admin-requests-details",
  templateUrl: "./admin-requests-details.html",
  styleUrls: ["./admin-requests-details.scss"],
})
export class AdminRequestsDetails implements OnInit {
  isUserSignedIn: boolean = false;
  prop_id: string;
  request_id: string;
  request_data: object | any;
  image_array: string[] = [];
  images: string;
  documents: string;
  doc_array: string[] = [];
  d1: string;
  blob: Blob;
  isContentLoading: boolean = false;
  result_data: object | any;
  all_data: object | any;
  //downloadService: any;
  // property_name:string;

  constructor(
    private router: Router,
    private appAdminService: AdminService,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private appdownloadService: DownloadService,
    public http: HttpClient,
    public dialog: MatDialog
  ) {
    this.isContentLoading = true;

    this.getScreenSize();

    var userData = localStorage.getItem("currentUser");

    var user = JSON.parse(userData);

    this.route.queryParams.subscribe((val) => {
      //console.log(val);
      this.request_id = val.request_id;
    });
  }

  screenHeight: number;
  screenWidth: number;
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  ngAfterViewInit() {}

  async ngOnInit() {
    let data = {
      request_id: this.request_id,
    };
    this.appAdminService
      .getRequestsDetails(JSON.stringify(data)).subscribe((val) => {
       // console.log(data);
        this.all_data = val;
        console.log(this.all_data);
       

        // this.images = this.prop_data.images;

        //  this.property_name = this.prop_data.property_name;
      })
      .add(() => {
        this.isContentLoading = false;
        // console.log(this.isContentLoading);
      });

    // onCloseDialog() {
    //   let constainer = document.getElementById("full-screen-image");
    //   constainer.style.display = "none";
    //}
  }

  openDialog() {
    this.dialog
      .open(ViewMaintenanceImageDialog, {})
      .afterClosed()
      .subscribe((val) => {});
  }
}
