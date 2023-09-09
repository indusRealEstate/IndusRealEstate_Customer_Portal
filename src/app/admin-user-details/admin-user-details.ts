import { HttpClient } from "@angular/common/http";
import { Component, HostListener, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { EditUserDialog } from "app/components/edit_user_dialog/edit_user_dialog";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";
import { DownloadService } from "app/services/download.service";
import { UserService } from "app/services/user.service";
import * as FileSaver from "file-saver";

@Component({
  selector: "admin-user-details",
  templateUrl: "./admin-user-details.html",
  styleUrls: ["./admin-user-details.scss"],
})
export class ViewUserDetails implements OnInit {
  isUserSignedIn: boolean = false;
  user_id: string;
  user_auth: string;
  all_data: object | any;
  image_array: string[] = [];
  images: string;
  documents: string;
  doc_array: string[] = [];
  d1: string;
  blob: Blob;
  isContentLoading: boolean = false;
  property_images: string[] = [];
  user_doc: string[] = [];
  amenities: string[] = [];
  lease_doc: string[] = [];
  view_list: boolean = false;
  all_units: object[] = [];
  isOwner: boolean = false;
  profile_image: string;
  is_object: boolean = false;
  //downloadService: any;
  // property_name:string;

  is_user_image_loading: boolean = true;

  constructor(
    private router: Router,
    private userService: UserService,
    private downloadService: DownloadService,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    public http: HttpClient
  ) {
    this.getScreenSize();

    this.isContentLoading = true;

    this.route.queryParams.subscribe((val) => {
      this.user_id = val.user_id;
      this.user_auth = val.auth;
    });
  }

  screenHeight: number;
  screenWidth: number;
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      verticalPosition: "top",
      horizontalPosition: "right",
      duration: 3000,
    });
  }

  finishLoadingImage() {
    this.is_user_image_loading = false;
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

  getUserType(userType) {
    if (userType == "new_user") {
      return "New User";
    } else if (userType == "owner") {
      return "Landlord";
    } else {
      return "Tenant";
    }
  }

  openEditUser() {
    this.dialog
      .open(EditUserDialog, {
        data: this.all_data,
        width: "75%",
        height: "50rem",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res != undefined) {
          this.updateData(res);
        }
      });
  }

  updateData(data) {
    if (data.data != undefined) {
      var updated_data = data.data;
      this.all_data.user_profile_img = updated_data.profile_img;
      this.all_data.user_nationality = updated_data.nationality;
      this.all_data.user_name = updated_data.name;
      this.all_data.user_mobile_number = updated_data.mobile_number;
      this.all_data.user_id_type = updated_data.id_type;
      this.all_data.user_id_number = updated_data.id_number;
      this.all_data.user_gender = updated_data.gender;
      this.all_data.user_email = updated_data.email;
      this.all_data.user_documents = updated_data.documents;
      this.all_data.user_dob = updated_data.dob;
      this.all_data.user_country_code_number = updated_data.country_code_number;
      this.all_data.user_country_code_alternative_number =
        updated_data.country_code_alternative_number;
      this.all_data.user_alternative_mobile_number =
        updated_data.alternative_mobile_number;
      this.all_data.user_alternative_email = updated_data.alternative_email;

      this.user_doc.length = 0;

      JSON.parse(updated_data.documents).forEach((doc) => {
        this.user_doc.push(doc);
      });

      this.profile_image = `https://www.indusre.app/api/upload/user/${this.all_data.user_uid}/image/${updated_data.profile_img}`;
    }
    this.openSnackBar("User updated successfully", "Close");
  }

  getPropertyAddress(prop_id) {
    var property = this.all_data.property.find(
      (prop) => prop.prop_uid == prop_id
    );

    return `${property.prop_name}, ${property.prop_address}`;
  }

  async ngOnInit() {
    let data = {
      user_id: this.user_id,
      auth: this.user_auth,
    };
    this.userService
      .getAllUserDetails(JSON.stringify(data))
      .subscribe((value) => {
        // console.log(value);
        this.all_data = value;
        if (this.all_data.user_allocates_unit != undefined) {
          if (this.all_data.user_type == "owner") {
            this.is_object = false;
          } else {
            this.is_object = true;
          }
        }

        for (
          let i = 0;
          i < JSON.parse(this.all_data.user_documents).length;
          i++
        ) {
          this.user_doc.push(JSON.parse(this.all_data.user_documents)[i]);
        }

        this.profile_image =
          this.all_data.user_profile_img !== ""
            ? `https://www.indusre.app/api/upload/user/${this.all_data.user_uid}/image/${this.all_data.user_profile_img}`
            : "assets/img/images/user.png";
      })
      .add(() => {
        this.isContentLoading = false;
      });
  }

  // navigateToDetailPage(data: any) {
  //   // console.log(`https://www.indusre.app/api/upload/user/${this.all_data.user_uid}/documents/${data}`);
  //   window.open(
  //     `https://www.indusre.app/api/upload/user/${this.all_data.user_uid}/documents/${data}`
  //   );
  // }

  viewImageOfUnit() {
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
    image.setAttribute(
      "src",
      `https://www.indusre.app/api/upload/user/${this.all_data.user_uid}/image/${this.all_data.user_profile_img}`
    );
    image.style.width = "75vw";
    image.style.height = "75vh";
    image.style.objectFit = "contain";
    image.style.objectPosition = "top";
    image.style.margin = "auto";
  }

  onCloseDialog() {
    let constainer = document.getElementById("full-screen-image");
    constainer.style.display = "none";
  }

  call_person() {
    location.href = `tell:${
      this.all_data.user_country_code_number + this.all_data.user_mobile_number
    }`;
  }
  email_person() {
    location.href =
      "mailto:" +
      this.all_data.user_email +
      "?cc=" +
      "sample@sdsd.ae" +
      "&subject=" +
      "test" +
      "&body=" +
      "hi";
  }

  downloadDoc(item) {
    this.downloadService
      .downloadFile(
        `https://www.indusre.app/api/upload/user/${this.all_data.user_uid}/documents/${item}`
      )
      .subscribe((res: Blob) => {
        FileSaver.saveAs(res, item);
      });
  }

  navigateToProprety(data: any) {
    this.router.navigate(["/property-details"], {
      queryParams: {
        prop_id: data,
      },
    });
  }

  navigateToUnit(data: any) {
    this.router.navigate(["/property-unit-details"], {
      queryParams: { unit_id: data },
    });
  }
}
