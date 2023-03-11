import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "app/services/authentication.service";

@Component({
  selector: "app-page-not-found",
  templateUrl: "./404_page_not_found.component.html",
  styleUrls: ["./404_page_not_found.component.scss"],
})
export class PageNotFoundComponent implements OnInit {
  selectedReport: any = "--None--";
  selectedDateRange: any = "--None--";
  isUserSignedIn: boolean = false;
  userId: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  ngOnInit() {}
}
