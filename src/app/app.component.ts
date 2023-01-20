import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../../models/user/user.model";
import { AuthenticationService } from "./services/authentication.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  currentUser: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(
      (x) => (this.currentUser = x)
    );

    // to clear the localStorage after 1 hour
    // (if someone want to clear after 8hrs simply change hours=8)

    var hours = 3;

    var now = new Date().getTime();
    var setupTime = JSON.parse(localStorage.getItem("setupTime"));
    if (setupTime == null) {
      console.log("setuped now");
      localStorage.setItem("setupTime", JSON.stringify(now));
    } else {
      if (now - setupTime > hours * 60 * 60 * 1000) {
        console.log("cleared now");
        localStorage.clear();
        sessionStorage.clear();
        localStorage.setItem("setupTime", JSON.stringify(now));

        window.location.replace("/login");
      }
    }
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(["/login"]);
  }

  onActivate(event) {
    // window.scroll(0,0);

    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }
}
