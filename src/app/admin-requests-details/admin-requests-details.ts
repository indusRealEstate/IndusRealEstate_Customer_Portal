import { OtherServices } from "./../services/other.service";
import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "app/services/authentication.service";
import { AdminService } from "app/services/admin.service";
import { DownloadService } from "app/services/download.service";
import { HttpClient } from "@angular/common/http";
import { ViewMaintenanceImageDialog } from "app/components/view-maintenance-image-dialog/view-maintenance-image-dialog";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { ViewUnitImageDialog } from "app/components/view-unit-image-dialog/view-unit-image-dialog";
import { DialogAssignStaff } from "app/components/assign_staff/assign_staff";
import { DialogViewMedia } from "app/components/view_media/view_media";
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
  current_date: Date = new Date();
  utc =
    this.current_date.getTime() + this.current_date.getTimezoneOffset() * 60000;
  uaeDate = new Date(this.utc + 3600000 * 4);
  current_time = this.current_date.toTimeString();
  assign_date: Date;

  isUserSignedIn: boolean = false;
  prop_id: string;
  unit_id: string;
  request_id: string;
  user_id: string;
  property_id: string;
  request_data: object | any;
  media_array: string[] = [];
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
  main_request_status: string = "";
  select_staff: string = "";
  staff_selected: boolean = false;
  selected_time: string;
  date_select: boolean = false;
  maintenance_staff: object = {
    name: "",
    date: "",
    time: "",
  };
  staff_assigned: boolean = false;
  reassign: boolean = false;
  staff_empty: boolean = false;

  @ViewChild("full_screen", { static: true }) full_screen;

  sideBar_opened: boolean = false;

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
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private appAdminService: AdminService,
    private otherServices: OtherServices,
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

    this.otherServices.miniSideBarClicked.subscribe((val) => {
      this.sideBar_opened = val;
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

        // console.log(this.all_data);
        this.request_feedback = JSON.parse(this.all_data.main_feedback);

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

        this.maintenance_staff =
          this.all_data.main_staff_assigned == "{}"
            ? undefined
            : JSON.parse(this.all_data.main_staff_assigned);

        this.main_request_status = this.all_data.main_request_status;
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

  viewMedia(data: string) {
    this.dialog
      .open(DialogViewMedia, {
        data: {
          link: `https://indusre.app/api/mobile_app/upload/service-request/${this.all_data.main_request_id}/`,
          data: data,
        },
      })
      .afterClosed();
  }

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
        this.main_request_status = result.status;
      });
  }

  // openAssignStaff(id) {
  //   this.dialog.open(DialogAssignStaff, {
  //     data: {
  //       id: id,
  //     },
  //   }).afterClosed().subscribe((value)=>{

  //     let staff = {
  //       job : value.output_data.job,
  //       user_name : value.output_data.user_name,
  //       user_id : value.output_data.user_id,
  //       date_and_time: value.output_data.date_and_time
  //     };

  //   });
  // }

  viewUser(data: any) {
    this.router.navigate(["/admin-user-details"], {
      queryParams: {
        user_id: data,
      },
    });
  }

  assignStaffSelect(event) {
    let data = event.value;
    if (data !== "" && this.select_staff !== "") {
      this.staff_selected = true;
    }
  }

  clearAssignStaff() {
    this.staff_selected = false;
    this.select_staff = "";
  }

  timeSlots: any[] = [
    {
      viewValue: "8:30 AM - 9:30 AM",
      value: 8,
    },
    {
      viewValue: "9:30 AM - 10:30 AM",
      value: 9,
    },
    {
      viewValue: "10:30 AM - 11:30 AM",
      value: 10,
    },
    {
      viewValue: "11:30 AM - 12:30 PM",
      value: 11,
    },
    {
      viewValue: "1:30 PM - 2:30 PM",
      value: 13,
    },
    {
      viewValue: "2:30 PM - 3:30 PM",
      value: 14,
    },
    {
      viewValue: "3:30 PM - 4:30 PM",
      value: 15,
    },
    {
      viewValue: "4:30 PM - 5:30 PM",
      value: 16,
    },
    {
      viewValue: "5:30 PM - 6:30 PM",
      value: 17,
    },
    {
      viewValue: "6:30 PM - 7:30 PM",
      value: 18,
    },
    {
      viewValue: "7:30 PM - 8:30 PM",
      value: 19,
    },
  ];

  timeSlotSelectedValues: any[] = [];

  getDateTime() {
    this.timeSlotSelectedValues = [];
    let today = new Date().toLocaleDateString("en-US");
    let selected_date = this.assign_date.toLocaleDateString("en-US");

    if (this.staff_selected) {
      if (today === selected_date) {
        var timeStart = new Date().getHours();

        this.timeSlots.forEach((time) => {
          if (timeStart < time.value) {
            this.timeSlotSelectedValues.push(time.viewValue);
          }
        });
      } else {
        this.timeSlots.forEach((time) => {
          this.timeSlotSelectedValues.push(time.viewValue);
        });
      }

      this.date_select = true;
    }
  }

  assignValue(data: string) {
    this.selected_time = data;
    return data;
  }

  assignStaff() {
    if (this.selected_time !== "" && this.select_staff !== "") {
      this.staff_assigned = true;
      let format = new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }).format(this.assign_date);
      let selected_date = this.assign_date.toLocaleDateString("en-US");

      let data = {
        id: this.all_data.main_request_id,
        name: this.select_staff,
        date: format,
        time: this.selected_time,
      };

      this.appAdminService
        .assignStaff(JSON.stringify(data))
        .subscribe((value: any) => {
          console.log(value);
          this.maintenance_staff = value.data;
        });

      this.reassign = false;
    }
  }

  reassignStaff() {
    this.reassign = true;
  }

  assignColor(data: string) {
    switch (data) {
      case "cancelled":
        return "red";
        break;
      case "rejected":
        return "red";
        break;
      case "open":
        return "#029fad";
        break;
      case "reopen":
        return "#029fad";
        break;
      case "reassigned":
        return "#029fad";
        break;
      case "inprogress":
        return "#c3660b";
        break;
      case "complete":
        return "green";
        break;
      default:
        return "#2b333e";
    }
  }
}
