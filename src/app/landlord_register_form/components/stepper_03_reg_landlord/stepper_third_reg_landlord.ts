import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { DocUploadDialogRegister } from "app/components/dialog/dialog";

@Component({
  selector: "stepper-three-landlord-reg",
  styleUrls: ["./stepper_third_reg_landlord.scss"],
  templateUrl: "./stepper_third_reg_landlord.html",
})
export class StepperLandlordRegisterThird {
  form: FormGroup;

  passPortPics: any[] = [];
  emiratesIDPics: any[] = [];
  ownerShipDoc: any = "";
  salesDeedDoc: any = "";

  constructor(private dialog?: MatDialog) {}

  ngOnInit(): void {}

  openDialog(upload: any) {
    this.dialog
      .open(DocUploadDialogRegister, {
        width: "700px",
        height: "450px",
        data: { upload: upload, auth: "landlord" },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res["doc"] == "passport") {
          for (let e of res["data"]) {
            this.passPortPics.push(e);
          }
        } else if (res["doc"] == "emirates_id") {
          for (let e of res["data"]) {
            this.emiratesIDPics.push(e);
          }
        } else if (res["doc"] == "sales_deed") {
          this.salesDeedDoc = res["data"];
        } else {
          this.ownerShipDoc = res["data"];
        }
      });
  }

  clearDocs(docName) {
    if (docName == "passport") {
      this.passPortPics.length = 0;
    } else if (docName == "emirates_id") {
      this.emiratesIDPics.length = 0;
    } else if (docName == "sales_deed") {
      this.salesDeedDoc = "";
    } else {
      this.ownerShipDoc = "";
    }
  }
}
