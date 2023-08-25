import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { OtherServices } from "app/services/other.service";

@Component({
  selector: "loading-table-announcement",
  templateUrl: "./loading-table-announcement.html",
  styleUrls: ["./loading-table-announcement.scss"],
})
export class LoadingTableAnnouncement implements OnInit {
  displayedColumns: string[] = [
    // "name",
    "id",
    "title",
    "building",
    "emergency",
    "date",
    "more",
  ];
  loadingTable: any[] = [1, 2, 3, 4, 5];

  constructor(private router: Router, private otherServices: OtherServices) {}

  ngOnInit() {}
}
