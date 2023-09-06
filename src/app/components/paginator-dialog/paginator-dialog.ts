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

@Component({
  selector: "paginator-dialog",
  styleUrls: ["./paginator-dialog.scss"],
  templateUrl: "./paginator-dialog.html",
})
export class PaginatorDialog implements OnInit {
  type: any = "";
  tableLength: number = 0;
  matTableDataSource: MatTableDataSource<any>;

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
    public userService: UserService
  ) {
    this.type = data.type;

    if (data.type == "property") {
      this.fetchData(data.type);
    } else if (data.type == "user") {
      this.fetchData(data.type);
    }
  }

  getTitle(type) {
    switch (type) {
      case "property":
        return "Property";
      case "user":
        return "User";

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
    }
  }

  getName(element) {
    switch (this.data.type) {
      case "property":
        return element.property_name;
      case "user":
        return element.name;

      default:
        break;
    }
  }

  getSecondData(element) {
    switch (this.data.type) {
      case "property":
        return element.address;
      case "user":
        return element.email;

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
    }
  }

  onCloseDialog(selected_val) {
    this.dialogRef.close(selected_val);
  }
}
