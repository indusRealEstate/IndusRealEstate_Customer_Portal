import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";

@Component({
  selector: "app-myProperties",
  templateUrl: "./my_properties.component.html",
  styleUrls: ["./my_properties.component.scss"],
})
export class MyPropertiesComponent implements OnInit {
  isUserSignedIn: boolean = false;
  isImagesLoading: boolean = false;
  properties: any[] = [];
  mouseEnterAddPropertyCard: boolean = false;
  propertyImages: any[] = [];
  propertyDocs: any[] = [];

  imagesUrl: any = "";

  screenHeight: number;
  screenWidth: number;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute
  ) {
    this.getScreenSize();
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
      var userData = localStorage.getItem("currentUser");
      var user = JSON.parse(userData);

      if (user[0]["auth_type"] != "admin") {
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
      } else {
        router.navigate(["/admin-dashboard"]);
      }
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  ngOnInit() {
    this.isImagesLoading = true;
    this.initFunction();
  }

  getImagesUrl() {
    this.imagesUrl = this.apiService.getBaseUrlImages();
    setTimeout(() => {
      this.isImagesLoading = false;
    });
  }

  getPropertyImage(prop) {
    var images: any[] = JSON.parse(prop.property_images)["img"];
    var prop_id = prop.property_id;
    return `${this.imagesUrl}/${prop_id}/${images[0]}`;
  }

  initFunction() {
    var propertiesdata = sessionStorage.getItem("properties");
    if (propertiesdata != null) {
      var decodedData = JSON.parse(propertiesdata);
      this.properties = decodedData["properties"];
      this.imagesUrl = decodedData["imgUrl"];
      this.isImagesLoading = false;
    } else {
      this.getProperties();
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

  getProperties() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    var userId = user[0]["id"];

    this.apiService
      .getUserProperties(userId)
      .subscribe((data) => {
        this.properties = data;
      })
      .add(() => {
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
      });
  }
}
