import { HttpClient } from "@angular/common/http";
import { Component, HostListener, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";
import { Property } from "../../../models/property/property";

@Component({
  selector: "app-myProperties",
  templateUrl: "./my_properties.component.html",
  styleUrls: ["./my_properties.component.scss"],
})
export class MyPropertiesComponent implements OnInit {
  isUserSignedIn: boolean = false;
  isLoading: boolean = false;
  isImagesLoading: boolean = false;
  properties: any[] = [];
  mouseEnterAddPropertyCard: boolean = false;
  propertyImages: any[] = [];

  imagesUrl: any = "";

  screenHeight: number;
  screenWidth: number;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private otherServices: OtherServices,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.getScreenSize();
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    if (user[0]["auth_type"] != "landlord") {
      router.navigateByUrl(`/home/${user[0]["id"]}`);
    } else {
      this.route.queryParams.subscribe((e) => {
        if (e == null) {
          router.navigate([`/my-properties`], {
            queryParams: { uid: user[0]["id"] },
          });
        } else if (e != user[0]["id"]) {
          router.navigate([`/my-properties`], {
            queryParams: { uid: user[0]["id"] },
          });
        }
      });
    }
  }

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
    this.isImagesLoading = true;
    this.isUserSignOut();
    await this.initFunction();
  }

  getImagesUrl() {
    this.imagesUrl = this.apiService.getBaseUrlImages();
    setTimeout(() => {
      this.isImagesLoading = false;
    }, 1000);
  }

  async initFunction() {
    var propertiesdata = sessionStorage.getItem("properties");
    if (propertiesdata != null) {
      var decodedData = JSON.parse(propertiesdata);
      this.properties = decodedData["properties"];
      this.imagesUrl = decodedData["imgUrl"];
      this.isImagesLoading = false;
    } else {
      this.isLoading = true;

      await this.getProperties();
    }
  }

  openMatMenu(trigger) {
    trigger.openMenu();
  }

  closeMatMenu(trigger) {
    trigger.closeMenu();
  }

  goToPropertyPage(property: any) {
    this.router.navigate(["/property-page"], {
      queryParams: { propertyId: property["property_id"] },
    });
  }

  async getProperties() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    var userId = user[0]["id"];

    try {
      this.apiService.getUserProperties(userId).subscribe((data) => {
        this.properties = data;
      });
    } catch (error) {
      // console.log(error);
    } finally {
      setTimeout(() => {
        this.isLoading = false;

        if (this.properties.length != 0) {
          this.getImagesUrl();
          sessionStorage.setItem(
            "properties",
            JSON.stringify({
              properties: this.properties,
              imgUrl: this.imagesUrl,
            })
          );
        }
      }, 3000);
    }
  }
}
