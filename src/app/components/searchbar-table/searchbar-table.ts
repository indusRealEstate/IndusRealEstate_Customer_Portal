import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { OtherServices } from "app/services/other.service";

@Component({
  selector: "searchbar-table",
  templateUrl: "./searchbar-table.html",
  styleUrls: ["./searchbar-table.scss"],
})
export class TableSearchBarComponent implements OnInit {
  userId: any;

  searchBarOpened: boolean = false;

  constructor(private router: Router, private otherServices: OtherServices) {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.userId = user[0]["id"];
  }

  ngOnInit() {}

  searchBarClicked() {
    this.searchBarOpened == false
      ? (this.searchBarOpened = true)
      : (this.searchBarOpened = false);
  }
}
