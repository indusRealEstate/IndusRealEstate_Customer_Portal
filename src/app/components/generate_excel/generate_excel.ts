import { CurrencyPipe } from "@angular/common";
import { HttpEvent, HttpEventType } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AdminService } from "app/services/admin.service";
import { UnitsService } from "app/services/units.service";
import { last, map, tap } from "rxjs";
import * as XLSX from "xlsx-js-style";

@Component({
  selector: "generate_excel",
  styleUrls: ["./generate_excel.scss"],
  templateUrl: "./generate_excel.html",
})
export class GenerateExcelDialog implements OnInit {
  type: any = "";
  total_count: any = "Loading..";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<GenerateExcelDialog>,
    public adminService: AdminService,
    public unitService: UnitsService
  ) {
    this.type = data;

    adminService
      .getTablesCount(JSON.stringify({ type: data }))
      .subscribe((res: any) => {
        this.total_count = res;
        if (res > 5000) {
          this.generateCount.push({ value: "10" });
          this.generateCount.push({ value: "50" });
          this.generateCount.push({ value: "100" });
          this.generateCount.push({ value: "500" });
          this.generateCount.push({ value: "1000" });
          this.generateCount.push({ value: "5000" });
        } else if (res > 1000) {
          this.generateCount.push({ value: "10" });
          this.generateCount.push({ value: "50" });
          this.generateCount.push({ value: "100" });
          this.generateCount.push({ value: "500" });
          this.generateCount.push({ value: "1000" });
        } else if (res > 500) {
          this.generateCount.push({ value: "10" });
          this.generateCount.push({ value: "50" });
          this.generateCount.push({ value: "100" });
          this.generateCount.push({ value: "500" });
        } else if (res > 100) {
          this.generateCount.push({ value: "10" });
          this.generateCount.push({ value: "50" });
          this.generateCount.push({ value: "100" });
        } else if (res > 50) {
          this.generateCount.push({ value: "10" });
          this.generateCount.push({ value: "50" });
        } else if (res > 10) {
          this.generateCount.push({ value: "10" });
        }
      });

    this.unitService.getallUnitTypes().subscribe((val: any[]) => {
      val.forEach((unit_type) => {
        this.unitTypes.push({
          value: unit_type.id,
          viewValue: unit_type.type,
        });
      });
    });
  }

  count_not_selected: boolean = false;

  selected_count: any;

  fetching_progress: any;
  fetching: boolean = false;
  data_fetched_successfully: boolean = false;

  generateCount: any[] = [{ value: "Full" }];

  unitTypes: any[] = [];

  ngOnInit() {}

  getUserType(user_type) {
    switch (user_type) {
      case "tenant":
        return "Tenant";
      case "owner":
        return "Landlord";
      case "new_user":
        return "New User";
      default:
        break;
    }
  }

  submit() {
    if (this.selected_count == undefined) {
      this.count_not_selected = true;

      setTimeout(() => {
        this.count_not_selected = false;
      }, 3000);
    } else {
      this.fetching = true;
      this.adminService
        .getDataForExcel(
          JSON.stringify({ type: this.type, limit: this.selected_count })
        )
        .pipe(
          map((event) => this.getEventMessage(event)),
          tap((message: any) => {
            if (message.result == "success") {
              this.data_fetched_successfully = true;
            }
          }),
          last()
        )
        .subscribe((res: any) => {
          if (this.data_fetched_successfully == true) {
            // console.log(res);
            var data: any[] = [];
            var cols: any[];
            if (this.type == "property") {
              res.data.forEach((prop) => {
                data.push({
                  "PROPERTY NAME": prop.property_name,
                  "PROPERTY ADDRESS": prop.address,
                  "PROPERTY TYPE": prop.property_type,
                  LOCALITY: prop.locality_name,
                  "TOTAL UNITS": prop.no_of_units,
                  "PROPERTY IN CHARGE": prop.property_in_charge,
                });
              });

              cols = [
                { wch: 30 },
                { wch: 40 },
                { wch: 30 },
                { wch: 30 },
                { wch: 35 },
                { wch: 40 },
              ];
            } else if (this.type == "unit") {
              res.data.forEach((prop) => {
                data.push({
                  "UNIT NO.": prop.unit_no,
                  "PROPERTY NAME": prop.property_name,
                  "UNIT TYPE": this.unitTypes.find(
                    (typ) => typ.value == prop.unit_type
                  ).viewValue,
                  "PREMISES NO.": prop.premises_no,
                  "UNIT SIZE": prop.size,
                  STATUS: prop.status,
                  "NO. OF PARKING": prop.no_of_parking,
                });
              });

              cols = [
                { wch: 30 },
                { wch: 40 },
                { wch: 30 },
                { wch: 30 },
                { wch: 35 },
                { wch: 40 },
                { wch: 40 },
              ];
            } else if (this.type == "user") {
              res.data.forEach((prop) => {
                data.push({
                  NAME: prop.name,
                  "USER TYPE": this.getUserType(prop.user_type),
                  "MOBILE NO.": `${prop.country_code_number} ${prop.mobile_number}`,
                  EMAIL: prop.email,
                  "ALTERNATIVE MOBILE":
                    prop.alternative_mobile_number != "0"
                      ? `${prop.country_code_alternative_number} ${prop.alternative_mobile_number}`
                      : "-",
                  "ALTERNATIVE EMAIL":
                    prop.alternative_email != "" ? prop.alternative_email : "-",
                  "ID TYPE": prop.id_type,
                  "ID NUMBER": prop.id_number,
                  GENDER: prop.gender,
                  NATIONALITY: prop.nationality,
                  "DATE OF BIRTH": prop.dob,
                  "ALLOCATED UNIT":
                    prop.user_type == "tenant"
                      ? JSON.parse(prop.allocated_unit)["address"]
                      : "-",
                  "LANDLORD PLAN": prop.user_type == "owner" ? prop.plan : "-",
                });
              });

              cols = [
                { wch: 30 },
                { wch: 40 },
                { wch: 30 },
                { wch: 30 },
                { wch: 35 },
                { wch: 40 },
                { wch: 40 },
                { wch: 40 },
                { wch: 40 },
                { wch: 40 },
                { wch: 40 },
                { wch: 40 },
                { wch: 40 },
              ];
            } else if (this.type == "contract") {
              res.data.forEach((prop) => {
                data.push({
                  "UNIT NO.": prop.unit_no,
                  "PROPERTY NAME": prop.property_name,
                  "OWNER NAME": prop.owner_name,
                  "TENANT NAME": prop.tenant_name,
                  "CONTRACT START": prop.contract_start,
                  "CONTRACT END": prop.contract_end,
                  PURPOSE: prop.purpose,
                  "ANNUAL RENT": Intl.NumberFormat("fr-fr", {
                    style: "currency",
                    currency: "AED",
                  }).format(prop.yearly_amount),
                  "SECURITY DEPOSIT": Intl.NumberFormat("fr-fr", {
                    style: "currency",
                    currency: "AED",
                  }).format(prop.security_deposit),
                  STATUS: prop.status,
                  "CHILLER INCLUSIVE": prop.chiller == "1" ? "Yes" : "No",
                  "DEWA INCLUSIVE": prop.dewa == "1" ? "Yes" : "No",
                  "GAS INCLUSIVE": prop.gas == "1" ? "Yes" : "No",
                });
              });

              cols = [
                { wch: 30 },
                { wch: 40 },
                { wch: 30 },
                { wch: 30 },
                { wch: 35 },
                { wch: 40 },
                { wch: 40 },
                { wch: 40 },
                { wch: 40 },
                { wch: 40 },
                { wch: 40 },
                { wch: 40 },
                { wch: 40 },
              ];
            }

            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

            ws["!cols"] = cols;
            ws["!rows"] = [{ hpt: 30 }];
            for (var i in ws) {
              // console.log(ws[i]);
              if (typeof ws[i] != "object") continue;
              let cell = XLSX.utils.decode_cell(i);
              ws[i].s = {
                // styling for all cells
                font: {
                  name: "arial",
                },
                alignment: {
                  vertical: "center",
                  horizontal: "center",
                  wrapText: "1", // any truthy value here
                },
                border: {
                  right: {
                    style: "thin",
                    color: "000000",
                  },
                  left: {
                    style: "thin",
                    color: "000000",
                  },
                },
              };
              if (cell.r == 0) {
                // first row
                ws[i].s = {
                  font: {
                    name: "Calibri",
                    sz: "14",
                    bold: true,
                  },
                  border: {
                    bottom: {
                      style: "thin",
                      color: "000000",
                    },
                  },
                  fill: { fgColor: { rgb: "f8e7b4" } },
                  alignment: {
                    vertical: "center",
                    horizontal: "center",
                    wrapText: "1", // any truthy value here
                  },
                };
              }
              if (cell.r % 2) {
                // every other row
                ws[i].s.fill = {
                  // background color
                  patternType: "solid",
                  fgColor: { rgb: "fef7e3" },
                  bgColor: { rgb: "fef7e3" },
                };
              }
            }
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

            if (this.type == "property") {
              XLSX.writeFile(wb, "Total-Properties.xlsx");
            } else if (this.type == "unit") {
              XLSX.writeFile(wb, "Total-Units.xlsx");
            } else if (this.type == "user") {
              XLSX.writeFile(wb, "Total-Users.xlsx");
            } else if (this.type == "contract") {
              XLSX.writeFile(wb, "Total-Contracts.xlsx");
            }
          }
        });
    }
  }

  onCloseDialog(response: boolean) {
    this.dialogRef.close(response);
  }

  closeDialogWithoutSaving() {
    this.dialogRef.close();
  }

  private getEventMessage(event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.Sent:
        return `Fetching data`;

      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        const percentDone = event.total
          ? Math.round((100 * event.loaded) / event.total)
          : 0;

        this.fetching_progress = percentDone;
        return `data is ${percentDone}% fetched.`;

      case HttpEventType.Response:
        this.fetching = false;
        return {
          result: "success",
          data: event.body,
        };

      default:
        return `fetching event: ${event.type}.`;
    }
  }
}
