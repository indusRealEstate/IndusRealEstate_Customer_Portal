import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { OtherServices } from "app/services/other.service";
import { BehaviorSubject } from "rxjs";

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

  isDropDownBtnsClosed = new BehaviorSubject<boolean>(false);
  isDropDownBtnsClosedVal: boolean = true;

  baseUrl: any;

  constructor(private router: Router, private otherServices: OtherServices) {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.userId = user[0]["id"];

    otherServices.tenantRequestsDropDownCloseLandlord.subscribe((val) => {
      if (val == true) {
        this.isDropDownBtnClicked = false;
        this.isDropDownBtnsShow = false;
      }
    });

    this.isDropDownBtnsClosed.subscribe((val) => {
      this.isDropDownBtnsClosedVal = val;
    });
  }

  dropDownBtnStyles() {
    if (this.isDropDownBtnClicked == true) {
      this.isDropDownBtnsClosed.next(false);
      return "dropdown-services-opened";
    } else {
      setTimeout(() => {
        this.isDropDownBtnsClosed.next(true);
      }, 500);

      if (this.isDropDownBtnsClosedVal == true) {
        return "dropdown-services";
      } else {
        return "dropdown-services-closing";
      }
    }
  }

  ngOnInit() {
    this.baseUrl = this.router.url.split("?")[0];
    if (this.baseUrl == "/requests") {
      var req_page_type = this.router.url.split("&")[1].split("=")[1];
      if (req_page_type != "my-requests") {
        this.dropDownBtnClick();
      }
    }
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

  requestActiveCheck(req) {
    this.baseUrl = this.router.url.split("?")[0];

    if (req == this.baseUrl) {
      return "subMenu-dropdown-active";
    } else {
      return "subMenu-dropdown";
    }

    // if (this.baseUrl != "/requests") {
    //   return "subMenu-dropdown";
    // } else {
    //   var req_page_type = this.router.url.split("&")[1].split("=")[1];
    //   if (req_page_type == req) {
    //     return "subMenu-dropdown-active";
    //   } else {
    //     return "subMenu-dropdown";
    //   }
    // }
  }

  navigateToRequests(req) {
    if (req == "maintenance") {
      this.router.navigate(["/maintenance-requests"], {
        queryParams: { uid: this.userId },
      });
    } else if (req == "tenant-move-in") {
      this.router.navigate(["/tenant-move-in-requests"], {
        queryParams: { uid: this.userId },
      });
    } else if (req == "tenant-move-out") {
      this.router.navigate(["/tenant-move-out-requests"], {
        queryParams: { uid: this.userId },
      });
    } else if (req == "payment") {
      this.router.navigate(["/payment-requests"], {
        queryParams: { uid: this.userId },
      });
    } else if (req == "conditioning") {
      this.router.navigate(["/conditioning-requests"], {
        queryParams: { uid: this.userId },
      });
    }

    if (this.otherServices.requestsToggle.getValue() == false) {
      this.otherServices.requestsToggle.next(true);

      setTimeout(() => {
        this.otherServices.requestsToggle.next(false);
      }, 0);
    } else {
      this.otherServices.requestsToggle.next(false);

      setTimeout(() => {
        this.otherServices.requestsToggle.next(true);
      }, 0);
    }
  }
}
