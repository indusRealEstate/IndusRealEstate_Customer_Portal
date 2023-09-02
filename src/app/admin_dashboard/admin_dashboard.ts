import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
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
import { FirebaseService } from "app/services/firebase.service";
import { LeaseService } from "app/services/lease.service";

@Component({
  selector: "admin-dashboard",
  templateUrl: "./admin_dashboard.html",
  styleUrls: ["./admin_dashboard.scss"],
})
export class AdminDashboardComponent implements OnInit {
  isUserSignedIn: boolean = false;

  isLoading: boolean = false;

  allProperties_length: number = 0;
  allUnits_length: number = 0;
  allUnits_vacant_length: number = 0;
  allUnits_occupied_length: number = 0;
  allUsers_landlord_length: number = 0;
  allUsers_tenant_length: number = 0;
  allContracts_active_length: number = 0;
  allRequests_length: number = 0;

  total_contracts_reminders_items: any[] = [];
  total_contracts_currentItemsToShow: any[] = [];

  total_contracts_reminders_loading: boolean = true;

  donut_chart_loading: boolean = true;

  firestore_contracts_reminders: any[] = [];

  reminder_button_loading: boolean = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private adminService: AdminService,
    private leaseService: LeaseService,
    private firebaseService: FirebaseService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.isLoading = true;
    this.getScreenSize();

    this.firebaseService.firebaseLogin().then(() => {
      this.firebaseService.userLoggedIn.subscribe(async (res) => {
        if (res == true) {
          this.firebaseService.requestToken();
          this.firebaseService.recieveMessages();
          await this.firebaseService.getAllContractsReminders().then((obs) => {
            obs.subscribe((val: any[]) => {
              if (this.firestore_contracts_reminders.length == 0) {
                this.firestore_contracts_reminders = val;
              } else {
                val.forEach((r) => {
                  this.firestore_contracts_reminders.push(r);
                });
              }
            });
          });
        }
      });
    });
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

  onPaginateChange($event) {
    this.total_contracts_currentItemsToShow =
      this.total_contracts_reminders_items.slice(
        $event.pageIndex * $event.pageSize,
        $event.pageIndex * $event.pageSize + $event.pageSize
      );
  }

  async sendContractReminder(contract) {
    var days_left = this.getContractsEndsInPeriod(contract.contract_end);
    await this.firebaseService.addContractReminder(
      contract.contract_id,
      days_left
    );

    this.getReminderSendedTime(contract);
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
    this.adminService.getallDataDashboard().subscribe((res) => {
      this.allContracts_active_length = res.all_active_contracts;
      this.allProperties_length = res.all_buildings;
      this.allUnits_length = res.all_units;
      this.allUnits_vacant_length = res.vacant_units;
      this.allUnits_occupied_length = res.occupied_units;
      this.allUsers_landlord_length = res.landlords;
      this.allUsers_tenant_length = res.tenants;
    });

    this.leaseService
      .getAllContractsReminders()
      .subscribe((res: any[]) => {
        this.total_contracts_reminders_items = res;
        this.total_contracts_currentItemsToShow = res;
      })
      .add(() => {
        this.total_contracts_reminders_loading = false;
      });
  }

  getReminderSendedTime(contract) {
    var now = new Date().getTime();
    if (this.firestore_contracts_reminders.length != 0) {
      var reminder = this.firestore_contracts_reminders.find(
        (co) => co.id == contract.contract_id
      );
      if (reminder != undefined) {
        var timestamp = new Date(reminder.timestamp.toDate()).getTime();
        var difference_In_Time = timestamp - now;
        var difference_In_Days = Math.abs(
          Math.round(difference_In_Time / (1000 * 3600 * 24))
        );

        var diffHrs = Math.floor(((now - timestamp) % 86400000) / 3600000);

        if (difference_In_Days < 1) {
          if (diffHrs >= 1) {
            return diffHrs != 1
              ? `Sended ${diffHrs} hours ago.`
              : `Sended ${diffHrs} hour ago.`;
          } else {
            var minutes = Math.abs(
              Math.round(((difference_In_Time % 86400000) % 3600000) / 60000)
            );
            return minutes != 0
              ? minutes != 1
                ? `Sended ${minutes} minutes ago.`
                : `Sended ${minutes} minute ago.`
              : "Sended now.";
          }
        } else {
          return "loading..";
        }
      } else {
        return "loading..";
      }
    } else {
      return "loading..";
    }
  }

  getStatsCount(title) {
    switch (title) {
      case "Total Landlords":
        return this.allUsers_landlord_length;
      case "Total Maintenance Requests":
        return this.allRequests_length;
      case "Total Units":
        return this.allUnits_length;
      case "Total Tenants":
        return this.allUsers_tenant_length;
      case "Total Active Contracts":
        return this.allContracts_active_length;
      case "Total Buildings":
        return this.allProperties_length;
      default:
        break;
    }
  }

  getContractsEndsInPeriod(end: any) {
    var start_date = new Date();
    var end_date = new Date(end);

    var difference_In_Time = end_date.getTime() - start_date.getTime();

    var difference_In_Days = difference_In_Time / (1000 * 3600 * 24);

    return Math.round(difference_In_Days);
  }

  async ngOnInit() {
    await this.getAllData();
    this.isUserSignOut();
  }

  ngAfterViewInit() {
    this.isLoading = false;

    setTimeout(() => {
      if (this.paginator != undefined) {
        this.total_contracts_currentItemsToShow =
          this.total_contracts_reminders_items.slice(
            this.paginator.pageIndex * this.paginator.pageSize,
            this.paginator.pageIndex * this.paginator.pageSize +
              this.paginator.pageSize
          );
      }
    });

    setTimeout(() => {
      this.chart_data = [
        {
          share: `${
            (this.allUnits_occupied_length / this.allUnits_length) * 100
          }%`,
          color: "#fac83a",
        },
        {
          share: `${
            (this.allUnits_vacant_length / this.allUnits_length) * 100
          }%`,
          color: "#ff5353",
        },
      ];
      this.donut_chart_loading = false;
    }, 1500);
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
      `${Math.round(
        (this.allUnits_vacant_length / this.allUnits_length) * 100
      )}%`,
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
