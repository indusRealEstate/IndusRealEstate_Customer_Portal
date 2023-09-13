import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { OtherServices } from "app/services/other.service";

@Component({
  selector: "loading-table-admin-payments",
  templateUrl: "./loading-table-admin-payments.html",
  styleUrls: ["./loading-table-admin-payments.scss"],
})
export class LoadingTableAdminPayments implements OnInit {
  displayedColumns: string[] = [
    // "name",
    "id",
    "unit",
    "tenant",
    "amount",
    "purpose",
    "method",
    "property",
    "status",
    "date",
    "more",
  ];
  loadingTable: any[] = [1, 2, 3, 4, 5];

  constructor(private router: Router, private otherServices: OtherServices) {}

  ngOnInit() {}
}
