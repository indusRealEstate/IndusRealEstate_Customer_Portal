import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";

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

  uploadedDocCount: string = "No attachments found";
  uploadedImgCount: string = "No Images found";

  propertyImages: any[] = [];
  propertyImagesNames: any[] = [];

  propertyDocs: any[] = [];
  propertyDocsNames: any[] = [];

  secondPartySignature: any = "";
  secondPartySignatureName: any = "";

  moreThan4PropertyDocs: boolean = false;
  moreThan5PropertyImages: boolean = false;

  offerValidity: any = "";
  validUntil: any = "";

  formNotCompletelyFilled: boolean = false;
  isLoading: boolean = false;
  pageLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private otherServices: OtherServices
  ) {
    this.pageLoading = true;
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

  marketingOthersCheckBoxChecked(event: any) {
    this.marketingOthers = event.checked;
  }
  marketingBoardsCheckBoxChecked(event: any) {
    this.marketingBoards = event.checked;
  }
  marketingSocialMediaCheckBoxChecked(event: any) {
    this.marketingSocialMedia = event.checked;
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

    setTimeout(() => {
      this.pageLoading = false;
    }, 1000);
  }

  clickSubmit() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    const REQUEST_TYPE = "ADD_PROPERTY";

    if (
      this.propertyState == null ||
      this.offerValidity == "" ||
      this.addPropertyForm.value["furnishDetails"] == "" ||
      this.addPropertyForm.value["titleDeedNumber"] == "" ||
      this.addPropertyForm.value["ProjectName"] == "" ||
      this.addPropertyForm.value["CommunityName"] == "" ||
      this.addPropertyForm.value["BuildingName"] == "" ||
      this.addPropertyForm.value["SizeArea"] == "" ||
      this.addPropertyForm.value["NumberOfBedRooms"] == null ||
      this.addPropertyForm.value["UnitNumber"] == null ||
      this.addPropertyForm.value["NumberOfCarParking"] == null ||
      this.addPropertyForm.value["AdditionalInformation"] == "" ||
      this.propertyImages.length == 0 ||
      this.propertyDocs.length == 0 ||
      this.secondPartySignature == ""
    ) {
      this.formNotCompletelyFilled = true;

      setTimeout(() => {
        this.formNotCompletelyFilled = false;
      }, 8000);
    } else {
      this.formNotCompletelyFilled = false;
      this.isLoading = true;

      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
      });

      var jsonData = {
        user_id: user[0]["id"],
        request_type: REQUEST_TYPE,
        unique_id: '',
        property_state: this.propertyState,
        offer_validity: this.offerValidity,
        furnish_details: this.addPropertyForm.value["furnishDetails"],
        title_deed_number: this.addPropertyForm.value["titleDeedNumber"],
        project_name: this.addPropertyForm.value["ProjectName"],
        community: this.addPropertyForm.value["CommunityName"],
        building_name: this.addPropertyForm.value["BuildingName"],
        size_area: this.addPropertyForm.value["SizeArea"],
        bedroom_no: this.addPropertyForm.value["NumberOfBedRooms"],
        unit_number: this.addPropertyForm.value["UnitNumber"],
        car_parking_no: this.addPropertyForm.value["NumberOfCarParking"],
        additional_info: this.addPropertyForm.value["AdditionalInformation"],

        // property images
        property_image_1_name:
          this.propertyImages.length < 1 ? "" : this.propertyImagesNames[0],

        property_image_2_name:
          this.propertyImages.length < 2 ? "" : this.propertyImagesNames[1],

        property_image_3_name:
          this.propertyImages.length < 3 ? "" : this.propertyImagesNames[2],

        property_image_4_name:
          this.propertyImages.length < 4 ? "" : this.propertyImagesNames[3],

        property_image_5_name:
          this.propertyImages.length < 5 ? "" : this.propertyImagesNames[4],
        // property docs

        property_doc_1_name:
          this.propertyDocs.length < 1 ? "" : this.propertyDocsNames[0],

        property_doc_2_name:
          this.propertyDocs.length < 2 ? "" : this.propertyDocsNames[1],

        property_doc_3_name:
          this.propertyDocs.length < 3 ? "" : this.propertyDocsNames[2],

        property_doc_4_name:
          this.propertyDocs.length < 4 ? "" : this.propertyDocsNames[3],

        social_media_marketing_info:
          this.addPropertyForm.value["SocialMediaMarketingDetails"],
        board_marketing_info:
          this.addPropertyForm.value["BoardMarketingDetails"],
        others_marketing_info:
          this.addPropertyForm.value["OthersMarketingDetails"],

        valid_until: this.validUntil,

        second_party_signature_name: this.secondPartySignatureName,
        approved: "false",
        expired: "false",
        declined: "false",
      };

      try {
        setTimeout(() => {
          this.apiService
            .requestAddPropertyLandlord(JSON.stringify(jsonData))
            .subscribe((e) => {
              this.isLoading = false;

              // if (this.otherServices.gotError.value == false) {
              //   this.otherServices.addMessage({
              //     message: "Success",
              //     description:
              //       "The request to add property has been successfully sented",
              //   });
              // }

              this.router.navigate(["/my-properties"], {
                queryParams: { uid: user[0]["id"] },
              });
            });
        }, 6000);

        // setTimeout(() => {
        //   this.otherServices.clearMessage();
        // }, 10000);

        setTimeout(() => {
          this.apiService
            .saveImgInServer({
              images: this.propertyImages,
              imageNames: this.propertyImagesNames,
              docs: this.propertyDocs,
              docsNames: this.propertyDocsNames,
              sign: this.secondPartySignature,
              signName: this.secondPartySignatureName,
            })
            .subscribe((res) => {
              console.log(res);
            });
        }, 2000);
      } catch (error) {}
    }
  }

  clearSignature() {
    this.secondPartySignature = "";
  }

  onOfferValidityDate(event): void {
    var date = new Date(event["value"]);

    var dateDay = Number(date.toISOString().split("T")[0].split("-")[2]) + 1;
    var currentDate =
      date.toISOString().split("T")[0].split("-")[0] +
      "-" +
      date.toISOString().split("T")[0].split("-")[1] +
      "-" +
      dateDay.toString();

    this.offerValidity = currentDate;
  }

  onValidUntilDate(event): void {
    var date = new Date(event["value"]);

    var dateDay = Number(date.toISOString().split("T")[0].split("-")[2]) + 1;
    var currentDate =
      date.toISOString().split("T")[0].split("-")[0] +
      "-" +
      date.toISOString().split("T")[0].split("-")[1] +
      "-" +
      dateDay.toString();

    this.validUntil = currentDate;
  }

  pickImg(event: any) {
    var file = event.target.files[0];
    var reader = new FileReader();

    if (this.propertyImages.length < 5) {
      reader.readAsDataURL(file);

      try {
        reader.onloadend = (e) => {
          this.propertyImages.push(e.target.result);
          this.propertyImagesNames.push(
            this.addPropertyForm.value["ProjectName"] +
              "-" +
              this.propertyImages.length +
              "." +
              file["type"].split("/")[1]
          );
        };
      } catch (error) {
      } finally {
        this.uploadedImgCount = `${
          this.propertyImages.length + 1
        } Images found`;
      }
    } else {
      this.moreThan5PropertyImages = true;

      setTimeout(() => {
        this.moreThan5PropertyImages = false;
      }, 8000);
    }
  }

  pickSignature(event: any) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = (e) => {
      this.secondPartySignature = e.target.result;
      this.secondPartySignatureName =
        this.addPropertyForm.value["ProjectName"] +
        "-" +
        "signature" +
        "." +
        file["type"].split("/")[1];
    };
  }

  pickDoc(event: any) {
    if (this.propertyDocs.length < 4) {
      var file = event.target.files[0];
      var reader = new FileReader();

      reader.readAsDataURL(file);

      try {
        reader.onloadend = (e) => {
          this.propertyDocs.push(e.target.result);
          this.propertyDocsNames.push(
            this.addPropertyForm.value["ProjectName"] +
              "-" +
              this.propertyDocs.length +
              "." +
              file["type"].split("/")[1]
          );
        };
      } catch (error) {
      } finally {
        this.uploadedDocCount = `${
          this.propertyDocs.length + 1
        } attachments found`;
      }
    } else {
      this.moreThan4PropertyDocs = true;

      setTimeout(() => {
        this.moreThan4PropertyDocs = false;
      }, 8000);
    }
  }
}
