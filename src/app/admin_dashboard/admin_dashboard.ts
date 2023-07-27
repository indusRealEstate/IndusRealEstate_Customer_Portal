import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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

  // properties
  allUnitsLength: number = 0;
  allPropertiesLength: number = 0;

  // clients
  landlordClient: number = 0;
  tenantClient: number = 0;

  isLoading: boolean = false;

  constructor(
    private adminService: AdminService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
  ) {
    this.isLoading = true;
    // }

    this.getScreenSize();
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    this.route.queryParams.subscribe((e) => {
      if (e == null) {
        router.navigate(["/admin-dashboard"], {
          queryParams: { uid: user[0]["id"] },
        });
      } else if (e != user[0]["id"]) {
        router.navigate(["/admin-dashboard"], {
          queryParams: { uid: user[0]["id"] },
        });
      }
    });
  }

  dashboardMainCards: any[] = [
    {
      title: "Total Landlords",
      count: "6",
      icon: "assets/img/pngs/dashboard/landlord.png",
    },
    {
      title: "Total Maintenance Requests",
      count: "45",
      icon: "assets/img/pngs/dashboard/maintenance.png",
    },
    {
      title: "Total Units",
      count: "15",
      icon: "assets/img/pngs/dashboard/unit.png",
    },
  ];

  dashboardMainCardsPartTwo: any[] = [
    {
      title: "Total Tenants",
      count: "8",
      icon: "assets/img/pngs/dashboard/tenant-2.png",
    },
    {
      title: "Total Active Contracts",
      count: "7",
      icon: "assets/img/pngs/dashboard/contract.png",
    },
    {
      title: "Total Buildings",
      count: "3",
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

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  async ngOnInit() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    this.isUserSignOut();

    var sessionDataRaw = sessionStorage.getItem("admin_dashboard_session_data");
    var sessionData = JSON.parse(sessionDataRaw);

    if (sessionDataRaw != null) {
      this.allUnitsLength = sessionData["rentProperties"];
      this.allPropertiesLength = sessionData["saleProperties"];
      this.landlordClient = sessionData["landlords"];
      this.tenantClient = sessionData["tenants"];
      this.isLoading = false;
    } else {
      await this.initFunction(user[0]["id"]);
      sessionStorage.setItem(
        "admin_dashboard_fetched_time",
        JSON.stringify(new Date().getMinutes())
      );
    }

    var now = new Date().getMinutes();

    var diff =
      now -
      Number(
        JSON.parse(sessionStorage.getItem("admin_dashboard_fetched_time"))
      );

    if (diff >= 10) {
      this.isLoading = true;
      this.clearAllVariables();
      sessionStorage.removeItem("admin_dashboard_fetched_time");
      sessionStorage.removeItem("admin_dashboard_session_data");
      await this.initFunction(user[0]["id"]);
      sessionStorage.setItem(
        "admin_dashboard_fetched_time",
        JSON.stringify(new Date().getMinutes())
      );
    }
  }

  clearAllVariables() {
    this.allUnitsLength = 0;
    this.allPropertiesLength = 0;
    this.landlordClient = 0;
    this.tenantClient = 0;
  }

  async initFunction(userId) {
    await this.getAllProperties();

    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  cacheInSession() {
    sessionStorage.setItem(
      "admin_dashboard_session_data",
      JSON.stringify({
        rentProperties: this.allUnitsLength,
        saleProperties: this.allPropertiesLength,
        landlords: this.landlordClient,
        tenants: this.tenantClient,
      })
    );
  }

  async getAllProperties() {
    this.adminService.getallPropertiesAdmin().subscribe((e: Array<any>) => {
      this.allPropertiesLength = e.length;
    });
    this.adminService
      .getallPropertiesUnitsAdmin()
      .subscribe((e: Array<any>) => {
        this.allUnitsLength = e.length;
      });
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

  /////////////////////////////////////////////////////////  Chart Data ///////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////  Chart Data ///////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////  Chart Data ///////////////////////////////////////////////////////////////////////////////

  public chart_data = [
    {
      share: "60%",
      color: "#fac83a",
    },
    {
      share: "40%",
      color: "#ff5353",
    },
  ];

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
    const heading = new Text("40%", [0, 0], {
      font: "25px 'Montserrat'",
    });

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
