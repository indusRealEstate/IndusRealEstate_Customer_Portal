import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { DocUploadDialogRegister } from "app/components/dialog/dialog";
import { ViewDocDialogService } from "app/components/view-doc-dialog-service-temp/view-doc-dialog-service";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";

@Component({
  selector: "service_recap",
  templateUrl: "./service_recap.html",
  styleUrls: ["./service_recap.scss"],
})
export class ServiceRecapComponent implements OnInit {
  isUserSignedIn: boolean = false;

  payment_type_not_selected: boolean = false;
  document_is_missing: boolean = false;

  is_request_processing: boolean = false;

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

  user_auth: any;

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
    private apiService: ApiService,
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
      // console.log(this.service_amount)
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
      this.landlord = null;
    } else {
      this.landlord = JSON.parse(this.decodeToken(this.landlord_raw));
      this.tenant = null;
      console.log(this.landlord);
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

  getRecapHeading() {
    if (
      this.currentServicePageType == "payment-tenant" ||
      this.currentServicePageType == "payment-landlord"
    ) {
      return "Make a Payment > Payment Recap";
    } else if (this.currentServicePageType == "inspection") {
      return "Make an Inspection Request > Recap";
    } else if (this.currentServicePageType == "maintenance") {
      return "Make a Maintenance Request > Recap";
    } else if (this.currentServicePageType == "tenant-move-in") {
      return "Make a Move-in Request > Recap";
    } else if (this.currentServicePageType == "tenant-move-out") {
      return "Make a Move-out Request > Recap";
    } else if (this.currentServicePageType == "conditioning") {
      return "Make a Property Conditioning Request > Recap";
    }
  }

  getOverviewHeading() {
    if (
      this.currentServicePageType == "payment-tenant" ||
      this.currentServicePageType == "payment-landlord"
    ) {
      return "Payment Overview";
    } else if (this.currentServicePageType == "inspection") {
      return "Inspection Overview";
    } else if (this.currentServicePageType == "maintenance") {
      return "Maintenance Overview";
    } else if (this.currentServicePageType == "tenant-move-in") {
      return "Move-in Overview";
    } else if (this.currentServicePageType == "tenant-move-out") {
      return "Move-out Overview";
    } else if (this.currentServicePageType == "conditioning") {
      return "Property Conditioning Overview";
    }
  }

  getRequestTitleHeading() {
    if (
      this.currentServicePageType == "payment-tenant" ||
      this.currentServicePageType == "payment-landlord"
    ) {
      return "Payment Title";
    } else if (this.currentServicePageType == "inspection") {
      return "Inspection Title";
    } else if (this.currentServicePageType == "maintenance") {
      return "Maintenance Title";
    } else if (this.currentServicePageType == "tenant-move-in") {
      return "Move-in Title";
    } else if (this.currentServicePageType == "tenant-move-out") {
      return "Move-out Title";
    } else if (this.currentServicePageType == "conditioning") {
      return "Property Conditioning Title";
    }
  }
  getRequestReciept() {
    if (
      this.currentServicePageType == "payment-tenant" ||
      this.currentServicePageType == "payment-landlord"
    ) {
      return "Payment Receipt";
    } else if (this.currentServicePageType == "inspection") {
      return "Inspection Receipt";
    } else if (this.currentServicePageType == "maintenance") {
      return "Maintenance Receipt";
    } else if (this.currentServicePageType == "tenant-move-in") {
      return "Move-in Receipt";
    } else if (this.currentServicePageType == "tenant-move-out") {
      return "Move-out Receipt";
    } else if (this.currentServicePageType == "conditioning") {
      return "Property Conditioning Receipt";
    }
  }

  getDocumentName() {
    if (
      this.currentServicePageType == "payment-tenant" ||
      this.currentServicePageType == "payment-landlord"
    ) {
      return "Payment Document";
    } else if (this.currentServicePageType == "inspection") {
      return "Inspection Document";
    } else if (this.currentServicePageType == "maintenance") {
      return "Maintenance Document";
    } else if (this.currentServicePageType == "tenant-move-in") {
      return "Move-in Document";
    } else if (this.currentServicePageType == "tenant-move-out") {
      return "Move-out Document";
    } else if (this.currentServicePageType == "conditioning") {
      return "Property Conditioning Document";
    }
  }

  submitServiceReq() {
    if (
      this.currentServicePageType == "payment-tenant" ||
      this.currentServicePageType == "payment-landlord"
    ) {
      this.paymentReqFinished();
    } else {
      this.otherReqFinished(this.currentServicePageType);
    }
  }

  otherReqFinished(req_type: any) {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    var req_id = this.generateRandomID();

    var data = this.getReqData(req_type, user[0]["id"], req_id);

    this.apiService
      .requestService(JSON.stringify({ data }))
      .subscribe((val) => {
        console.log(val);
      });

    // console.log(this.uploadedDoc);
    this.apiService
      .uploadReqDocInServer(
        JSON.stringify({
          req: this.uploadedDoc["data"],
          reqName: req_id,
          ext: this.uploadedDoc["ext"],
        })
      )
      .subscribe((e) => {
        console.log(e);
      });

    this.is_request_processing = true;
    setTimeout(() => {
      this.router.navigate(["/service-temp"], {
        queryParams: {
          uid: user[0]["id"],
          service_type: this.currentServicePageType,
        },
      });

      setTimeout(() => {
        this.is_request_processing = false;
      }, 100);
    }, 3000);
  }

  getReqData(req_type, userId, req_id) {
    if (req_type == "inspection") {
      var request_client_id_tenant = new String(
        this.tenant.profile_photo
      ).split(".")[0];
    } else {
      var request_client_id_landlord = new String(
        this.landlord.profile_photo
      ).split(".")[0];
    }
    switch (req_type) {
      case "inspection":
        return {
          user_id: userId,
          req_to_id: request_client_id_tenant,
          property_id: this.tenant.property_id,
          request_no: req_id,
          request_type: "INSPECTION_REQ",
          request_title: "Request for Inspection",
          details: "lorem ipsum",
          doc_path: `${req_id}.${this.uploadedDoc["ext"]}`,
          status: "pending",
          flag: 0,
          archive: 0,
          spam: 0,
          issue_date: this.getCurrentDate(),
        };

      case "maintenance":
        return {
          user_id: userId,
          req_to_id: request_client_id_landlord,
          property_id: this.landlord.property_id,
          request_no: req_id,
          request_type: "MAINTENANCE_REQ",
          request_title: "Request for Maintenance",
          details: "lorem ipsum",
          doc_path: `${req_id}.${this.uploadedDoc["ext"]}`,
          status: "pending",
          flag: 0,
          archive: 0,
          spam: 0,
          issue_date: this.getCurrentDate(),
        };

      case "tenant-move-in":
        return {
          user_id: userId,
          req_to_id: request_client_id_landlord,
          property_id: this.landlord.property_id,
          request_no: req_id,
          request_type: "TENANT_MOVE_IN",
          request_title: "Request for Move-in",
          details: "lorem ipsum",
          doc_path: `${req_id}.${this.uploadedDoc["ext"]}`,
          status: "pending",
          flag: 0,
          archive: 0,
          spam: 0,
          issue_date: this.getCurrentDate(),
        };

      case "tenant-move-out":
        return {
          user_id: userId,
          req_to_id: request_client_id_landlord,
          property_id: this.landlord.property_id,
          request_no: req_id,
          request_type: "TENANT_MOVE_OUT",
          request_title: "Request for Move-out",
          details: "lorem ipsum",
          doc_path: `${req_id}.${this.uploadedDoc["ext"]}`,
          status: "pending",
          flag: 0,
          archive: 0,
          spam: 0,
          issue_date: this.getCurrentDate(),
        };
      case "conditioning":
        return {
          user_id: userId,
          req_to_id: request_client_id_landlord,
          property_id: this.landlord.property_id,
          request_no: req_id,
          request_type: "CONDITIONING_REQ",
          request_title: "Request for Property Conditioning",
          details: "lorem ipsum",
          doc_path: `${req_id}.${this.uploadedDoc["ext"]}`,
          status: "pending",
          flag: 0,
          archive: 0,
          spam: 0,
          issue_date: this.getCurrentDate(),
        };
    }
  }

  paymentReqFinished() {
    if (this.selectedPayment == undefined || this.selectedPayment == null) {
      this.payment_type_not_selected = true;

      setTimeout(() => {
        this.payment_type_not_selected = false;
      }, 3000);
    } else if (this.uploadedDoc == undefined || this.uploadedDoc == null) {
      this.document_is_missing = true;

      setTimeout(() => {
        this.document_is_missing = false;
      }, 3000);
    } else {
      var userData = localStorage.getItem("currentUser");
      var user = JSON.parse(userData);

      var req_id = this.generateRandomID();

      if (this.currentServicePageType == "payment-landlord") {
        var request_client_id_tenant = new String(
          this.tenant.profile_photo
        ).split(".")[0];
        var data = {
          user_id: user[0]["id"],
          request_type: "PAYMENT",
          request_id: req_id,
          req_to_id: request_client_id_tenant,
          payment_purpose: this.service_application_type,
          amount: this.service_amount,
          payment_method: this.selectedPayment,
          payment_doc_path: `${req_id}.${this.uploadedDoc["ext"]}`,
          property_id: this.tenant.property_id,
          details: "lorem ipsum",
          status: "pending",
          flag: 0,
          archive: 0,
          spam: 0,
          issue_date: this.getCurrentDate(),
        };
      } else if (this.currentServicePageType == "payment-tenant") {
        var request_client_id_landlord = new String(
          this.landlord.profile_photo
        ).split(".")[0];
        var data = {
          user_id: user[0]["id"],
          request_type: "PAYMENT",
          request_id: req_id,
          req_to_id: request_client_id_landlord,
          payment_purpose: this.service_application_type,
          amount: this.service_amount,
          payment_method: this.selectedPayment,
          payment_doc_path: `${req_id}.${this.uploadedDoc["ext"]}`,
          property_id: this.landlord.property_id,
          details: "lorem ipsum",
          status: "pending",
          flag: 0,
          archive: 0,
          spam: 0,
          issue_date: this.getCurrentDate(),
        };
      }

      this.apiService
        .requestPaymentService(JSON.stringify({ data }))
        .subscribe((val) => {
          console.log(val);
        });

      // console.log(this.uploadedDoc);
      this.apiService
        .uploadReqDocInServer(
          JSON.stringify({
            req: this.uploadedDoc["data"],
            reqName: req_id,
            ext: this.uploadedDoc["ext"],
          })
        )
        .subscribe((e) => {
          console.log(e);
        });

      this.is_request_processing = true;
      setTimeout(() => {
        this.router.navigate(["/service-temp"], {
          queryParams: {
            uid: user[0]["id"],
            service_type: this.currentServicePageType,
          },
        });

        setTimeout(() => {
          this.is_request_processing = false;
        }, 100);
      }, 3000);
    }
  }

  generateRandomID() {
    return Math.floor(100000000000 + Math.random() * 900000000000);
  }

  getCurrentDate() {
    var date = new Date();

    var dateDay = Number(date.toISOString().split("T")[0].split("-")[2]);
    var currentDate =
      date.toISOString().split("T")[0].split("-")[0] +
      "-" +
      date.toISOString().split("T")[0].split("-")[1] +
      "-" +
      dateDay.toString();

    return currentDate;
  }
}
