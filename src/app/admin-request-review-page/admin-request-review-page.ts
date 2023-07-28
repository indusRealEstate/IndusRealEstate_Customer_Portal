import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { AdminService } from "app/services/admin.service";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";

@Component({
  selector: "admin-request-review-page",
  templateUrl: "./admin-request-review-page.html",
  styleUrls: ["./admin-request-review-page.scss"],
})
export class ReviewRequestAdmin implements OnInit {
  isUserSignedIn: boolean = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private otherServices: OtherServices,
    private apiService: ApiService,
    private adminService: AdminService,
    private dialog?: MatDialog
  ) {}

  ngAfterViewInit() {}

  ngOnInit() {}
}
