import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { AddPropertyDialog } from "app/components/add_property_dialog/add_property_dialog";
import { EditPropertyDialog } from "app/components/edit_property_dialog/edit_property_dialog";
import { TableFiltersComponent } from "app/components/table-filters/table-filters";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";
import { FirebaseService } from "app/services/firebase.service";
import * as XLSX from "xlsx-js-style";

declare interface Property {
  "PROPERTY NAME": string;
  "PROPERTY ADDRESS": string;
  "PROPERTY TYPE": string;
  LOCALITY: string;
  "TOTAL UNITS": string;
  "PROPERTY IN CHARGE": string;
}

@Component({
  selector: "admin-properties",
  templateUrl: "./admin-properties.html",
  styleUrls: ["./admin-properties.scss"],
})
export class AdminProperties implements OnInit {
  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;

  displayedColumns: string[] = [
    // "name",
    "propertyName",
    "address",
    "propertyType",
    "locality",
    "govPropertyId",
    "more",
  ];

  allProperties: any[] = [];
  allPropertiesMatTableData: MatTableDataSource<any>;
  ngAfterViewInitInitialize: boolean = false;

  loadingTable: any[] = [1, 2, 3, 4, 5];

  statusMenuOpened: boolean = false;
  flaggedRequest: boolean = false;

  more_menu_prop_all_data: any;

  allUnits: any[] = [];

  userId: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild("table_filter") table_filter: TableFiltersComponent;

  pushSub: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private adminService: AdminService,
    private firebaseService: FirebaseService,
    private dialog: MatDialog
  ) {
    // this.isLoading = true;
    this.isContentLoading = true;

    this.getScreenSize();
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    this.userId = user[0]["id"];

    this.route.queryParams.subscribe((e) => {
      if (e == null) {
        router.navigate([`/admin-properties`], {
          queryParams: { uid: user[0]["id"] },
        });
      } else if (e != user[0]["id"]) {
        router.navigate([`/admin-properties`], {
          queryParams: { uid: user[0]["id"] },
        });
      }
    });

    // this.testMessage();
    // navigator.serviceWorker.ready.then(function (swRegistration) {
    //   console.log("service worker ready", swRegistration);
    // });
    // firebaseService.requestMessagePermission();
    // firebaseService.getToken();
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

  ngAfterViewInit() {
    if (this.ngAfterViewInitInitialize == true) {
      if (this.allPropertiesMatTableData != undefined) {
        this.allPropertiesMatTableData.paginator = this.paginator;
      }
    } else {
      setTimeout(() => {
        if (this.allPropertiesMatTableData != undefined) {
          this.allPropertiesMatTableData.paginator = this.paginator;
        }
      });
    }
  }

  fetchData() {
    var adminReqDataSession = JSON.parse(
      sessionStorage.getItem("admin_properties_session")
    );
    if (adminReqDataSession != null) {
      this.allProperties = adminReqDataSession;
      this.allPropertiesMatTableData.data = adminReqDataSession;
      this.isContentLoading = false;
      this.ngAfterViewInitInitialize = true;
    } else {
      this.adminService
        .getallPropertiesAdmin()
        .subscribe((va: any[]) => {
          this.allProperties = va;
          this.allPropertiesMatTableData = new MatTableDataSource(va);
          setTimeout(() => {
            if (this.allPropertiesMatTableData != undefined) {
              this.allPropertiesMatTableData.paginator = this.paginator;
            }
          });
        })
        .add(() => {
          this.isContentLoading = false;
          if (this.allProperties.length != 0) {
            sessionStorage.setItem(
              "admin_properties_session",
              JSON.stringify(this.allProperties)
            );
          }
        });
      sessionStorage.setItem(
        "admin_properties_session_time_admin",
        JSON.stringify(new Date().getMinutes())
      );
    }
  }

  getAllUnits() {
    var unitsDataSession = JSON.parse(
      sessionStorage.getItem("admin_properties_units_session")
    );

    if (unitsDataSession == null) {
      this.adminService.getallPropertiesUnitsAdmin().subscribe((val: any[]) => {
        this.allUnits = val;
      });
    } else {
      this.allUnits = unitsDataSession;
    }
  }

  async ngOnInit() {
    this.getAllUnits();
    var now = new Date().getMinutes();
    var previous = JSON.parse(
      sessionStorage.getItem("admin_properties_session_time_admin")
    );

    var adminReqDataSession = JSON.parse(
      sessionStorage.getItem("admin_properties_session")
    );

    if (previous != null) {
      var diff = now - Number(previous);

      if (diff >= 5) {
        sessionStorage.removeItem("admin_properties_session");
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
    sessionStorage.removeItem("admin_properties_session");
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

  addPropertyDialogOpen() {
    this.dialog
      .open(AddPropertyDialog, {
        width: "75%",
        height: "43rem",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res != undefined) {
          if (res.completed == true) {
            this.refreshTable();
          }
        }
      });
  }

  viewPropInfo(data: any) {
    // console.log(data)
    this.router.navigate(["/property-details"], {
      queryParams: {
        prop_id: data.property_id,
      },
    });
  }

  openMoreMenu(prop_id) {
    this.adminService
      .getPropDetails(JSON.stringify({ prop_id: prop_id }))
      .subscribe((value) => {
        this.more_menu_prop_all_data = value;
      });
  }

  getUnitCount(prop_id) {
    var unit_count = 0;
    this.allUnits.forEach((unit) => {
      if (unit.property_id == prop_id) {
        unit_count++;
      }
    });

    return unit_count;
  }

  openEditProperty(index) {
    if (this.more_menu_prop_all_data != undefined) {
      var data = this.more_menu_prop_all_data;
      this.dialog
        .open(EditPropertyDialog, {
          data,
        })
        .afterClosed()
        .subscribe((value) => {
          sessionStorage.removeItem("admin_properties_session");
          this.allProperties[index].property_name =
            value.property_name != undefined
              ? value.property_name
              : this.allProperties[index].property_name;
          this.allProperties[index].address =
            value.property_address != undefined
              ? value.property_address
              : this.allProperties[index].address;
          this.allProperties[index].property_type =
            value.property_building_type != undefined
              ? value.property_building_type
              : this.allProperties[index].property_type;

          this.allProperties[index].locality_name =
            value.property_locality != undefined
              ? value.property_locality
              : this.allProperties[index].locality_name;
        });
    }
  }

  exportExcelFile() {
    var data: Property[] = [];

    this.allProperties.forEach((prop) => {
      data.push({
        "PROPERTY NAME": prop.property_name,
        "PROPERTY ADDRESS": prop.address,
        "PROPERTY TYPE": prop.property_type,
        LOCALITY: prop.locality_name,
        "TOTAL UNITS": JSON.stringify(this.getUnitCount(prop.property_id)),
        "PROPERTY IN CHARGE": prop.property_in_charge,
      });
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    ws["!cols"] = [
      { wch: 30 },
      { wch: 40 },
      { wch: 30 },
      { wch: 30 },
      { wch: 35 },
      { wch: 40 },
    ];

    ws["!rows"] = [{ hpt: 30 }];

    for (var i in ws) {
      // console.log(ws[i]);
      if (typeof ws[i] != "object") continue;
      let cell = XLSX.utils.decode_cell(i);

      ws[i].s = {
        // styling for all cells
        font: {
          name: "arial",
        },
        alignment: {
          vertical: "center",
          horizontal: "center",
          wrapText: "1", // any truthy value here
        },
        border: {
          right: {
            style: "thin",
            color: "000000",
          },
          left: {
            style: "thin",
            color: "000000",
          },
        },
      };

      if (cell.r == 0) {
        // first row
        ws[i].s = {
          font: {
            name: "Calibri",
            sz: "14",
            bold: true,
          },
          border: {
            bottom: {
              style: "thin",
              color: "000000",
            },
          },
          fill: { fgColor: { rgb: "f8e7b4" } },
          alignment: {
            vertical: "center",
            horizontal: "center",
            wrapText: "1", // any truthy value here
          },
        };
      }

      if (cell.r % 2) {
        // every other row
        ws[i].s.fill = {
          // background color
          patternType: "solid",
          fgColor: { rgb: "fef7e3" },
          bgColor: { rgb: "fef7e3" },
        };
      }
    }

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "Total-Properties.xlsx");
  }
}
