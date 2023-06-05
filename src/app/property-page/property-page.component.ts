import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";

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

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute
  ) {
    this.getScreenSize();

    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
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
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  screenHeight: number;
  screenWidth: number;
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  getPropertyImage(prop) {
    var images: any[] = JSON.parse(prop.property_images)["img"];
    var prop_id = prop.property_id;
    return `${this.imagesUrl}/${prop_id}/${images[0]}`;
  }

  initFunction(e) {
    try {
      if (sessionStorage.getItem("properties") != null) {
        var propertiesDataSession = JSON.parse(
          sessionStorage.getItem("properties")
        );
        this.propertyData = propertiesDataSession["properties"].find(
          (x) => x.property_id == e["propertyId"]
        );
        this.isLoading = false;

        if (this.propertyData == undefined || this.propertyData == null) {
          this.router.navigate(["/404"]);
        }
      } else {
        this.apiService
          .getProperty(e["propertyId"])
          .subscribe((e) => {
            this.propertyData = e;
          })
          .add(() => {
            this.isLoading = false;
          });
      }
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit() {
    this.imagesUrl = this.apiService.getBaseUrlImages();
  }
}
