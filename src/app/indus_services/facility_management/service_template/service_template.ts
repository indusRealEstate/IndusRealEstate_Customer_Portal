import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { DocUploadDialogRegister } from "app/components/dialog/dialog";
import { ViewDocDialogService } from "app/components/view-doc-dialog-service-temp/view-doc-dialog-service";
import { ViewDocDialog } from "app/components/view-doc-dialog/view-doc-dialog";
import { ApiService } from "app/services/api.service";
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
  docNotUploaded: boolean = false;
  tenantNotChoosed: boolean = false;

  uploadedDoc: any;

  user_auth: any;

  tenantsLoading: boolean = false;

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
    private apiService: ApiService,
    private userServices: UserService,
    private dialog?: MatDialog
  ) {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
      this.tenantsLoading = true;
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
                sessionStorage.removeItem("service-req-doc");
                this.uploadedDoc = null;
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

  tenantChoose: any;
  allTenants: any[];

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

  usrImgPath: any = "https://indusre.app/api/upload/img/user/";

  ngOnInit() {
    this.tenantsLoading = true;
    this.isLoading = false;

    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.user_auth = user[0]["auth_type"];

    this.apiService
      .getLandlordTenants(user[0]["id"])
      .subscribe((data: any[]) => {
        this.allTenants = data;

        setTimeout(() => {
          this.tenantsLoading = false;
        }, 500);
      });
  }

  convertToBase64(input: string) {
    let base64EncodedString = window.btoa(input);
    return encodeURIComponent(base64EncodedString);
  }

  // @ViewChild('')

  selectTenant(event: any) {
    // event.value = "1";
    console.log(event);
  }

  nextBtnClickedTenant() {
    if (this.selectedServiceSubType == null) {
      this.applicationNotChoosed = true;

      setTimeout(() => {
        this.applicationNotChoosed = false;
      }, 3000);
    } else if (this.currentServicePageType == "payment-tenant") {
      if (this.service_amount == null) {
        this.amountNotEntered = true;

        setTimeout(() => {
          this.amountNotEntered = false;
        }, 3000);
      } else if (this.uploadedDoc == null || this.uploadedDoc == undefined) {
        this.docNotUploaded = true;

        setTimeout(() => {
          this.docNotUploaded = false;
        }, 3000);
      } else {
        var userData = localStorage.getItem("currentUser");
        var user = JSON.parse(userData);
        var res_type = this.convertToBase64(this.selectedServiceSubType);
        var res_amount = this.convertToBase64(this.service_amount);
        var param = res_type + "service_amount" + res_amount;

        this.apiService.getLandlordDetails(user[0]["id"]).subscribe((val) => {
          var landlord_details = val[0];

          this.router.navigate(["/service-recap"], {
            queryParams: {
              uid: user[0]["id"],
              service_type: this.currentServicePageType,
              token: param,
              landlord: this.convertToBase64(JSON.stringify(landlord_details)),
            },
          });
        });

        sessionStorage.setItem(
          "service-req-doc",
          JSON.stringify({
            doc: this.uploadedDoc,
          })
        );
      }
    } else if (this.uploadedDoc == null || this.uploadedDoc == undefined) {
      this.docNotUploaded = true;

      setTimeout(() => {
        this.docNotUploaded = false;
      }, 3000);
    } else {
      var userData = localStorage.getItem("currentUser");
      var user = JSON.parse(userData);

      var res_type = this.convertToBase64(this.selectedServiceSubType);
      var res_amount = this.convertToBase64(this.service_amount);
      var param = res_type + "service_amount" + res_amount;

      this.apiService.getLandlordDetails(user[0]["id"]).subscribe((val) => {
        var landlord_details = val[0];

        this.router.navigate(["/service-recap"], {
          queryParams: {
            uid: user[0]["id"],
            service_type: this.currentServicePageType,
            token: param,
            landlord: this.convertToBase64(JSON.stringify(landlord_details)),
          },
        });
      });

      sessionStorage.setItem(
        "service-req-doc",
        JSON.stringify({
          doc: this.uploadedDoc,
        })
      );
    }
  }

  nextBtnClicked() {
    if (this.selectedServiceSubType == null) {
      this.applicationNotChoosed = true;

      setTimeout(() => {
        this.applicationNotChoosed = false;
      }, 3000);
    } else if (this.currentServicePageType == "payment-landlord") {
      if (this.service_amount == null) {
        this.amountNotEntered = true;

        setTimeout(() => {
          this.amountNotEntered = false;
        }, 3000);
      } else if (this.uploadedDoc == null || this.uploadedDoc == undefined) {
        this.docNotUploaded = true;

        setTimeout(() => {
          this.docNotUploaded = false;
        }, 3000);
      } else if (this.tenantChoose == null || this.tenantChoose == undefined) {
        this.tenantNotChoosed = true;

        setTimeout(() => {
          this.tenantNotChoosed = false;
        }, 3000);
      } else {
        var res_type = this.convertToBase64(this.selectedServiceSubType);
        var res_amount = this.convertToBase64(this.service_amount);
        var param = res_type + "service_amount" + res_amount;

        var tenant_details = this.convertToBase64(
          JSON.stringify(this.tenantChoose)
        );

        var userData = localStorage.getItem("currentUser");
        var user = JSON.parse(userData);

        sessionStorage.setItem(
          "service-req-doc",
          JSON.stringify({
            doc: this.uploadedDoc,
          })
        );

        this.router.navigate(["/service-recap"], {
          queryParams: {
            uid: user[0]["id"],
            service_type: this.currentServicePageType,
            token: param,
            tenant: tenant_details,
          },
        });
      }
    } else if (this.uploadedDoc == null || this.uploadedDoc == undefined) {
      this.docNotUploaded = true;

      setTimeout(() => {
        this.docNotUploaded = false;
      }, 3000);
    } else if (this.tenantChoose == null || this.tenantChoose == undefined) {
      this.tenantNotChoosed = true;

      setTimeout(() => {
        this.tenantNotChoosed = false;
      }, 3000);
    } else {
      var res_type = this.convertToBase64(this.selectedServiceSubType);
      var res_amount = this.convertToBase64(this.service_amount);
      var param = res_type + "service_amount" + res_amount;

      var tenant_details = this.convertToBase64(
        JSON.stringify(this.tenantChoose)
      );

      var userData = localStorage.getItem("currentUser");
      var user = JSON.parse(userData);

      sessionStorage.setItem(
        "service-req-doc",
        JSON.stringify({
          doc: this.uploadedDoc,
        })
      );

      this.router.navigate(["/service-recap"], {
        queryParams: {
          uid: user[0]["id"],
          service_type: this.currentServicePageType,
          token: param,
          tenant: tenant_details,
        },
      });
    }
  }

  openUploadDocDialog(upload: any) {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.dialog
      .open(DocUploadDialogRegister, {
        width: "700px",
        height: "450px",
        data: { upload: upload, auth: user[0]["auth_type"] },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res != undefined) {
          this.uploadedDoc = res.data;
          setTimeout(() => {
            console.log(this.uploadedDoc);
          }, 500);
        } else {
        }
      });
  }

  viewDoc() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.dialog.open(ViewDocDialogService, {
      data: {
        doc: this.uploadedDoc,
      },
      width: "1300px",
      height: "700px",
    });
  }

  removeDoc() {
    this.uploadedDoc = null;
  }
}
