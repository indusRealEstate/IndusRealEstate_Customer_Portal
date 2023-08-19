import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { AddLeaseDialog } from "app/components/add_lease_dialog/add_lease_dialog";
import { EditUnitDialog } from "app/components/edit_unit_dialog/edit_unit_dialog";
import { RelatedRequestsDialog } from "app/components/related-requests/related-requests";
import { ViewPaymentDetailsMoreDialog } from "app/components/view-payment-details-more-dialog/view-payment-details-more-dialog";
import { ViewAllUnitDocuments } from "app/components/view_all_unit_documents/view_all_unit_documents";
import { ViewAllUnitInventories } from "app/components/view_all_unit_inventories/view_all_unit_inventories";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";

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

  ngAfterViewInitInitialize: boolean = false;

  lease_doc: string[] = [];

  activatedRoute: any;
  selected_document: any = "";

  screenHeight: number;
  screenWidth: number;

  first_selected_timeline: any;
  last_selected_timeline: any;

  is_data_loaded: boolean = false;

  all_payments_data: MatTableDataSource<any>;

  @Output() closeFlaggedReqs = new EventEmitter<string>();
  @Output() timeLineFilter = new EventEmitter<string>();
  @Output() closeTimeLineFilterEmitter = new EventEmitter<string>();
  // @Output() statusFilterEmitter = new EventEmitter<string>();
  @Output() closeStatusFilterEmitter = new EventEmitter<string>();
  @Output() refresh = new EventEmitter<string>();

  @ViewChild("paginator_payments") paginator: MatPaginator;

  displayedColumns: string[] = [
    "name",
    "date",
    "method",
    "purpose",
    "stauts",
    "more",
  ];

  flaggedRequestsFilterOn: boolean = false;
  timeLineFilterOn: boolean = false;
  statusFilterOn: boolean = false;
  timeLineFilterDateNotSelected: boolean = false;
  timeLineFilterselectedWrong: boolean = false;
  statusFilter: any;

  @ViewChild("selecte_doc") selecte_doc;
  profile_image: string;

  sidebar_opened: boolean = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private adminService: AdminService,
    private otherServices: OtherServices,
    private dialog: MatDialog // private viewImage: ViewImageOfUnit,
  ) {
    // this.isLoading = true;
    this.isContentLoading = true;

    this.route.queryParams.subscribe((param) => {
      this.unit_id = param.unit_id;
    });

    this.getScreenSize();

    this.otherServices.miniSideBarClicked.subscribe((val) => {
      this.sidebar_opened = val;
    });
  }

  ngOnChanges() {}

  async ngOnInit() {
    this.adminService
      .getUnitAllData({ id: this.unit_id })
      .subscribe((value: any) => {
        this.all_data = value;
        this.all_payments_data = new MatTableDataSource<any>(
          value.tenant_payments
        );

        setTimeout(() => {
          if (this.all_payments_data != undefined) {
            this.all_payments_data.paginator = this.paginator;
          } else {
            setTimeout(() => {
              this.all_payments_data.paginator = this.paginator;
            }, 3000);
          }
        });

        // if(this.all_payments_data != undefined){
        //   this.all_payments_data.paginator = this.paginator;
        // }

        this.is_data_loaded = true;
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

  ngAfterViewInit() {}

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
      .subscribe((res) => {
        if (res != undefined) {
          if (res.completed == true) {
            sessionStorage.removeItem("all_lease_session");
            sessionStorage.removeItem("admin_properties_units_session");
          }
        }
      });
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
          id: this.all_data.unit_id,
        },
      })
      .afterClosed()
      .subscribe((value) => {
        console.log(value);
      });
  }

  showInventories() {
    this.dialog.open(RelatedRequestsDialog, {
      height: '50rem',
      width : '60%',
      data: {
        id: this.all_data.unit_id,
        inventories: this.all_data.inventories,
      },
    });
  }

  filterByTimeline(trigger: MatMenuTrigger) {
    console.log(this.first_selected_timeline);
    if (this.first_selected_timeline && this.last_selected_timeline) {
      var first = new Date(this.first_selected_timeline).getTime();
      var last = new Date(this.last_selected_timeline).getTime();
      if (last < first) {
        this.timeLineFilterselectedWrong = true;

        setTimeout(() => {
          this.timeLineFilterselectedWrong = false;
        }, 3000);
      } else {
        // console.log(this.all_data.tenant_payments[0].date)
        this.all_payments_data.data = this.all_data.tenant_payments.filter(
          (pay: any) =>
            new Date(pay.tp_date).getTime() >= first &&
            new Date(pay.tp_date).getTime() <= last
        );
        trigger.closeMenu();
        this.timeLineFilterOn = true;
      }
    } else {
      this.timeLineFilterDateNotSelected = true;

      setTimeout(() => {
        this.timeLineFilterDateNotSelected = false;
      }, 3000);
    }
  }

  private selectTenantDetails(data: string) {
    this.adminService.selectTenantPayments(data).subscribe((value) => {
      this.all_data.tenant_payments = value;
      this.is_data_loaded = true;
    });
  }

  refreshTable() {
    this.is_data_loaded = false;

    if (!this.is_data_loaded) {
      // LoadingTableUnitPaymentTenant
    }
    let data = {
      id: this.unit_id,
    };
    this.selectTenantDetails(JSON.stringify(data));

    let btn = document.getElementById("refresh_btn");
    btn.style.transform = "rotate(360deg)";
    btn.style.transition = "1s ease all";
    setTimeout(() => {
      btn.style.transition = "0s ease all";
      btn.style.transform = "rotate(0deg)";
    }, 2000);
  }

  moreDetails(id: string, method: string) {
    this.dialog.open(ViewPaymentDetailsMoreDialog, {
      data: {
        id: id,
        method: method,
      },
    });
  }
}
