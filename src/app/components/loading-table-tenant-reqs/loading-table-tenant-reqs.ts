import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { OtherServices } from "app/services/other.service";

@Component({
  selector: "loading-table-tenant-reqs",
  templateUrl: "./loading-table-tenant-reqs.html",
  styleUrls: ["./loading-table-tenant-reqs.scss"],
})
export class LoadingTableTenantReqs implements OnInit {
  displayedColumns: string[] = [
    // "name",
    "issueDate",
    "reqNo",
    "reqType",
    "propertyName",
    "clientName",
    "status",
    "actions",
  ];
  loadingTable: any[] = [1, 2, 3, 4, 5];

  constructor(private router: Router, private otherServices: OtherServices) {}

  ngOnInit() {}
}
