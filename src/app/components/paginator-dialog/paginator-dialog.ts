import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { PropertiesService } from "app/services/properties.service";
import { TableSearchBarComponent } from "../searchbar-table/searchbar-table";
import { MatPaginator } from "@angular/material/paginator";
import { UserService } from "app/services/user.service";
import { UnitsService } from "app/services/units.service";

@Component({
  selector: "paginator-dialog",
  styleUrls: ["./paginator-dialog.scss"],
  templateUrl: "./paginator-dialog.html",
})
export class PaginatorDialog implements OnInit {
  type: any = "";
  prop_id: any;
  user_type: any;
  tableLength: number = 0;
  matTableDataSource: MatTableDataSource<any>;

  payment: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(TableSearchBarComponent) searchBar: TableSearchBarComponent;

  @ViewChild("table") table: ElementRef;

  pageChangerLoading: boolean = false;
  isContentLoading: boolean = true;

  displayedColumns: string[] = ["name", "address"];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PaginatorDialog>,
    public propertyService: PropertiesService,
    public userService: UserService,
    public unitService: UnitsService
  ) {
    this.type = data.type;
    this.prop_id = data.prop;
    this.user_type = data.user_type;
    this.payment = data.payment;

    if (data.type == "property") {
      this.fetchData(data.type);
    } else if (data.type == "user") {
      this.fetchData(data.type);
    } else if (data.type == "unit") {
      this.fetchData(data.type);
    }
  }

  getTitle(type) {
    switch (type) {
      case "property":
        return "Property";
      case "user":
        return "User";
      case "unit":
        return "Unit";
      default:
        break;
    }
  }

  getUserType(user) {
    switch (user.user_type) {
      case "owner":
        return "Landlord";
      case "tenant":
        return "Tenant";
      case "new_user":
        return "New User";
      default:
        break;
    }
  }

  getRowClass(row) {
    if (this.type == "unit") {
      if (this.payment == undefined) {
        if (row.property_id != this.prop_id || row.status == "occupied") {
          return "mat-mdc-row-disabled";
        }
      } else {
        if (row.property_id != this.prop_id || row.status == "vacant") {
          return "mat-mdc-row-disabled";
        }
      }
    } else if (this.type == "user") {
      if (this.user_type == "owner") {
        if (row.user_type == "owner" || row.user_type == "new_user") {
          return "mat-mdc-row";
        } else {
          return "mat-mdc-row-disabled";
        }
      } else if (this.user_type == "tenant") {
        if (row.user_type == "new_user") {
          return "mat-mdc-row";
        } else {
          return "mat-mdc-row-disabled";
        }
      }
    } else {
      return "mat-mdc-row";
    }
  }

  ngOnInit() {}

  getLoaderHeight() {
    if (this.table != undefined) {
      return this.table["_elementRef"].nativeElement.offsetHeight - 20 + "px";
    }
  }

  pageChange(event) {
    this.pageChangerLoading = true;
    if (this.type == "property") {
      if (this.searchBar.searchText != "") {
        this.propertyService
          .getallPropertiesSearchPageChange(
            this.searchBar.searchText,
            event.pageSize,
            event.pageIndex + 1
          )
          .subscribe((va: any) => {
            this.matTableDataSource = new MatTableDataSource(va);
          })
          .add(() => {
            this.pageChangerLoading = false;
          });
      } else {
        this.propertyService
          .getAllPropertiesPagination(event.pageSize, event.pageIndex + 1)
          .subscribe((va: any) => {
            console.log(va);
            this.matTableDataSource = new MatTableDataSource(va.prop);
          })
          .add(() => {
            this.pageChangerLoading = false;
          });
      }
    } else if (this.type == "user") {
      this.pageChangerLoading = true;
      if (this.searchBar.searchText != "") {
        this.userService
          .getallUsersSearchPageChange(
            this.searchBar.searchText,
            event.pageSize,
            event.pageIndex + 1
          )
          .subscribe((va: any) => {
            this.matTableDataSource = new MatTableDataSource(va);
          })
          .add(() => {
            this.pageChangerLoading = false;
          });
      } else {
        this.userService
          .getAllUsersAdminPagination(event.pageSize, event.pageIndex + 1)
          .subscribe((va: any) => {
            console.log(va);
            this.matTableDataSource = new MatTableDataSource(va.users);
          })
          .add(() => {
            this.pageChangerLoading = false;
          });
      }
    } else if (this.type == "unit") {
      if (this.searchBar.searchText != "") {
        // console.log("search");
        this.unitService
          .getallUnitsSearchPageChange(
            this.searchBar.searchText,
            event.pageSize,
            event.pageIndex + 1
          )
          .subscribe((va: any) => {
            this.matTableDataSource = new MatTableDataSource(va);
          })
          .add(() => {
            this.pageChangerLoading = false;
          });
      } else {
        this.unitService
          .getallPropertiesUnits(event.pageSize, event.pageIndex + 1)
          .subscribe((va: any) => {
            this.matTableDataSource = new MatTableDataSource(va.units);
          })
          .add(() => {
            this.pageChangerLoading = false;
          });
      }
    }
  }

  fetchData(type: string, limit?: number) {
    if (this.searchBar != undefined) {
      this.searchBar.searchText = "";
    }

    if (type == "property") {
      this.propertyService
        .getAllPropertiesPagination(limit == undefined ? 5 : limit, 1)
        .subscribe((va: any) => {
          console.log(va);
          this.matTableDataSource = new MatTableDataSource(va.prop);
          this.tableLength = va.count;
        })
        .add(() => {
          this.pageChangerLoading = false;
          this.isContentLoading = false;
        });
    } else if (type == "user") {
      this.userService
        .getAllUsersAdminPagination(limit == undefined ? 5 : limit, 1)
        .subscribe((va: any) => {
          this.matTableDataSource = new MatTableDataSource(va.users);
          this.tableLength = va.count;
        })
        .add(() => {
          this.isContentLoading = false;
          this.pageChangerLoading = false;
        });
    } else if (type == "unit") {
      this.unitService
        .getallPropertiesUnits(limit == undefined ? 5 : limit, 1)
        .subscribe((va: any) => {
          this.matTableDataSource = new MatTableDataSource(va.units);
          this.tableLength = va.count;
        })
        .add(() => {
          this.isContentLoading = false;
          this.pageChangerLoading = false;
        });
    }
  }

  getFirstDataHeader() {
    switch (this.data.type) {
      case "property":
        return "Name";
      case "user":
        return "Name";
      case "unit":
        return "Unit No.";
      default:
        break;
    }
  }

  getFirstDataValue(element) {
    switch (this.data.type) {
      case "property":
        return element.property_name;
      case "user":
        return element.name;
      case "unit":
        return element.unit_no;
      default:
        break;
    }
  }

  getSecondDataHeader() {
    switch (this.data.type) {
      case "property":
        return "Address";
      case "user":
        return "Email";
      case "unit":
        return "Property Name";
      default:
        break;
    }
  }

  getSecondDataValue(element) {
    switch (this.data.type) {
      case "property":
        return element.address;
      case "user":
        return element.email;
      case "unit":
        return element.property_name;
      default:
        break;
    }
  }

  searchProperties(filterValue: any) {
    this.pageChangerLoading = true;
    if (this.type == "property") {
      if (filterValue != "") {
        this.propertyService
          .getallPropertiesSearch(
            filterValue,
            this.paginator.pageSize,
            this.paginator.pageIndex + 1
          )
          .subscribe((va: any) => {
            this.matTableDataSource = new MatTableDataSource(va.prop);
            this.tableLength = va.count;
          })
          .add(() => {
            this.pageChangerLoading = false;
          });
      } else {
        this.fetchData(this.type, this.paginator.pageSize);
      }
    } else if (this.type == "user") {
      if (filterValue != "") {
        this.userService
          .getallUsersSearch(
            filterValue,
            this.paginator.pageSize,
            this.paginator.pageIndex + 1
          )
          .subscribe((va: any) => {
            // console.log(va);
            this.matTableDataSource = new MatTableDataSource(va.users);
            this.tableLength = va.count;
          })
          .add(() => {
            this.pageChangerLoading = false;
          });
      } else {
        this.fetchData(this.type, this.paginator.pageSize);
      }
    } else if (this.type == "unit") {
      if (filterValue != "") {
        this.unitService
          .getallPropertiesUnitsSearch(
            filterValue,
            this.paginator.pageSize,
            this.paginator.pageIndex + 1
          )
          .subscribe((va: any) => {
            this.matTableDataSource = new MatTableDataSource(va.units);
            this.tableLength = va.count;
          })
          .add(() => {
            this.pageChangerLoading = false;
          });
      } else {
        this.fetchData(this.type, this.paginator.pageSize);
      }
    }
  }

  onCloseDialog(selected_val) {
    if (this.type == "unit") {
      if (this.payment == undefined) {
        if (
          selected_val.property_id == this.prop_id &&
          selected_val.status == "vacant"
        ) {
          this.dialogRef.close(selected_val);
        }
      } else {
        if (
          selected_val.property_id == this.prop_id &&
          selected_val.status == "occupied"
        ) {
          this.dialogRef.close(selected_val);
        }
      }
    } else if (this.type == "property") {
      this.dialogRef.close(selected_val);
    } else if (this.type == "user") {
      if (this.user_type == "owner") {
        if (
          selected_val.user_type == "owner" ||
          selected_val.user_type == "new_user"
        ) {
          this.dialogRef.close(selected_val);
        }
      } else if (this.user_type == "tenant") {
        if (selected_val.user_type == "new_user") {
          this.dialogRef.close(selected_val);
        }
      }
    }
  }
}
