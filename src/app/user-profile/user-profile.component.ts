import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";
import { UserService } from "app/services/user.service";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"],
})
export class UserProfileComponent implements OnInit {
  isUserSignedIn: boolean = false;
  isContentLoading: boolean = false;
  user: any;

  usrImgPath: any = "https://indusre.app/api/upload/img/user/";

  constructor(
    private apiService: ApiService,
    private userServices: UserService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private otherServices: OtherServices
  ) {
    this.isContentLoading = true;
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
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
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  async ngOnInit() {
    var userData = localStorage.getItem("currentUser");
    var userId = JSON.parse(userData)[0]["id"];
    this.apiService
      .getUser(userId)
      .subscribe((v) => {
        this.user = v[0];
        console.log(this.user);
      })
      .add(() => {
        setTimeout(() => {
          this.isContentLoading = false;
        });
      });
  }
}
