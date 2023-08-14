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
import { EditUnitDialog } from "app/components/edit_unit_dialog/edit_unit_dialog";
import { ViewAllUnitDocuments } from "app/components/view_all_unit_documents/view_all_unit_documents";
import { ViewAllUnitInventories } from "app/components/view_all_unit_inventories/view_all_unit_inventories";
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
  unit_doc: string[] = [];
  // inventories:

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

        console.log(this.all_data);

        this.address = this.all_data.prop_address;
        this.allocated_unit = this.all_data.user_allocates_unit;

        this.createCarousel(this.all_data.unit_images);

        for (let i = 0; i < JSON.parse(this.all_data.prop_doc).length; i++) {
          this.prop_doc.push(JSON.parse(this.all_data.prop_doc)[i]);
        }

        this.unitDoc(this.all_data.unit_doc);

        this.amenties(this.all_data.unit_amenties);

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
      })
      .add(() => {
        this.isContentLoading = false;
      });
  }

  unitDoc(data: string) {
    this.unit_doc = [];
    for (let i = 0; i < JSON.parse(data).length; i++) {
      this.unit_doc.push(JSON.parse(data)[i]);
    }
  }

  amenties(data: string) {
    this.amenities = [];
    for (let i = 0; i < JSON.parse(data).length; i++) {
      this.amenities.push(JSON.parse(data)[i]);
    }
  }

  createCarousel(data: string) {
    this.image_array = [];

    for (let i = 0; i < JSON.parse(data).length; i++) {
      this.image_array.push(JSON.parse(data)[i]);
    }
    $(document).ready(() => {
      // console.log('hello');
      let carousel = document.getElementById("carousel");
      let indicator = document.getElementById("indicator");

      if (carousel.firstElementChild !== null) {
        while (carousel.firstElementChild) {
          carousel.removeChild(carousel.firstElementChild);
        }
      }

      if (indicator.firstElementChild !== null) {
        while (indicator.firstElementChild) {
          indicator.removeChild(indicator.firstElementChild);
        }
      }

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

  openEditUnit(data: object) {
    this.dialog
      .open(EditUnitDialog, {
        data,
      })
      .afterClosed()
      .subscribe((data) => {
        console.log(data);
        this.all_data.unit_amenties =
          data.amenties != undefined
            ? data.amenties
            : this.all_data.unit_amenties;
        this.all_data.unit_bath =
          data.bathroom != undefined ? data.bathroom : this.all_data.unit_bath;
        this.all_data.unit_bed =
          data.bedroom != undefined ? data.bedroom : this.all_data.unit_bed;
        this.all_data.unit_description =
          data.description != undefined
            ? data.description
            : this.all_data.unit_description;
        this.all_data.unit_doc =
          data.documents != undefined ? data.documents : this.all_data.unit_doc;
        this.all_data.unit_floor =
          data.floor != undefined ? data.floor : this.all_data.unit_floor;
        this.all_data.unit_images =
          data.images != undefined ? data.images : this.all_data.unit_images;
        this.all_data.unit_parking =
          data.no_of_parking != undefined
            ? data.no_of_parking
            : this.all_data.unit_parking;
        this.all_data.unit_owner =
          data.owner != undefined ? data.owner : this.all_data.unit_owner;
        this.all_data.user_name =
          data.owner != undefined ? data.owner : this.all_data.user_name;
        this.all_data.unit_prop_id =
          data.property_id != undefined
            ? data.property_id
            : this.all_data.unit_prop_id;
        this.all_data.unit_size =
          data.size != undefined ? data.size : this.all_data.unit_size;
        this.all_data.unit_status =
          data.status != undefined ? data.status : this.all_data.unit_status;
        this.all_data.tenant_uid =
          data.tenant_id != undefined
            ? data.tenant_id
            : this.all_data.tenant_uid;
        this.all_data.unit_no =
          data.unit_no != undefined ? data.unit_no : this.all_data.unit_no;
        this.all_data.unit_type =
          data.unit_type != undefined
            ? data.unit_type
            : this.all_data.unit_type;
        this.all_data.user_uid =
          data.user_id != undefined ? data.user_id : this.all_data.user_uid;

        this.createCarousel(this.all_data.unit_images);
        this.amenties(this.all_data.unit_amenties);
        this.unitDoc(this.all_data.unit_doc);
      });
  }

  viewAllDocuments() {
    this.dialog
      .open(ViewAllUnitDocuments, {
        data: {
          doc: this.all_data.unit_doc,
          id: this.all_data.unit_id
        }
      })
      .afterClosed()
      .subscribe((value) => {
        console.log(value);
      });
  }

  showInventories(){
    this.dialog.open(ViewAllUnitInventories,{
      data:{
        id: this.all_data.unit_id,
        inventories: this.all_data.inventories
      }
    })
  }
}
