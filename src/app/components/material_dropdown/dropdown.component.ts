import { Component, OnInit, Renderer2 } from "@angular/core";
import { Route, Router } from "@angular/router";

/**
 * @title Basic menu
 */
@Component({
  selector: "dropdown-btn",
  templateUrl: "./dropdown.component.html",
  styleUrls: ["./dropdown.component.scss"],
})
export class DropdownMaterial implements OnInit {
  userId: any;

  isDropDownBtnClicked: boolean = false;
  isDropDownBtnsShow: boolean = false;

  user_payment_plan: any;

  constructor(private router: Router) {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.userId = user[0]["id"];
    this.user_payment_plan = user[0]["plan"];
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

  navigateToTenentRegistrationPage() {
    this.router.navigate(["/tenant-register-form"], {
      queryParams: { uid: this.userId },
    });
  }
}
