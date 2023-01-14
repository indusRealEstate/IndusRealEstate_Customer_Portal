import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { Owner_Move_out_Request_Stepper_First } from "./components/stepper_01/owner_move-out_request-first";
import { Owner_Move_out_Request_Stepper_Second } from "./components/stepper_02/owner_move-out_request-second";
import { Owner_Move_out_Request_Stepper_Third } from "./components/stepper_03/owner_move-out_request-third";
import { Owner_Move_out_Request_Stepper_Fourth } from "./components/stepper_04/owner_move-out_request-fourth";
import { Owner_Move_out_Request_Stepper_Fifth } from "./components/stepper_05/owner_move-out_request-fifth";
import { Owner_Move_out_Request_Stepper_Sixth } from "./components/stepper_06/owner_move-out_request-sixth";

@Component({
  selector: "owner_move-out_request",
  templateUrl: "./owner_move-out_request.component.html",
  styleUrls: ["./owner_move-out_request.component.scss"],
})
export class Owner_Move_out_Request implements OnInit {
  @ViewChild(Owner_Move_out_Request_Stepper_First)
  oneComponent: Owner_Move_out_Request_Stepper_First;
  @ViewChild(Owner_Move_out_Request_Stepper_Second)
  twoComponent: Owner_Move_out_Request_Stepper_Second;
  @ViewChild(Owner_Move_out_Request_Stepper_Third)
  threeComponent: Owner_Move_out_Request_Stepper_Third;
  @ViewChild(Owner_Move_out_Request_Stepper_Fourth)
  fourComponent: Owner_Move_out_Request_Stepper_Fourth;
  @ViewChild(Owner_Move_out_Request_Stepper_Fifth)
  fiveComponent: Owner_Move_out_Request_Stepper_Fifth;
  @ViewChild(Owner_Move_out_Request_Stepper_Sixth)
  sixComponent: Owner_Move_out_Request_Stepper_Sixth;
  @ViewChild(MatStepper) matStepper: MatStepper;

  id: number;
  selectedIndex: number;
  oneForm: FormGroup;
  twoForm: FormGroup;
  threeForm: FormGroup;
  fourForm: FormGroup;
  fiveForm: FormGroup;
  sixForm: FormGroup;

  //-------
  stateForm1: String = "";
  stateForm2: String;
  stateForm3: String;
  stateForm4: String;
  stateForm5: String;
  stateForm6: String;

  isUserSignedIn: boolean = false;

  constructor(
    private readonly route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.route.queryParams.subscribe((e) => {
      if (e == null) {
        router.navigate(["/owner-move-out-request"], {
          queryParams: { uid: user[0]["id"] },
        });
      } else if (e != user[0]["id"]) {
        router.navigate(["/owner-move-out-request"], {
          queryParams: { uid: user[0]["id"] },
        });
      }
    });
  }

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  stateDone() {
    this.stateForm1 = "done";
  }

  ngOnInit(): void {
    this.isUserSignOut();
    this.selectedIndex = 0;
  }

  ngAfterViewInit(): void {
    this.oneForm = this.oneComponent.form;
    this.twoForm = this.twoComponent.form;
    this.threeForm = this.threeComponent.form;
    this.fourForm = this.fourComponent.form;
    this.fiveForm = this.fiveComponent.form;
    this.sixForm = this.sixComponent.form;
  }
}
