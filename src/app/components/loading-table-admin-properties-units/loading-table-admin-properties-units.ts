import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { OtherServices } from "app/services/other.service";

@Component({
  selector: "loading-table-admin-properties-units",
  templateUrl: "./loading-table-admin-properties-units.html",
  styleUrls: ["./loading-table-admin-properties-units.scss"],
})
export class LoadingTableAdminPropertiesUnits implements OnInit {
  displayedColumns: string[] = [
    // "name",
    "unitNo",
    "propertyName",
    "size",
    "status",
    "tenant",
    "premises",
    "plot",
    "type",
    "more",
  ];
  loadingTable: any[] = [1, 2, 3, 4, 5];

  constructor(private router: Router, private otherServices: OtherServices) {}

  ngOnInit() {}
}
