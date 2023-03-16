import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "app/services/authentication.service";
import { OpenAiServices } from "app/services/openAI.service";

@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.scss"],
})
export class ReportsComponent implements OnInit {
  selectedReport: any = "--None--";
  selectedDateRange: any = "--None--";
  isUserSignedIn: boolean = false;

  aiPromptText: any = "";
  aiResult: any = "";

  aiGenerateImageUrl: any = "";

  ifAiBtnClicked: boolean = false;
  ifAiBtnClickedImage: boolean = false;
  isUserNothingAdded: boolean = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private openAi: OpenAiServices
  ) {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
      var userData = localStorage.getItem("currentUser");
      var user = JSON.parse(userData);

      if (user[0]["auth_type"] != "admin") {
        this.route.queryParams.subscribe((e) => {
          if (e == null) {
            router.navigate([`/reports`], {
              queryParams: { uid: user[0]["id"] },
            });
          } else if (e != user[0]["id"]) {
            router.navigate([`/reports`], {
              queryParams: { uid: user[0]["id"] },
            });
          }
        });
      } else {
        router.navigate(["/admin-dashboard"]);
      }
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  ngOnInit() {}

  async openAiPromtBtnClick() {
    if (this.aiPromptText != "") {
      this.ifAiBtnClicked = true;
      this.aiResult = await this.openAi.getDataFromOpenAPI(this.aiPromptText);
    } else {
      this.isUserNothingAdded = true;

      setTimeout(() => {
        this.isUserNothingAdded = false;
      }, 3000);
    }
  }

  async openAiImageGenerateClick() {
    if (this.aiPromptText != "") {
      this.ifAiBtnClickedImage = true;
      this.aiGenerateImageUrl = await this.openAi.createImageOpenAI(
        this.aiPromptText
      );
      console.log(this.aiGenerateImageUrl)
    } else {
      this.isUserNothingAdded = true;

      setTimeout(() => {
        this.isUserNothingAdded = false;
      }, 3000);
    }
  }

  clearAiText() {
    this.ifAiBtnClicked = false;
    this.ifAiBtnClickedImage = false;
    this.aiResult = "";
    this.aiGenerateImageUrl = "";
  }
}
