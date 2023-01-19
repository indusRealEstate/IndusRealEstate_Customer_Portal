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
  properties: Property[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private otherServices: OtherServices,
    private route: ActivatedRoute
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
    this.isUserSignOut();
    this.initFunction();
  }

  initFunction() {
    var propertiesdata = sessionStorage.getItem("properties");
    if (propertiesdata != null) {
      var decodedData = JSON.parse(propertiesdata);
      this.properties = decodedData;
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

  getProperties() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    var userId = user[0]["id"];

    try {
      this.apiService.getUserProperties(userId).subscribe((data) => {
        // console.log(data);
        for (let e of data) {
          let objectURL = "data:image/jpeg;base64," + e["image"];

          this.properties.push(
            new Property(
              e["user_id"],
              e["property_id"],
              e["property_name"],
              e["property_address"],
              objectURL,
              e["rented"],
              e["leased"],
              e["sold"],
              e["rent_details"],
              e["lease_details"],
              e["sold_details"]
            )
          );
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.isLoading = false;
        sessionStorage.setItem("properties", JSON.stringify(this.properties));
      }, 1000);
    }
  }
}
