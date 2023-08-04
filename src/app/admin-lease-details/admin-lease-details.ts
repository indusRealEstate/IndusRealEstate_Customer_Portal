import {
  Component,
  HostListener,
  OnChanges,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";

@Component({
  selector: "admin-lease-details",
  templateUrl: "./admin-lease-details.html",
  styleUrls: ["./admin-lease-details.scss"],
})
export class AdminLeaseDetail implements OnInit {
  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;
  all_data: object | any;
  contract_id: string;
  property_images: string[] = [];
  prop_doc: string[] = [];
  lease_doc: string[] = [];
  selectDoc: string = "";
  isSelect: boolean = false;

  activatedRoute: any;
  screenHeight: number;
  screenWidth: number;
  amenities: string[] = [];

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private adminService: AdminService,
    private dialog: MatDialog // private viewImage: ViewImageOfUnit,
  ) {
    this.isContentLoading = true;

    this.route.queryParams.subscribe((param) => {
      this.contract_id = param.contact_id;
    });

    this.getScreenSize();
  }

  async ngOnInit() {
    this.adminService
      .getAllLeaseData({ id: this.contract_id })
      .subscribe((value) => {
        this.isContentLoading = true;
        this.all_data = value;
        console.log(this.all_data);

        for (let i = 0; i < JSON.parse(this.all_data.lease_docs).length; i++) {
          this.lease_doc.push(JSON.parse(this.all_data.lease_docs)[i]);
        }
        for (
          let i = 0;
          i < JSON.parse(this.all_data.unit_amenties).length;
          i++
        ) {
          this.amenities.push(JSON.parse(this.all_data.unit_amenties)[i]);
        }
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
    if (this.selectDoc != "") {
      window.open(
        `https://www.indusre.app/api/upload/contract/${this.all_data.lease_contract_id}/documents/${this.selectDoc}`
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

  // ngAfterViewInit() {
  //   if (this.ngAfterViewInitInitialize == true) {
  //     if (this.allPropertiesMatTableData != undefined) {
  //       this.allPropertiesMatTableData.paginator = this.paginator;
  //       this.allPropertiesMatTableData.paginator._changePageSize(10);
  //     }
  //   } else {
  //     setTimeout(() => {
  //       if (this.allPropertiesMatTableData != undefined) {
  //         this.allPropertiesMatTableData.paginator = this.paginator;
  //         this.allPropertiesMatTableData.paginator._changePageSize(10);
  //       }
  //     });
  //   }
  // }

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

  navigateToUnit(unit) {
    this.router.navigate(["/admin-property-unit-details"], {
      queryParams: { unit_id: unit },
    });
  }
}
