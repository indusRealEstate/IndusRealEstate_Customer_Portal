import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
  selector: "searchbar-table",
  templateUrl: "./searchbar-table.html",
  styleUrls: ["./searchbar-table.scss"],
})
export class TableSearchBarComponent implements OnInit {
  searchBarOpened: boolean = false;

  searchText: any = "";

  @Output() myEvent = new EventEmitter<string>();

  callParent(val) {
    this.myEvent.emit(val);
  }

  constructor() {}

  ngOnInit() {}

  searchBarClicked() {
    this.searchText = "";
    this.searchBarOpened == false
      ? (this.searchBarOpened = true)
      : (this.searchBarOpened = false);
  }
}
