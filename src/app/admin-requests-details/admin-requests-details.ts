import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "app/services/authentication.service";
import { AdminService } from "app/services/admin.service";
import { DownloadService } from "app/services/download.service";
import { HttpClient } from "@angular/common/http";
import { ViewMaintenanceImageDialog } from "app/components/view-maintenance-image-dialog/view-maintenance-image-dialog";
import { MatDialog } from "@angular/material/dialog";
import { ViewUnitImageDialog } from "app/components/view-unit-image-dialog/view-unit-image-dialog";

@Component({
  selector: "admin-requests-details",
  templateUrl: "./admin-requests-details.html",
  styleUrls: ["./admin-requests-details.scss"],
})
export class AdminRequestsDetails implements OnInit {
  isUserSignedIn: boolean = false;
  prop_id: string;
  unit_id:string
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
  feedback_array: string[] = [];
  request_feedback:object = {mood:'',details:''};
  

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
      feedback:this.feedback
    };
    this.appAdminService
      .getRequestsDetails(JSON.stringify(data)).subscribe((val) => {
       // console.log(data);
        this.all_data = val;
        console.log(this.all_data);
        //console.log(this.all_data.main_feedback);
        
        // this.feedback = this.all_data.main_feedback;
        // console.log(this.myJSON);
        console.log(JSON.parse(this.all_data.main_feedback));
        this.request_feedback = JSON.parse(this.all_data.main_feedback);
        
        
      })
      .add(() => {
        this.isContentLoading = false;
      });
      
  }
  feedback(feedback: any) {
    throw new Error("Method not implemented.");
  }
  navigateToUnitDetailPage(unit_id: any) {
    this.router.navigate(["/admin-property-unit-details"], {
      queryParams: { unit_id: unit_id },
    });
  }
  navigateTopPropertyDetailPage(prop_id: any) {
    this.router.navigate(["/property-details"], {
      queryParams: { prop_id: prop_id },
    });
  }
  openDialog() {
    this.dialog
      .open(ViewMaintenanceImageDialog, {})
      .afterClosed()
      .subscribe((val) => {});
  }
  openUnitDialog() {
    this.dialog
      .open(ViewUnitImageDialog, {})
      .afterClosed()
      .subscribe((val) => {});
  }
}
