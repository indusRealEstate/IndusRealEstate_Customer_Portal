import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
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
    private authenticationService: AuthenticationService
  ) {}

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
    this.isLoading = true;
    setTimeout(() => {
      this.getProperties();
    }, 600);
  }

  getProperties() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    var userId = user[0]["id"];

    try {
      this.apiService.getUserProperties(userId).subscribe((data) => {
        for (let e of data) {
          this.properties.push(
            new Property(
              e["user_id"],
              e["property_id"],
              e["property_name"],
              e["property_address"],
              e["images"],
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
    } finally {
      setTimeout(() => {
        this.isLoading = false;
      }, 100);
      
    }
  }
}
