import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { AddUnitDialog } from "app/components/add_unit_dialog/add_unit_dialog";
import { TableFiltersComponent } from "app/components/table-filters/table-filters";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";
import { HttpParams } from "@angular/common/http";

@Component({
  selector: "admin-property-unit-details",
  templateUrl: "./admin-property-unit-details.html",
  styleUrls: ["./admin-property-unit-details.scss"],
})
export class AdminPropertiesUnitDetails implements OnInit {
  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;
  all_data: object | any;
  unit_id: string;
  image_array: string[] = [];
  address: string;
  allocated_unit: Number;
  amenities: string[] = [];

  displayedColumns: string[] = [
    // "name",
    "unitNo",
    "propertyName",
    "floor",
    "size",
    "status",
    "ownerName",
    "bedroom",
    "bathroom",
    "more",
  ];

  allProperties: any[] = [];
  allPropertiesMatTableData: MatTableDataSource<any>;
  ngAfterViewInitInitialize: boolean = false;

  loadingTable: any[] = [1, 2, 3, 4, 5];

  statusMenuOpened: boolean = false;
  flaggedRequest: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  // @ViewChild("carousel") carousel: Element;

  @ViewChild("table_filter") table_filter: TableFiltersComponent;
  activatedRoute: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private adminService: AdminService,
    private dialog: MatDialog
  ) {
    // this.isLoading = true;
    this.isContentLoading = true;

    this.route.queryParams.subscribe((param) => {
      this.unit_id = param.unit_id;
    });

    this.getScreenSize();
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

  fetchData() {
    var adminReqDataSession = JSON.parse(
      sessionStorage.getItem("admin_properties_units_session")
    );
    if (adminReqDataSession != null) {
      this.allProperties = adminReqDataSession;
      this.allPropertiesMatTableData.data = adminReqDataSession;
      this.isContentLoading = false;
      this.ngAfterViewInitInitialize = true;
    } else {
      this.adminService
        .getallPropertiesUnitsAdmin()
        .subscribe((va: any[]) => {
          console.log(va);
          this.allProperties = va;
          this.allPropertiesMatTableData = new MatTableDataSource(va);
          setTimeout(() => {
            if (this.allPropertiesMatTableData != undefined) {
              this.allPropertiesMatTableData.paginator = this.paginator;
              this.allPropertiesMatTableData.paginator.pageSize = 10;
            }
          });
        })
        .add(() => {
          this.isContentLoading = false;
          if (this.allProperties.length != 0) {
            sessionStorage.setItem(
              "admin_properties_units_session",
              JSON.stringify(this.allProperties)
            );
          }
        });
      sessionStorage.setItem(
        "admin_properties_units_session_time_admin",
        JSON.stringify(new Date().getMinutes())
      );
    }
  }

  call_person(){
    location.href = `tell:${this.all_data.user_country_code_number + this.all_data.user_mobile_number}`;
  }
  email_person(){
    location.href = "mailto:"+this.all_data.user_email+'?cc='+'sample@sdsd.ae'+'&subject='+'test'+'&body='+'hi';
  }

  async ngOnInit() {
    this.adminService
      .getUnitAllData({ id: this.unit_id })
      .subscribe((value) => {
        this.all_data = value;
        console.log(this.all_data);

        this.address = this.all_data.address;
        this.allocated_unit = this.all_data.allocated_unit;

        for (let i = 0; i < JSON.parse(this.all_data.unit_images).length; i++) {
          this.image_array.push(JSON.parse(this.all_data.unit_images)[i]);
        }

        for (
          let i = 0;
          i < JSON.parse(this.all_data.unit_amenties).length;
          i++
        ) {
          this.amenities.push(JSON.parse(this.all_data.unit_amenties)[i]);
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
              carousel.append(carouselDiv);
              indicator.append(indicatorDiv);

              let imgElmnt = document.createElement("img");
              imgElmnt.classList.add("d-flex");
              imgElmnt.classList.add("carousel-img");
              imgElmnt.classList.add("w-100");
              imgElmnt.style.height = "50vh";
              imgElmnt.style.objectFit = "cover";
              imgElmnt.style.objectPosition = "bottom";
              imgElmnt.src = `https://www.indusre.app/api/upload/unit/${this.all_data.unit_id}/images/${this.image_array[i]}`;
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

              carousel.append(carouselDiv);
              indicator.append(indicatorDiv);

              let imgElmnt = document.createElement("img");
              imgElmnt.classList.add("d-block");
              imgElmnt.classList.add("w-100");
              imgElmnt.classList.add("carousel-img");
              imgElmnt.style.height = "50vh";
              imgElmnt.style.objectFit = "cover";
              imgElmnt.style.objectPosition = "bottom";
              imgElmnt.src = `https://www.indusre.app/api/upload/unit/${this.all_data.unit_id}/images/${this.image_array[i]}`;
              carouselDiv.append(imgElmnt);
            }
          }
        });
      });

    var now = new Date().getMinutes();
    var previous = JSON.parse(
      sessionStorage.getItem("admin_properties_units_session_time_admin")
    );

    var adminReqDataSession = JSON.parse(
      sessionStorage.getItem("admin_properties_units_session")
    );

    if (previous != null) {
      var diff = now - Number(previous);

      if (diff >= 5) {
        sessionStorage.removeItem("admin_properties_units_session");
        this.fetchData();
      } else {
        if (adminReqDataSession != null) {
          this.allProperties = adminReqDataSession;
          this.allPropertiesMatTableData = new MatTableDataSource(
            adminReqDataSession
          );
          this.isContentLoading = false;
          this.ngAfterViewInitInitialize = true;
        } else {
          this.fetchData();
        }
      }
    } else {
      this.fetchData();
    }
  }

  clearAllVariables() {
    this.allProperties.length = 0;
  }

  refreshTable() {
    sessionStorage.removeItem("admin_properties_units_session");
    this.isContentLoading = true;
    if (this.table_filter != undefined) {
      this.table_filter.flaggedRequestsFilterOn = false;
      this.table_filter.statusFilterOn = false;
      this.table_filter.timeLineFilterOn = false;
    }
    this.fetchData();
  }

  applyFilter(filterValue: any) {
    var val = new String(filterValue).trim().toLowerCase();
    this.allPropertiesMatTableData.filter = val;
  }

  addUnitDialogOpen() {
    this.dialog
      .open(AddUnitDialog, {
        width: "80%",
        height: "50rem",
      })
      .afterClosed()
      .subscribe((res) => {});
  }

  // navigateToDetailPage(unit) {
  //   console.log(unit.unit_id);
  // }
}
