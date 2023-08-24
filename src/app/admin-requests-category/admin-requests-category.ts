import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { AddCategoryDialog } from "app/components/add_category_dialog/add_category_dialog";
import { EditCategoryDialog } from "app/components/edit_category_dialog/edit_category_dialog";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";

@Component({
  selector: "admin-requests-spam",
  templateUrl: "./admin-requests-category.html",
  styleUrls: ["./admin-requests-category.scss"],
})
export class AdminRequestsCategory implements OnInit {
  isUserSignedIn: boolean = false;
  isCategoryLoading: boolean = false;
  categoryData: any[] = [];
  main_array: any[];
  msg: string;
  item_deleted: boolean = false;
  is_active: boolean = false;
  item_inserted: boolean = false;

  property_id: any = "all";

  unitTypes: any[] = [
    { testfield: true },
    { value: "all", viewValue: "All Categories" },
  ];

  unitTypesFilter: any[] = [];

  searchTextValue: any = "";

  categories_props: any[] = [];

  @ViewChild("inputBox") inputBox!: ElementRef;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private apiAdminService: AdminService
  ) {
    this.isCategoryLoading = true;
    this.unitTypesFilter = this.unitTypes;

    this.apiAdminService.getallUnitTypes().subscribe((val: any[]) => {
      val.forEach((unit_type) => {
        this.unitTypes.push({
          value: unit_type.id,
          viewValue: unit_type.type,
        });
      });
    });
  }

  screenHeight: number;
  screenWidth: number;
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      verticalPosition: "top",
      horizontalPosition: "right",
      duration: 3000,
    });
  }

  selectUnitType(event) {
    this.unitTypesFilter = this.unitTypes;
    // console.log(event.value);
    if (event.value == "all" || event.value == undefined) {
      this.categories_props = this.categoryData;
    } else {
      this.categories_props = this.categoryData.filter(
        (catg) => catg.unit_type == event.value
      );
    }
  }

  resetMatSelect() {
    this.searchTextValue = "";
    this.unitTypesFilter = [...this.unitTypes];
  }

  focusOnInput($event) {
    this.inputBox.nativeElement.focus();
    $event.stopPropagation();
    $event.preventDefault();
  }

  searchUnitType(searchText, $event) {
    $event.stopPropagation();
    if (searchText == "") {
      this.unitTypesFilter = [...this.unitTypes];
    } else {
      var val = new String(searchText).trim().toLowerCase();
      var data = this.unitTypes.filter((prop) =>
        String(prop.viewValue).toLowerCase().startsWith(val)
      );

      this.unitTypesFilter.splice(1, this.unitTypesFilter.length - 1);
      data.forEach((p) => {
        this.unitTypesFilter.push(p);
      });
    }
  }

  getDataFromChild(value: boolean) {
    // console.log(value);
  }

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  openWindow() {
    this.dialog
      .open(AddCategoryDialog, {
        width: "50vw",
        height: "auto",
      })
      .afterClosed()
      .subscribe((val) => {
        // console.log(val);
        this.item_inserted = val.status;
        this.msg = val.msg;

        if (this.item_inserted == true) {
          this.openSnackBar("Category Added Succesfully", "Close");
          this.selectAllCategories();
        }
      });
  }

  ngAfterViewInit() {}

  selectAllCategories(): any {
    this.apiAdminService
      .selecteCategory()
      .subscribe((val: any[]) => {
        // console.log(val);
        this.categoryData = val;
        this.categories_props = val;
      })
      .add(() => {
        this.isCategoryLoading = false;
      });

    return this.categoryData;
  }

  async ngOnInit() {
    this.selectAllCategories();
    // console.log(this.category_dialog.form_submit);
  }

  delete_item(data: any) {
    this.apiAdminService
      .deleteServiceCategory(data)
      .subscribe((value: any) => {
        if (value.status == 1) {
          this.msg = value.msg;
          this.item_deleted = true;
          this.selectAllCategories();
        } else {
          this.msg = value.msg;
          this.item_deleted = false;
        }
      })
      .add(() => {
        this.openSnackBar("Category Deleted Succesfully", "Close");
      });
  }

  stauts_change(event, id) {
    // console.log(event.checked);

    let status = event.checked == true ? 1 : 0;
    let data = {
      status: status,
      id: id,
    };
    let json_format = JSON.stringify(data);

    this.apiAdminService
      .changeCategoryStatus(json_format)
      .subscribe((value: any) => {
        // console.log(value);
        this.selectAllCategories();
      });
  }

  edit_item(data: any) {
    this.dialog
      .open(EditCategoryDialog, {
        width: "50vw",
        height: "50vh",
        data,
      })
      .afterClosed()
      .subscribe((val) => {
        // console.log(val);
        this.item_inserted = val.status;
        this.msg = val.msg;

        if (this.item_inserted == true) {
          this.openSnackBar("Category Edited Succesfully", "Close");
          this.selectAllCategories();
        }
      });
  }

  // viewCategory(data: any) {
  //   this.dialog
  //     .open(EditCategoryDialog, {
  //       data,
  //     })
  //     .afterClosed()
  //     .subscribe((val) => {
  //       this.selectAllCategories();
  //     });
  // }
}
