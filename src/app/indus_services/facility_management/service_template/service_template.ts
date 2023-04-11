import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "app/services/authentication.service";
import { OtherServices } from "app/services/other.service";
import { UserService } from "app/services/user.service";

@Component({
  selector: "service_template",
  templateUrl: "./service_template.html",
  styleUrls: ["./service_template.scss"],
})
export class ServiceTemplateComponent implements OnInit {
  isUserSignedIn: boolean = false;

  requestData: any;
  isLoading: boolean = false;
  previousUrl: string;

  applicationNotChoosed: boolean = false;
  amountNotEntered: boolean = false;

  currentServicePageType: any;
  servicePagesTypes: string[] = [
    "payment-tenant",
    "payment-landlord",
    "maintenance",
    "tenant-move-in",
    "tenant-move-out",
    "conditioning",
    "inspection",
  ];

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private otherServices: OtherServices,
    private userServices: UserService
  ) {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
      var userData = localStorage.getItem("currentUser");
      var user = JSON.parse(userData);
      if (user[0]["auth_type"] != "admin") {
        this.route.queryParams.subscribe((e) => {
          if (e == null) {
            router.navigate(["/404"]);
          } else if (e.uid != user[0]["id"]) {
            router.navigate(["/404"]);
          } else if (!this.servicePagesTypes.includes(e.service_type)) {
            router.navigate(["/404"]);
          } else {
            this.currentServicePageType = e.service_type;

            otherServices.servicePageToggle.subscribe((val) => {
              if (val == true) {
                // console.log("not okay");
                this.isLoading = true;
                this.ngOnInit();
              }
            });
          }
        });
      } else {
        router.navigate(["/admin-dashboard"]);
      }
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  service_amount: any;

  selectedServiceSubType: any;
  serviceSubTypePaymentTenant: any[] = [
    "tenant_payment_type_1",
    "tenant_payment_type_2",
    "tenant_payment_type_3",
  ];
  serviceSubTypePaymentLandlord: any[] = [
    "landlord_payment_type_1",
    "landlord_payment_type_2",
    "landlord_payment_type_3",
  ];
  serviceSubTypeFM_Maintenance: any[] = [
    "maintenance_type_1",
    "maintenance_type_2",
    "maintenance_type_3",
  ];
  serviceSubTypeTenant_move_in: any[] = [
    "tenant_move_in_type_1",
    "tenant_move_in_type_2",
    "tenant_move_in_type_3",
  ];
  serviceSubTypeTenant_move_out: any[] = [
    "tenant_move_out_type_1",
    "tenant_move_out_type_2",
    "tenant_move_out_type_3",
  ];
  serviceSubTypeProperty_conditioning: any[] = [
    "property_conditioning_type_1",
    "property_conditioning_type_2",
    "property_conditioning_type_3",
  ];
  serviceSubTypeProperty_inspection: any[] = [
    "inspection_type_1",
    "inspection_type_2",
    "inspection_type_3",
  ];

  ngOnInit() {
    this.isLoading = false;
  }

  convertToBase64(input: string) {
    let base64EncodedString = window.btoa(input);
    return encodeURIComponent(base64EncodedString);
  }

  nextBtnClicked() {
    if (this.selectedServiceSubType == null) {
      this.applicationNotChoosed = true;

      setTimeout(() => {
        this.applicationNotChoosed = false;
      }, 3000);
    } else if (this.service_amount == null) {
      this.amountNotEntered = true;

      setTimeout(() => {
        this.amountNotEntered = false;
      }, 3000);
    } else {
      var res_type = this.convertToBase64(this.selectedServiceSubType);
      var res_amount = this.convertToBase64(this.service_amount);
      var param = res_type + "service_amount" + res_amount;

      var userData = localStorage.getItem("currentUser");
      var user = JSON.parse(userData);
      this.router.navigate(["/service-recap"], {
        queryParams: {
          uid: user[0]["id"],
          service_type: this.currentServicePageType,
          token: param,
        },
      });
    }
  }
}
