import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
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

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private otherServices: OtherServices,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
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

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  ngOnInit() {
    this.isImagesLoading = true;
    this.isUserSignOut();
    this.initFunction();
  }

  getImagesUrl() {
    this.imagesUrl = this.apiService.getBaseUrlImages();
    setTimeout(() => {
      this.isImagesLoading = false;
    }, 500);
  }

  initFunction() {
    var propertiesdata = sessionStorage.getItem("properties");
    if (propertiesdata != null) {
      var decodedData = JSON.parse(propertiesdata);
      this.properties = decodedData;

      this.getImagesUrl();
    } else {
      this.isLoading = true;
      setTimeout(() => {
        this.getProperties();
      }, 300);
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

    try {
      this.apiService.getUserProperties(userId).subscribe((data) => {
        this.properties = data;
      });
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        if (this.properties.length != 0) {
          this.getImagesUrl();
          this.isLoading = false;
          sessionStorage.setItem("properties", JSON.stringify(this.properties));
        }
      }, 800);
    }
  }
}
