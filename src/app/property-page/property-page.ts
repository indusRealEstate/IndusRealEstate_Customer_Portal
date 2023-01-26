import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";

@Component({
  selector: "property-page",
  templateUrl: "./property-page.html",
  styleUrls: ["./property-page.scss"],
})
export class PropertyPage implements OnInit {
  isUserSignedIn: boolean = false;

  isLoading: boolean = false;
  propertyData: any;
  propertyImage: any = "";

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
        // console.log(this.propertyData);
        var imageData = (this.propertyData["image"] += "");
        if (imageData.includes("data:image/jpeg;base64,") == false) {
          this.propertyImage = "data:image/jpeg;base64," + imageData;
        } else {
          this.propertyImage = imageData;
        }

        setTimeout(() => {
          this.isLoading = false;
        }, 300);
      }, 300);
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
  ngOnInit() {}

  ngOnDestroy() {}
}
