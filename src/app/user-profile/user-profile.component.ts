import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";
import { Property } from "../../../models/property/property";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"],
})
export class UserProfileComponent implements OnInit {
  isUserSignedIn: boolean = false;
  username: string;
  full_name: string;
  email: string;
  address: string;
  phone_number: number;
  lan_number: number;
  userProfilePic: string = "";
  userProfileFetching: boolean = false;
  properties: Property[] = [];
  isLoading: boolean = false;

  ///----

  isOverviewTabActive: boolean = true;
  isDocDetailsTabActive: boolean = false;
  isPropertiesTabActive: boolean = false;

  isOverviewTabClicked() {
    this.isOverviewTabActive = true;
    this.isDocDetailsTabActive = false;
    this.isPropertiesTabActive = false;
  }
  isDocDetailsTabClicked() {
    this.isDocDetailsTabActive = true;
    this.isPropertiesTabActive = false;
    this.isOverviewTabActive = false;
  }
  isPropertiesTabClicked() {
    this.isPropertiesTabActive = true;
    this.isOverviewTabActive = false;
    this.isDocDetailsTabActive = false;
  }

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private otherServices: OtherServices
  ) {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.route.queryParams.subscribe((e) => {
      if (e == null) {
        router.navigate([`/user-profile`], {
          queryParams: { uid: user[0]["id"] },
        });
      } else if (e != user[0]["id"]) {
        router.navigate([`/user-profile`], {
          queryParams: { uid: user[0]["id"] },
        });
      }
    });
  }

  pickImg(event: any) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = (e) => {
      this.userProfilePic = e.target.result.toString();

      var userData = localStorage.getItem("currentUser");
      var user = JSON.parse(userData);
      var userId = user[0]["id"];

      var updatedUserProfileData = {
        user_id: userId,
        profile_photo: this.userProfilePic.split(",")[1],
      };

      this.apiService
        .updateUserProfilePic(JSON.stringify(updatedUserProfileData))
        .subscribe((e) => {});

      this.otherServices.isProfilePicUpdated.next(true);

      sessionStorage.removeItem("userDetails");

      setTimeout(() => {
        this.getUserDetails();
      }, 500);
    };
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

    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    var userDetailsDataSession = sessionStorage.getItem("userDetails");
    var sessionDataJSON = JSON.parse(userDetailsDataSession);

    var userPropertiesDataSession = sessionStorage.getItem("properties");
    var sessionDataJSONPropertes = JSON.parse(userPropertiesDataSession);

    if (userDetailsDataSession == null) {
      console.log("user details from api");
      this.userProfileFetching = true;
      this.getUserDetails();

      if (user[0]["auth_type"] == "landlord") {
        if (userPropertiesDataSession != null) {
          this.properties = sessionDataJSONPropertes;
        } else {
          this.getUserProperties(user[0]["id"]);
        }
      }
    } else {
      console.log("user details from session");

      this.username = user[0]["username"];
      this.full_name = user[0]["firstname"] + " " + user[0]["lastname"];

      this.email = sessionDataJSON["email"];
      this.address = sessionDataJSON["address"];
      this.phone_number = sessionDataJSON["phone_number"];
      this.userProfilePic = sessionDataJSON["userProfilePic"];

      if (user[0]["auth_type"] == "landlord") {
        if (userPropertiesDataSession != null) {
          this.properties = sessionDataJSONPropertes;
        } else {
          this.getUserProperties(user[0]["id"]);
        }
      }
    }
  }

  getUserProperties(userId: any) {
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

  getUserDetails() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    var userId = user[0]["id"];
    this.username = user[0]["username"];
    this.full_name = user[0]["firstname"] + " " + user[0]["lastname"];

    this.apiService.getUserDetails(userId).subscribe((data) => {
      this.email = data[0]["email"];
      this.address = data[0]["address"];
      this.phone_number = data[0]["phone_number"];
      this.userProfilePic = "data:image/jpg;base64," + data[0]["profile_photo"];
    });

    setTimeout(() => {
      sessionStorage.setItem(
        "userDetails",
        JSON.stringify({
          email: this.email,
          address: this.address,
          phone_number: this.phone_number,
          userProfilePic: this.userProfilePic,
        })
      );
      this.userProfileFetching = false;
    }, 1000);
  }
}
