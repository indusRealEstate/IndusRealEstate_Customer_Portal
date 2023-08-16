import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "app/services/authentication.service";
import { AdminService } from "app/services/admin.service";
import { DownloadService } from "app/services/download.service";
import { HttpClient } from "@angular/common/http";

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
  unit_array: object[] = []
  //downloadService: any;
  // property_name:string;

  constructor(
    private router: Router,
    private appAdminService: AdminService,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private appdownloadService: DownloadService,
    public http: HttpClient
  ) {
    this.getScreenSize();

    this.isContentLoading = true;

    var userData = localStorage.getItem("currentUser");

    var user = JSON.parse(userData);

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
    this.appAdminService
      .getAllUserDetails(JSON.stringify(data))
      .subscribe((value) => {
        console.log(value);
        this.all_data = value;
        this.isOwner =
          this.all_data.user_type.toLowerCase() == "owner" ? true : false;
        // user_doc

        // for(let item of this.all_data.user_allocates_unit){

        // }

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
    window.open(
      `https://indusre.app/api/upload/user/${this.all_data.user_uid}/documents/${item}`
    );
  }

  openProperty() {
    if (this.isOwner) {
      this.opropertyURL();
    } else {
      if (this.all_data.unit !== "none") {
        this.unitURL(this.all_data.unit.unit_id);
      }
    }
  }

  opropertyURL() {
    this.router.navigate(["/property-details"], {
      queryParams: {
        prop_id: this.all_data.user_prop_id,
      },
    });
  }

  unitURL(data: any) {
    this.router.navigate(["/admin-property-unit-details"], {
      queryParams: { unit_id: data },
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
    this.router.navigate(["/admin-property-unit-details"], {
      queryParams: { unit_id: data },
    });
  }
}
