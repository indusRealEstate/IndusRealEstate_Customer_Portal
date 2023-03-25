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
  isLandlord: boolean = false;
  isTenant: boolean = false;

  isDropDownBtnClicked: boolean = false;
  isDropDownBtnsShow: boolean = false;

  constructor(private router: Router) {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    if (user[0]["auth_type"] == "landlord") {
      this.isLandlord = true;
      this.isTenant = false;
    } else if (user[0]["auth_type"] == "tenant") {
      this.isTenant = true;
      this.isLandlord = false;
    }

    this.userId = user[0]["id"];
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  isPCMenu() {
    if ($(window).width() <= 991) {
      return false;
    }
    return true;
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
