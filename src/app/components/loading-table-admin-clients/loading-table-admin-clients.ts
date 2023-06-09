import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { OtherServices } from "app/services/other.service";

@Component({
  selector: "loading-table-admin-clients",
  templateUrl: "./loading-table-admin-clients.html",
  styleUrls: ["./loading-table-admin-clients.scss"],
})
export class LoadingTableAdminCLients implements OnInit {
  displayedColumns: string[] = [
    "client",
    "email",
    "address",
    "phone-no",
    "nationality",
    "joined-date",
    "more",
  ];
  loadingTable: any[] = [1, 2, 3, 4, 5];

  constructor(private router: Router, private otherServices: OtherServices) {}

  ngOnInit() {}
}
