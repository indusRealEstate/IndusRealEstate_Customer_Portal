import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "app/services/authentication.service";
import { AdminService } from "app/services/admin.service";
import { DownloadService } from "app/services/download.service";
import { HttpClient } from "@angular/common/http";
import { ViewMaintenanceImageDialog } from "app/components/view-maintenance-image-dialog/view-maintenance-image-dialog";
import { MatDialog } from "@angular/material/dialog";
import { ViewUnitImageDialog } from "app/components/view-unit-image-dialog/view-unit-image-dialog";
import { DialogAssignStaff } from "app/components/assign_staff/assign_staff";
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
  unit_id: string;
  request_id: string;
  user_id: string;
  property_id: string;
  request_data: object | any;
  media_array: string[] = [];
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
  request_feedback: object = { mood: "", details: "" };
  docsFilesUploaded: File[] = [];
  docsFilesUploaded2: File[] = [];
  selectImage: string = "";
  main_request_type: string = "";
  all_staff: object[] = [];


  staff: Staff[] = [
    { value: "Staff-1", viewValue: "Staff-1" },
    { value: "Staff-2", viewValue: "Staff-2" },
    { value: "Staff-3", viewValue: "Staff-3" },
  ];
  status: Status[] = [
    { svalue: "Status-1", sviewValue: "Status-1" },
    { svalue: "Status-2", sviewValue: "Status-2" },
  ];
  fileInput: any;
  amenities: string[] = [];

  constructor(
    private router: Router,
    private appAdminService: AdminService,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private appdownloadService: DownloadService,
    public http: HttpClient,
    public dialog: MatDialog
  ) {
    this.getScreenSize();
    this.isContentLoading = true;
    var userData = localStorage.getItem("currentUser");

    var user = JSON.parse(userData);

    this.route.queryParams.subscribe((val) => {
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
      .getRequestsDetails(JSON.stringify(data))
      .subscribe((val) => {
        this.all_data = val;

        console.log(this.all_data);
        this.request_feedback = JSON.parse(this.all_data.main_feedback);

        for (
          let i = 0;
          i < JSON.parse(this.all_data.main_staff_assigned).length;
          i++
        ) {
          this.Staff.push(JSON.parse(this.all_data.main_staff_assigned)[i]);
        }
        for (let i = 0; i < JSON.parse(this.all_data.main_media).length; i++) {
          this.media_array.push(JSON.parse(this.all_data.main_media)[i]);
        }
        for (
          let i = 0;
          i < JSON.parse(this.all_data.unit_amenties).length;
          i++
        ) {
          this.amenities.push(JSON.parse(this.all_data.unit_amenties)[i]);
        }

        for(let i = 0; i < JSON.parse(this.all_data.main_staff_assigned).length; i++){
          let staff = {
            job : JSON.parse(this.all_data.main_staff_assigned)[i].job,
            user_name : JSON.parse(this.all_data.main_staff_assigned)[i].user_name,
            user_id : JSON.parse(this.all_data.main_staff_assigned)[i].user_id,
            date_and_time: JSON.parse(this.all_data.main_staff_assigned)[i].date_and_time,
          };

          this.all_staff.push(staff);
        }

        this.main_request_type = this.all_data.main_request_type;

        console.log(this.media_array);
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
        data: { id: this.request_id },
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

  viewImageOfUnit(data: string) {
    let constainer = document.getElementById("full-screen-image");
    constainer.style.display = "flex";
    constainer.style.width = "100vw";
    constainer.style.height = "100vh";
    constainer.style.backgroundColor = "#000000bd";
    constainer.style.position = "fixed";
    constainer.style.zIndex = "1000";
    constainer.style.top = "0";
    constainer.style.left = "0";
    let image = document.getElementById("image");
    image.setAttribute("src", data);
    image.style.width = "75vw";
    image.style.height = "75vh";
    image.style.objectFit = "cover";
    image.style.objectPosition = "bottom";
    image.style.margin = "auto";
  }

  onCloseDialog() {
    let constainer = document.getElementById("full-screen-image");
    constainer.style.display = "none";
  }

  downloadDoc() {
    if (this.selectImage != "") {
      window.open(
        `https://indusre.app/api/mobile_app/upload/service-request/${this.all_data.main_request_id}/${this.selectImage}`
      );
    }
  }

  navigateToUnit(unit) {
    this.router.navigate(["/admin-property-unit-details"], {
      queryParams: { unit_id: unit },
    });
  }

  openProperty() {
    this.router.navigate(["/property-details"], {
      queryParams: {
        prop_id: this.all_data.prop_uid,
      },
    });
  }

  viewMedia() {}

  changeStatus(id: string, status: string) {
    let data = {
      id: id,
      status: status,
    };

    this.appAdminService
      .updateRequestStatus(JSON.stringify(data))
      .subscribe((value) => {
        console.log(value);
        let result: any = value;
        this.main_request_type = result.status;
      });
  }

  openAssignStaff(id) {
    this.dialog.open(DialogAssignStaff, {
      data: {
        id: id,
      },
    }).afterClosed().subscribe((value)=>{
      console.log(value.data);
      let staff = {
        job : value.data.job,
        user_name : value.data.user_name,
        user_id : value.data.user_id
      };

      this.all_staff.push(staff);

      console.log(staff);
    });
  }

  viewUser(data: any) {
    this.router.navigate(["/admin-user-details"], {
      queryParams: {
        user_id: data,
      },
    });
  }
}
