import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "app/services/authentication.service";
import { AdminService } from "app/services/admin.service";
import { DownloadService } from "app/services/download.service";
import { HttpClient } from "@angular/common/http";

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
      this.prop_id = val.prop_id;
    }).add(()=>{
      this.isContentLoading = false;
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
      prop_id: this.prop_id,
    };
    this.appAdminService
      .getPropDetails(JSON.stringify(data))
      .subscribe((value) => {
        console.log(value);
        this.all_data = value;

        for (let i = 0; i < JSON.parse(this.all_data.prop_images).length; i++) {
          this.image_array.push(JSON.parse(this.all_data.prop_images)[i]);
        }

        const newLocal = this;
        for (
          let i = 0;
          i < JSON.parse(newLocal.all_data.prop_doc).length;
          i++
        ) {
          this.prop_doc.push(JSON.parse(this.all_data.prop_doc)[i]);
        }

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
              imgElmnt.src = `https://www.indusre.app/api/upload/property/${this.all_data.prop_uid}/images/${this.image_array[i]}`;
              imgElmnt.addEventListener("click", () => {
                this.viewImageOfUnit(
                  `https://www.indusre.app/api/upload/property/${this.all_data.prop_uid}/images/${this.image_array[i]}`
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
              imgElmnt.src = `https://www.indusre.app/api/upload/property/${this.all_data.prop_uid}/images/${this.image_array[i]}`;
              imgElmnt.addEventListener("click", () => {
                this.viewImageOfUnit(
                  `https://www.indusre.app/api/upload/property/${this.all_data.prop_uid}/images/${this.image_array[i]}`
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
  selecteFunction(event) {
    if (this.view_list == true) {
      this.view_list = false;
    } else {
      this.view_list = true;
    }
  }

  downloadDoc() {
    let doc = $("#selecte_doc").val();
    // let data = {
    //   "contract_id": this.all_data.lease_uid,
    //   "file":doc
    // }
    window.open(
      `https://www.indusre.app/api/upload/property/${this.all_data.prop_uid}/documents/${doc}`
    );
    // this.adminService.downoadLeaseDoc(data).subscribe((val)=>{
    //   console.log(val);
    // })
  }
}
