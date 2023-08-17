import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { Router } from "@angular/router";
import {
  RenderEvent,
  SeriesLabelsContentArgs,
  SeriesVisualArgs,
} from "@progress/kendo-angular-charts";
import {
  Element,
  GradientStop,
  Layout,
  LinearGradient,
  Text,
  geometry,
} from "@progress/kendo-drawing";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";

@Component({
  selector: "admin-dashboard",
  templateUrl: "./admin_dashboard.html",
  styleUrls: ["./admin_dashboard.scss"],
})
export class AdminDashboardComponent implements OnInit {
  isUserSignedIn: boolean = false;

  isLoading: boolean = false;

  allProperties: any[] = [];
  allUnits: any[] = [];
  allUsers: any[] = [];
  allContracts: any[] = [];
  allRequests: any[] = [];

  all_vacant_units: number = 0;
  all_occupied_units: number = 0;

  total_contracts_reminders: any[] = [1, 2, 3];
  total_contracts_reminders_source: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.isLoading = true;
    // }

    this.getScreenSize();

    this.total_contracts_reminders_source = this.total_contracts_reminders;
  }

  dashboardMainCards: any[] = [
    {
      title: "Total Landlords",
      icon: "assets/img/pngs/dashboard/landlord.png",
    },
    {
      title: "Total Maintenance Requests",
      icon: "assets/img/pngs/dashboard/maintenance.png",
    },
    {
      title: "Total Units",
      icon: "assets/img/pngs/dashboard/unit.png",
    },
  ];

  dashboardMainCardsPartTwo: any[] = [
    {
      title: "Total Tenants",
      icon: "assets/img/pngs/dashboard/tenant-2.png",
    },
    {
      title: "Total Active Contracts",
      icon: "assets/img/pngs/dashboard/contract.png",
    },
    {
      title: "Total Buildings",
      icon: "assets/img/pngs/dashboard/property.png",
    },
  ];

  screenHeight: number;
  screenWidth: number;

  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  onPaginateChange(event) {
    console.log(event);
  }

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  async getAllData() {
    var propertiesDataSession = JSON.parse(
      sessionStorage.getItem("admin_properties_session")
    );

    if (propertiesDataSession == null) {
      this.adminService.getallPropertiesAdmin().subscribe((val: any[]) => {
        this.allProperties = val;
      });
    } else {
      this.allProperties = propertiesDataSession;
    }

    var unitsDataSession = JSON.parse(
      sessionStorage.getItem("admin_properties_units_session")
    );

    if (unitsDataSession == null) {
      this.adminService.getallPropertiesUnitsAdmin().subscribe((val: any[]) => {
        this.allUnits = val;
        val.forEach((unit) => {
          if (unit.status == "occupied") {
            this.all_occupied_units++;
          } else {
            this.all_vacant_units++;
          }
        });
      });
    } else {
      this.allUnits = unitsDataSession;
      unitsDataSession.forEach((unit) => {
        if (unit.status == "occupied") {
          this.all_occupied_units++;
        } else {
          this.all_vacant_units++;
        }
      });
    }

    var usersDataSession = JSON.parse(
      sessionStorage.getItem("all_users_session")
    );

    if (usersDataSession == null) {
      this.adminService.getAllUsersAdmin().subscribe((val: any[]) => {
        this.allUsers = val;
      });
    } else {
      this.allUsers = usersDataSession;
    }

    var leaseDataSession = JSON.parse(
      sessionStorage.getItem("all_lease_session")
    );

    if (leaseDataSession == null) {
      this.adminService.getAllLeaseAdmin().subscribe((val: any[]) => {
        this.allContracts = val;
      });
    } else {
      this.allContracts = leaseDataSession;
    }

    this.adminService.getAllRequestsAdmin().subscribe((val: any[]) => {
      this.allRequests = val;
    });
  }

  getStatsCount(title) {
    switch (title) {
      case "Total Landlords":
        return this.allUsers.filter((user) => user.user_type == "owner").length;
      case "Total Maintenance Requests":
        return this.allRequests.length;
      case "Total Units":
        return this.allUnits.length;
      case "Total Tenants":
        return this.allUsers.filter((user) => user.user_type == "tenant")
          .length;
      case "Total Active Contracts":
        return this.allContracts.filter((contrct) => contrct.status == "active")
          .length;
      case "Total Buildings":
        return this.allProperties.length;
      default:
        break;
    }
  }

  async ngOnInit() {
    await this.getAllData();
    this.isUserSignOut();
  }

  ngAfterViewInit() {
    this.chart_data = [
      {
        share: `${(this.all_occupied_units / this.allUnits.length) * 100}%`,
        color: "#fac83a",
      },
      {
        share: `${(this.all_vacant_units / this.allUnits.length) * 100}%`,
        color: "#ff5353",
      },
    ];

    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  navigateToTotalProperties() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    var userId = user[0]["id"];
    this.router.navigate(["/admin-properties"], {
      queryParams: { uid: userId },
    });
  }

  navigateToTotalUnits() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    var userId = user[0]["id"];
    this.router.navigate(["/admin-properties-units"], {
      queryParams: { uid: userId },
    });
  }

  getRoundData(num: number) {
    return Math.round(num);
  }

  /////////////////////////////////////////////////////////  Chart Data ///////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////  Chart Data ///////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////  Chart Data ///////////////////////////////////////////////////////////////////////////////

  public chart_data = [];

  private center: geometry.Point;
  private radius: number;

  // Necessary to bind `this` to the AppComponent instance
  public visualHandler = this.visual.bind(this);

  public visual(e: SeriesVisualArgs): Element {
    // Obtain parameters for the segments
    this.center = e.center;
    this.radius = e.innerRadius;

    // Create default visual
    return e.createVisual();
  }

  gradient = new LinearGradient({
    name: "LG1",
    stops: [
      new GradientStop(1, "#ff5353", 1),
      new GradientStop(1, "#ff5353", 1),
    ],
  });

  public onRender(e: RenderEvent): void {
    // The center and radius are populated by now.
    // We can ask a circle geometry to calculate the bounding rectangle for us.
    //
    // http://www.telerik.com/kendo-angular-ui/components/drawing/api/geometry/Circle/
    const circleGeometry = new geometry.Circle(
      [this.center.x, this.center.y],
      this.radius
    );
    const bbox = circleGeometry.bbox();

    // Render the text
    //
    // http://www.telerik.com/kendo-angular-ui/components/drawing/api/Text/
    const heading = new Text(
      `${Math.round((this.all_vacant_units / this.allUnits.length) * 100)}%`,
      [0, 0],
      {
        font: "25px 'Montserrat'",
      }
    );

    const line1 = new Text("is currently", [0, 0], {
      font: "15px 'Montserrat'",
    });

    const line2 = new Text("vacant", [0, 0], {
      font: "15px 'Montserrat'",
      fill: this.gradient,
      stroke: {
        color: "#ff5353",
        width: 0.6,
      },
    });

    const line3 = new Text("now.", [0, 0], {
      font: "15px 'Montserrat'",
    });

    // Reflow the text in the bounding box
    //
    // http://www.telerik.com/kendo-angular-ui/components/drawing/api/Layout
    // http://www.telerik.com/kendo-angular-ui/components/drawing/api/LayoutOptions
    const layout = new Layout(bbox, {
      alignContent: "center",
      alignItems: "center",
      justifyContent: "center",
      spacing: 5,
    });

    layout.append(heading, line1, line2, line3);
    layout.reflow();

    // Draw it on the Chart drawing surface
    //
    // http://www.telerik.com/kendo-angular-ui/components/charts/api/ChartComponent/#toc-surface
    e.sender.surface.draw(layout);
  }

  public labelContent(e: SeriesLabelsContentArgs): string {
    return e.category;
  }
}
