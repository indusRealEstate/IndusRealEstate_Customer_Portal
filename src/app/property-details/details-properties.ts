import { HttpClient } from "@angular/common/http";
import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { EditPropertyDialog } from "app/components/edit_property_dialog/edit_property_dialog";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";

@Component({
  selector: "property-details",
  templateUrl: "./details-properties.html",
  styleUrls: ["./details-properties.scss"],
})
export class DetailsComponents implements OnInit {
  isUserSignedIn: boolean = false;
  prop_id: string;
  all_data: object | any;
  image_array: string[] = [];
  images: string;
  documents: string;
  doc_array: string[] = [];
  d1: string;
  blob: Blob;
  isContentLoading: boolean = false;
  property_images: string[] = [];
  prop_doc: string[] = [];
  amenities: string[] = [];
  lease_doc: string[] = [];
  view_list: boolean = false;
  all_units: object[] = [];

  @ViewChild("carousel") carousel;
  @ViewChild("indicator") indicator;

  selected_document: any = "";
  //downloadService: any;
  // property_name:string;

  sidebar_opened: boolean = false;

  constructor(
    private router: Router,
    private appAdminService: AdminService,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private otherServices: OtherServices,
    public http: HttpClient,
    public dialog: MatDialog
  ) {
    this.getScreenSize();
    this.isContentLoading = true;
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.route.queryParams
      .subscribe((val) => {
        this.prop_id = val.prop_id;
      })
      .add(() => {
        this.isContentLoading = false;
      });

    this.otherServices.miniSideBarClicked.subscribe((val) => {
      this.sidebar_opened = val;
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
    this.allData();
  }

  allData() {
    let data = {
      prop_id: this.prop_id,
    };
    this.appAdminService
      .getPropDetails(JSON.stringify(data))
      .subscribe((value) => {
        console.log(value);
        this.all_data = value;

        this.getDoc(this.all_data.prop_doc);

        this.createCarousel(this.all_data.prop_images);
      })
      .add(() => {
        this.isContentLoading = false;
      });
  }

  private getDoc(data: string) {
    this.prop_doc = [];
    for (let i = 0; i < JSON.parse(data).length; i++) {
      this.prop_doc.push(JSON.parse(data)[i]);
    }
  }

  private createCarousel(data: string) {
    let image_array: string[] = [];

    for (let i = 0; i < JSON.parse(data).length; i++) {
      image_array.push(JSON.parse(data)[i]);
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

      // list.removeChild(list.firstElementChild)

      for (let i = 0; i < image_array.length; i++) {
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
          imgElmnt.src = `https://www.indusre.app/api/upload/property/${this.all_data.prop_uid}/images/${image_array[i]}`;
          imgElmnt.addEventListener("click", () => {
            this.viewImageOfUnit(
              `https://www.indusre.app/api/upload/property/${this.all_data.prop_uid}/images/${image_array[i]}`
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
          imgElmnt.src = `https://indusre.app/api/upload/property/${this.all_data.prop_uid}/images/${image_array[i]}`;
          imgElmnt.addEventListener("click", () => {
            this.viewImageOfUnit(
              `https://indusre.app/api/upload/property/${this.all_data.prop_uid}/images/${image_array[i]}`
            );
          });
          carouselDiv.append(imgElmnt);
        }
      }
    });
  }

  navigateToDetailPage(unit) {
    this.router.navigate(["/admin-property-unit-details"], {
      queryParams: { unit_id: unit },
    });
  }

  openEditProperty(data: string) {
    this.dialog
      .open(EditPropertyDialog, {
        data,
      })
      .afterClosed()
      .subscribe((value) => {
        this.all_data.prop_name =
          value.property_name != undefined
            ? value.property_name
            : this.all_data.prop_name;
        this.all_data.prop_address =
          value.property_address != undefined
            ? value.property_address
            : this.all_data.prop_address;
        this.all_data.prop_description =
          value.property_description != undefined
            ? value.property_description
            : this.all_data.prop_description;
        this.all_data.prop_gov_id =
          value.property_gov_id != undefined
            ? value.property_gov_id
            : this.all_data.prop_gov_id;
        this.all_data.prop_in_charge =
          value.property_in_charge != undefined
            ? value.property_in_charge
            : this.all_data.prop_in_charge;
        this.all_data.prop_locality_name =
          value.property_locality != undefined
            ? value.property_locality
            : this.all_data.prop_locality_name;
        this.all_data.prop_no_of_units =
          value.property_no_of_units != undefined
            ? value.property_no_of_units
            : this.all_data.prop_no_of_units;

        this.all_data.prop_doc =
          value.property_uploaded_doc != undefined
            ? JSON.stringify(value.property_uploaded_doc)
            : this.all_data.prop_doc;
        this.all_data.prop_images =
          value.property_uploaded_images != undefined
            ? JSON.stringify(value.property_uploaded_images)
            : this.all_data.prop_images;

        this.createCarousel(this.all_data.prop_images);
        this.getDoc(this.all_data.prop_doc);

        console.log(value);
      });
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

  downloadDoc() {
    // let data = {
    //   "contract_id": this.all_data.lease_uid,
    //   "file":doc
    // }
    if (this.selected_document != "") {
      window.open(
        `https://www.indusre.app/api/upload/property/${this.all_data.prop_uid}/documents/${this.selected_document}`
      );
    }

    // this.adminService.downoadLeaseDoc(data).subscribe((val)=>{
    //   console.log(val);
    // })
  }
}
