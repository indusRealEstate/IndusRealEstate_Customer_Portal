import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";

@Component({
  selector: "add-property",
  templateUrl: "./add_property_from.html",
  styleUrls: ["./add_property_from.scss"],
})
export class AddPropertyForm implements OnInit {
  isUserSignedIn: boolean = false;
  textareaValue: any = "hello";
  propertyState: "sale" | "rent" = "rent";
  addPropertyForm: FormGroup;

  marketingSocialMedia: boolean = false;
  marketingBoards: boolean = false;
  marketingOthers: boolean = false;

  uploadedDocName: string = "No attachments found";

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute
  ) {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    if (user[0]["auth_type"] == "landlord") {
      this.route.queryParams.subscribe((e) => {
        if (e == null) {
          router.navigate([`/add-property-form`], {
            queryParams: { uid: user[0]["id"] },
          });
        } else if (e != user[0]["id"]) {
          router.navigate([`/add-property-form`], {
            queryParams: { uid: user[0]["id"] },
          });
        }
      });
    } else {
      router.navigate([`/404`]);
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
    this.addPropertyForm = this.formBuilder.group({
      furnishDetails: [""],
      titleDeedNumber: [""],
      ProjectName: [""],
      CommunityName: [""],
      BuildingName: [""],
      SizeArea: [""],
      NumberOfBedRooms: [0],
      UnitNumber: [0],
      NumberOfCarParking: [0],
      AdditionalInformation: [""],
      SocialMediaMarketingDetails: [""],
      BoardMarketingDetails: [""],
      OthersMarketingDetails: [""],
    });
  }

  onSubmit() {
    console.log(this.addPropertyForm.value["furnishDetails"]);
  }

  pickImg(event: any) {}

  pickDoc(event: any) {
    var file = event.target.files[0];
    var reader = new FileReader();
    // reader.readAsDataURL(file);

    // reader.onloadend = (e) => {
    //   console.log(e.target.result);
    // };

    this.uploadedDocName = file["name"];
  }
}
