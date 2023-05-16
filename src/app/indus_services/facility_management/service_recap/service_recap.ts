import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { DocUploadDialogRegister } from "app/components/dialog/dialog";
import { ViewDocDialogService } from "app/components/view-doc-dialog-service-temp/view-doc-dialog-service";
import { AuthenticationService } from "app/services/authentication.service";

@Component({
  selector: "service_recap",
  templateUrl: "./service_recap.html",
  styleUrls: ["./service_recap.scss"],
})
export class ServiceRecapComponent implements OnInit {
  isUserSignedIn: boolean = false;

  requestData: any;
  isLoading: boolean = false;
  previousUrl: string;

  selectedPayment: string;

  service_recap_token: string;
  service_application_type: string;
  service_amount: string;
  tenant_raw: string;
  landlord_raw: string;
  tenant: any;
  landlord: any;

  uploadedDoc: any;

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
    private dialog?: MatDialog
  ) {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
      var userData = localStorage.getItem("currentUser");
      var user = JSON.parse(userData);
      if (user[0]["auth_type"] != "admin") {
        this.isLoading = true;
        this.route.queryParams.subscribe((e) => {
          if (e == null) {
            router.navigate(["/404"]);
          } else if (e.uid != user[0]["id"]) {
            router.navigate(["/404"]);
          } else if (!this.servicePagesTypes.includes(e.service_type)) {
            router.navigate(["/404"]);
          } else {
            this.currentServicePageType = e.service_type;

            this.service_recap_token = e.token;
            if (
              e.service_type == "payment-landlord" ||
              e.service_type == "inspection"
            ) {
              this.tenant_raw = e.tenant;
            } else {
              this.landlord_raw = e.landlord;
            }

            // otherServices.servicePageToggle.subscribe((val) => {
            //   if (val == true) {
            //     // console.log("not okay");
            //     this.isLoading = true;
            //     this.ngOnInit();
            //   }
            // });
          }
        });
      } else {
        router.navigate([`/admin-dashboard`]);
      }
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  ngOnInit() {
    this.isLoading = false;

    this.service_application_type = this.decodeToken(
      this.service_recap_token.split("service_amount")[0]
    );

    if (
      this.currentServicePageType == "payment-tenant" ||
      this.currentServicePageType == "payment-landlord"
    ) {
      this.service_amount = this.decodeToken(
        this.service_recap_token.split("service_amount")[1]
      );
    } else {
      this.service_amount = "none";
    }

    var sessionStorageServiceDoc = JSON.parse(
      sessionStorage.getItem("service-req-doc")
    );
    this.uploadedDoc = sessionStorageServiceDoc["doc"];

    if (
      this.currentServicePageType == "payment-landlord" ||
      this.currentServicePageType == "inspection"
    ) {
      this.tenant = JSON.parse(this.decodeToken(this.tenant_raw));
    } else {
      this.landlord = JSON.parse(this.decodeToken(this.landlord_raw));
    }
  }

  decodeToken(input: string) {
    var type_1 = decodeURIComponent(input);
    return window.atob(type_1);
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
    sessionStorage.removeItem("service-req-doc");
  }

  finish() {
    sessionStorage.removeItem("service-req-doc");
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
        } else {
        }
      });
  }
}
