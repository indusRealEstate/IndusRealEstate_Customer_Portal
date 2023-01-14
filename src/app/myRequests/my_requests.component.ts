import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";

@Component({
  selector: "app-myRequests",
  templateUrl: "./my_requests.component.html",
  styleUrls: ["./my_requests.component.scss"],
})
export class MyRequestsComponent implements OnInit {
  selectedEntry: any = "10";

  dataSource = new MatTableDataSource<any>();

  isUserSignedIn: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute
  ) {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    this.route.queryParams.subscribe((e) => {
      if (e == null) {
        router.navigate([`/my-requests`], {
          queryParams: { uid: user[0]["id"] },
        });
      } else if (e != user[0]["id"]) {
        router.navigate([`/my-requests`], {
          queryParams: { uid: user[0]["id"] },
        });
      }
    });
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
    this.getUserRequestDetails();
  }
  displayedColumns: string[] = [
    "case-number",
    "request-type",
    "property-name",
    "status",
    "created-date",
  ];

  getUserRequestDetails() {
    var data = localStorage.getItem("currentUser");
    var user = JSON.parse(data);
    var userId = user[0]["id"];

    this.apiService.getUserRequestDetails(userId).subscribe((data: any) => {
      // console.log(JSON.stringify(data));
      // console.log(data);
      this.dataSource.data = data;
    });
  }
}
