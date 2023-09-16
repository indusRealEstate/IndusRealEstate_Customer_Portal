import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { OtherServices } from "app/services/other.service";

@Component({
  selector: "loading-table-admin-all-users",
  templateUrl: "./loading-table-admin-all-users.html",
  styleUrls: ["./loading-table-admin-all-users.scss"],
})
export class LoadingTableAdminAllUsers implements OnInit {
  displayedColumns: string[] = [
    // "name",
    "name",
    "mobileNumber",
    "userType",
    "email",
    "idType",
    "idNumber",
    "nationality",
    "dob",
    "more",
  ];
  loadingTable: any[] = [1, 2, 3, 4, 5];

  constructor(private router: Router, private otherServices: OtherServices) {}

  ngOnInit() {}
}
