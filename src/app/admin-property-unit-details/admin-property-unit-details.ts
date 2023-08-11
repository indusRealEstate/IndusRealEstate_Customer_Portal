import {
  Component,
  HostListener,
  OnChanges,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { AddLeaseDialog } from "app/components/add_lease_dialog/add_lease_dialog";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";

@Component({
  selector: "admin-property-unit-details",
  templateUrl: "./admin-property-unit-details.html",
  styleUrls: ["./admin-property-unit-details.scss"],
})
export class AdminPropertiesUnitDetails implements OnInit, OnChanges {
  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;
  all_data: object | any;
  unit_id: string;
  image_array: string[] = [];
  address: string;
  allocated_unit: Number;
  amenities: string[] = [];
  view_lease: boolean = false;
  view_list: boolean = false;
  isOcupied: boolean = false;
  property_images: string[] = [];
  prop_doc: string[] = [];

  lease_doc: string[] = [];

  activatedRoute: any;
  selected_document: any = "";

  screenHeight: number;
  screenWidth: number;

  @ViewChild("selecte_doc") selecte_doc;
  profile_image: string;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private adminService: AdminService,
    private dialog: MatDialog // private viewImage: ViewImageOfUnit,
  ) {
    // this.isLoading = true;
    this.isContentLoading = true;

    this.route.queryParams.subscribe((param) => {
      this.unit_id = param.unit_id;
    });

    this.getScreenSize();
  }

  ngOnChanges() {}

  async ngOnInit() {
    this.adminService
      .getUnitAllData({ id: this.unit_id })
      .subscribe((value) => {
        this.all_data = value;

        if (this.all_data.unit_status.toUpperCase() == "OCCUPIED") {
          this.isOcupied = true;
        } else {
          this.isOcupied = false;
        }

        // console.log(value);
        console.log(this.all_data);

        this.address = this.all_data.prop_address;
        this.allocated_unit = this.all_data.user_allocates_unit;

        for (let i = 0; i < JSON.parse(this.all_data.unit_images).length; i++) {
          this.image_array.push(JSON.parse(this.all_data.unit_images)[i]);
        }

        for (let i = 0; i < JSON.parse(this.all_data.prop_images).length; i++) {
          this.property_images.push(JSON.parse(this.all_data.prop_images)[i]);
        }

        for (let i = 0; i < JSON.parse(this.all_data.prop_doc).length; i++) {
          this.prop_doc.push(JSON.parse(this.all_data.prop_doc)[i]);
        }

        for (
          let i = 0;
          i < JSON.parse(this.all_data.unit_amenties).length;
          i++
        ) {
          this.amenities.push(JSON.parse(this.all_data.unit_amenties)[i]);
        }

        // this.profile_image = this.all_data.user_profile_img !== '' ? `https://www.indusre.app/api/upload/user/${this.all_data.user_uid}/image/${this.all_data.user_profile_img}` : 'assets/img/images/user.png';

        if (this.all_data.lease_documents !== undefined) {
          for (
            let i = 0;
            i < JSON.parse(this.all_data.lease_documents).length;
            i++
          ) {
            this.lease_doc.push(JSON.parse(this.all_data.lease_documents)[i]);
          }
        }

        // Unit carousel
        $(document).ready(() => {
          // console.log('hello');
          let carousel = document.getElementById("carousel");
          let indicator = document.getElementById("indicator");

          for (let i = 0; i < this.image_array.length; i++) {
            if (i == 0) {
              let carouselDiv = document.createElement("div");
              let indicatorDiv = document.createElement("li");
              carouselDiv.classList.add("carousel-item");
              carouselDiv.classList.add("active");
              indicatorDiv.classList.add("active");
              indicatorDiv.setAttribute(
                "data-target",
                "#carouselExampleIndicators"
              );
              indicatorDiv.setAttribute("data-slide-to", `${i}`);
              indicatorDiv.setAttribute(
                "data-target",
                "#carouselExampleIndicators"
              );
              carousel.append(carouselDiv);
              indicator.append(indicatorDiv);

              let imgElmnt = document.createElement("img");
              imgElmnt.classList.add("d-flex");
              imgElmnt.classList.add("carousel-img");
              imgElmnt.classList.add("w-100");
              imgElmnt.style.height = "50vh";
              imgElmnt.style.objectFit = "cover";
              imgElmnt.style.objectPosition = "bottom";
              imgElmnt.style.cursor = "pointer";
              imgElmnt.src = `https://www.indusre.app/api/upload/unit/${this.all_data.unit_id}/images/${this.image_array[i]}`;
              imgElmnt.addEventListener("click", () => {
                this.viewImageOfUnit(
                  `https://www.indusre.app/api/upload/unit/${this.all_data.unit_id}/images/${this.image_array[i]}`
                );
              });
              carouselDiv.append(imgElmnt);
            } else {
              let carouselDiv = document.createElement("div");
              let indicatorDiv = document.createElement("li");
              carouselDiv.classList.add("carousel-item");
              indicatorDiv.setAttribute(
                "data-target",
                "#carouselExampleIndicators"
              );
              indicatorDiv.setAttribute("data-slide-to", `${i}`);
              indicatorDiv.setAttribute(
                "data-target",
                "#carouselExampleIndicators"
              );
              carousel.append(carouselDiv);
              indicator.append(indicatorDiv);

              let imgElmnt = document.createElement("img");
              imgElmnt.classList.add("d-block");
              imgElmnt.classList.add("w-100");
              imgElmnt.classList.add("carousel-img");
              imgElmnt.style.height = "50vh";
              imgElmnt.style.objectFit = "cover";
              imgElmnt.style.objectPosition = "bottom";
              imgElmnt.style.cursor = "pointer";
              imgElmnt.src = `https://www.indusre.app/api/upload/unit/${this.all_data.unit_id}/images/${this.image_array[i]}`;
              imgElmnt.addEventListener("click", () => {
                this.viewImageOfUnit(
                  `https://www.indusre.app/api/upload/unit/${this.all_data.unit_id}/images/${this.image_array[i]}`
                );
              });
              carouselDiv.append(imgElmnt);
            }
          }
        });
      })
      .add(() => {
        this.isContentLoading = false;
      });
  }

  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  openProperty() {
    this.router.navigate(["/property-details"], {
      queryParams: {
        prop_id: this.all_data.prop_uid,
      },
    });
  }

  downloadDoc() {
    if (this.selected_document != "") {
      window.open(
        `https://www.indusre.app/api/upload/contract/${this.all_data.lease_uid}/documents/${this.selected_document}`
      );
    }
  }

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
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

  call_tenant_person() {
    location.href = `tell:${
      this.all_data.tenant_country_code_number +
      this.all_data.tenant_mobile_number
    }`;
  }
  email_tenant_person() {
    location.href =
      "mailto:" +
      this.all_data.tenant_email +
      "?cc=" +
      "sample@sdsd.ae" +
      "&subject=" +
      "test" +
      "&body=" +
      "hi";
  }

  viewMorelease() {
    if (this.view_lease == true) {
      this.view_lease = false;
    } else {
      this.view_lease = true;
    }
  }

  addLeaseDialogOpen() {
    this.dialog
      .open(AddLeaseDialog, {
        width: "80%",
        height: "50rem",
        data: {
          prop_id: this.all_data.prop_uid,
          unit_id: this.all_data.unit_id,
        },
      })
      .afterClosed()
      .subscribe((res) => {});
  }

  openEditUnit(data: object){
    // this.dialog.open(EditUnitDialog,{
    //   data
    // })
  }
}
