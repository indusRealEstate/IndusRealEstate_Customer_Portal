import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { OtherServices } from "app/services/other.service";

@Component({
  selector: "loading-table-admin-all-lease",
  templateUrl: "./loading-table-admin-all-lease.html",
  styleUrls: ["./loading-table-admin-all-lease.scss"],
})
export class LoadingTableAdminAllLease implements OnInit {
  displayedColumns: string[] = [
    // "name",
    "contractId",
    "buliding",
    "unitNo",
    "status",
    "leaseExpiry",
    "owner",
    "tenant",
    "moveIn",
    "moveOut",
    "contractStartDate",
    "contractEndDate",
    "deposit",
    "rentAmount",
    "more",
  ];
  loadingTable: any[] = [1, 2, 3, 4, 5];

  constructor(private router: Router, private otherServices: OtherServices) {}

  ngOnInit() {}
}
