import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "app/services/authentication.service";
import { AdminService } from "app/services/admin.service";
import { DownloadService } from "app/services/download.service";
import { HttpClient } from "@angular/common/http";
import { ViewMaintenanceImageDialog } from "app/components/view-maintenance-image-dialog/view-maintenance-image-dialog";
import { MatDialog } from "@angular/material/dialog";
import { ViewUnitImageDialog } from "app/components/view-unit-image-dialog/view-unit-image-dialog";
//  import { FormsModule } from "@angular/forms";
interface Staff {
  value: string;
  viewValue: string;
}
interface Status {
  svalue: string;
  sviewValue: string;
}

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
  user_id: string;
  property_id: string;
  request_data: object | any;
  image_array: string[] = [];
  Staff: string[] = [];
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
  docsFilesUploaded: File[] = [];
  docsFilesUploaded2: File[] = [];
  

  staff: Staff[] = [
    {value: 'Staff-1', viewValue: 'Staff-1'},
    {value: 'Staff-2', viewValue: 'Staff-2'},
    {value: 'Staff-3', viewValue: 'Staff-3'},
  ];
  status: Status[] = [
    {svalue: 'Status-1', sviewValue: 'Status-1'},
    {svalue: 'Status-2', sviewValue: 'Status-2'},
  ];
  fileInput: any;
  

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
  onFileSelected(files: Array<any>) {
    for (var item of files) {
      this.docsFilesUploaded.push(item);
    }
    console.log(this.docsFilesUploaded);
    this.fileInput.value = "";
    //console.log(files);
  }
  onFileSelected2(files: Array<any>) {
    for (var item of files) {
      this.docsFilesUploaded2.push(item);
    }
    console.log(this.docsFilesUploaded2);
    this.fileInput.value = "";
    //console.log(files);
  }

  removeUploadedDoc(index) {
    this.docsFilesUploaded.splice(index, 1);
  }
  removeUploadedDoc2(index) {
    this.docsFilesUploaded2.splice(index, 1);
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
      .open(ViewMaintenanceImageDialog, {
        data: {id : this.request_id}
      })
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
