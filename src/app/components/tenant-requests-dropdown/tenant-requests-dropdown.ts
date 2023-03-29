import { Component, OnInit, Renderer2 } from "@angular/core";
import { Route, Router } from "@angular/router";

/**
 * @title Basic menu
 */
@Component({
  selector: "tenant-requests-dropdown",
  templateUrl: "./tenant-requests-dropdown.html",
  styleUrls: ["./tenant-requests-dropdown.scss"],
})
export class TenantRequestsDropdown implements OnInit {
  userId: any;
  isDropDownBtnClicked: boolean = false;
  isDropDownBtnsShow: boolean = false;

  constructor(private router: Router) {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.userId = user[0]["id"];
  }

  ngOnInit() {
    // this.getUserDataFromLocal();
  }

  ngDoCheck() {
    if (this.isDropDownBtnClicked == false && this.isDropDownBtnsShow == true) {
      this.isDropDownBtnsShow = false;
    }
  }

  dropDownBtnClick() {
    if (this.isDropDownBtnClicked == false) {
      this.isDropDownBtnClicked = true;
      setTimeout(() => {
        this.isDropDownBtnsShow = true;
      }, 350);
    } else {
      this.isDropDownBtnClicked = false;
      this.isDropDownBtnsShow = false;
    }
  }

  navigateToRequests(req) {
    if (req == "maintenance") {
      this.router.navigate(["/maintenance-requests"], {
        queryParams: { uid: this.userId },
      });
    }
  }
}
