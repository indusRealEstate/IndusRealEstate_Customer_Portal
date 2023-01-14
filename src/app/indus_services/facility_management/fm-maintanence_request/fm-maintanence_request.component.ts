import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatStepper } from "@angular/material/stepper";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { FM_MaintananceRequest_Stepper_First } from "./components/stepper_01/fm-maintanence-first";
import { FM_MaintananceRequest_Stepper_Second } from "./components/stepper_02/fm-maintanence-second";
import { FM_MaintananceRequest_Stepper_Third } from "./components/stepper_03/fm-maintanence-third";
import { FM_MaintananceRequest_Stepper_Fourth } from "./components/stepper_04/fm-maintanence-fourth";
import { FM_MaintananceRequest_Stepper_Fifth } from "./components/stepper_05/fm-maintanence-fifth";
import { FM_MaintananceRequest_Stepper_Sixth } from "./components/stepper_06/fm-maintanence-sixth";

@Component({
  selector: "services-FM-maintanance",
  templateUrl: "./fm-maintanence_request.component.html",
  styleUrls: ["./fm-maintanence_request.component.scss"],
})
export class FM_MaintananceRequest implements OnInit {
  @ViewChild(FM_MaintananceRequest_Stepper_First)
  oneComponent: FM_MaintananceRequest_Stepper_First;
  @ViewChild(FM_MaintananceRequest_Stepper_Second)
  twoComponent: FM_MaintananceRequest_Stepper_Second;
  @ViewChild(FM_MaintananceRequest_Stepper_Third)
  threeComponent: FM_MaintananceRequest_Stepper_Third;
  @ViewChild(FM_MaintananceRequest_Stepper_Fourth)
  fourComponent: FM_MaintananceRequest_Stepper_Fourth;
  @ViewChild(FM_MaintananceRequest_Stepper_Fifth)
  fiveComponent: FM_MaintananceRequest_Stepper_Fifth;
  @ViewChild(FM_MaintananceRequest_Stepper_Sixth)
  sixComponent: FM_MaintananceRequest_Stepper_Sixth;
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
    private readonly activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute
  ) {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.route.queryParams.subscribe((e) => {
      if (e == null) {
        router.navigate(["/fm-maintanence-request"], {
          queryParams: { uid: user[0]["id"] },
        });
      } else if (e != user[0]["id"]) {
        router.navigate(["/fm-maintanence-request"], {
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
    this.activatedRoute.params.subscribe(async (params) => {
      this.id = +params?.id;
    });
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
