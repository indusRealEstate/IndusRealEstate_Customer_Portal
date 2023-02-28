import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: "property-page",
  templateUrl: "./property-page.component.html",
  styleUrls: ["./property-page.component.scss"],
})
export class PropertyPage implements OnInit {
  isUserSignedIn: boolean = false;

  isLoading: boolean = false;
  propertyData: any;
  propertyImage: any = "";
  imagesUrl: any = "";

  public chartOptions: Partial<ChartOptions>;
  @ViewChild("chart") chart: ChartComponent;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private otherServices: OtherServices
  ) {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    if (user[0]["auth_type"] == "landlord") {
      this.isLoading = true;
      this.route.queryParams.subscribe((e) => {
        this.initFunction(e);
      });
    } else {
      router.navigate([`/404`]);
    }

    this.chartOptions = {
      series: [
        {
          color: "#d3ab33",
          name: "Price",
          data: [
            2000000, 2170000, 2174500, 2175000, 2179999, 2189500, 2189500,
            2189900, 2199000, 2205000, 2300000,
          ],
        },
      ],
      chart: {
        fontFamily: "Montserrat",
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        colors: ["#d3ab33"],
        curve: "straight",
      },
      title: {
        text: "Price Trends",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Nov",
          "Dec",
        ],
      },
    };
  }

  initFunction(e) {
    try {
      if (sessionStorage.getItem("properties") != null) {
        var propertiesDataSession = JSON.parse(
          sessionStorage.getItem("properties")
        );

        this.propertyData = propertiesDataSession.find(
          (x) => x.property_id == e["propertyId"]
        );

        if (this.propertyData == undefined || this.propertyData == null) {
          this.router.navigate(["/404"]);
        }
      } else {
        this.apiService.getProperty(e["propertyId"]).subscribe((e) => {
          this.propertyData = e;
        });
      }

      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    } catch (error) {
      console.log(error);
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

  ngOnInit() {
    this.imagesUrl = this.apiService.getBaseUrlImages();
  }

  ngAfterViewInit() {
    console.log(this.propertyData);
  }

  ngOnDestroy() {}
}
