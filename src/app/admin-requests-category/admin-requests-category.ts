import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
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
  display_msg: boolean = false;
  is_active: boolean = false;

  property_id: any = "all";

  properties: any[] = [
    { testfield: true },
    { value: "all", viewValue: "All Categories" },
  ];

  propertiesFilter: any[] = [];

  searchTextValue: any = "";

  categories_props: any[] = [];

  @ViewChild("inputBox") inputBox!: ElementRef;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    public dialog: MatDialog,
    private apiAdminService: AdminService
  ) {
    this.isCategoryLoading = true;
    this.propertiesFilter = this.properties;

    var propertiesDataSession = JSON.parse(
      sessionStorage.getItem("admin_properties_session")
    );

    if (propertiesDataSession == null) {
      this.apiAdminService.getallPropertiesAdmin().subscribe((val: any[]) => {
        val.forEach((prop) => {
          this.properties.push({
            value: prop.property_id,
            viewValue: prop.property_name,
          });
        });
      });
    } else {
      propertiesDataSession.forEach((prop) => {
        this.properties.push({
          value: prop.property_id,
          viewValue: prop.property_name,
        });
      });
    }
  }

  screenHeight: number;
  screenWidth: number;
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  selectProperty(event) {
    this.propertiesFilter = this.properties;
    // console.log(event.value);
    if (event.value == "all" || event.value == undefined) {
      this.categories_props = this.categoryData;
    } else {
      this.categories_props = this.categoryData.filter(
        (catg) => catg.prop_id == event.value
      );
    }
  }

  resetMatSelect() {
    this.searchTextValue = "";
    this.propertiesFilter = [...this.properties];
  }

  focusOnInput($event) {
    this.inputBox.nativeElement.focus();
    $event.stopPropagation();
    $event.preventDefault();
  }

  searchBuilding(searchText, $event) {
    $event.stopPropagation();
    if (searchText == "") {
      this.propertiesFilter = [...this.properties];
    } else {
      var val = new String(searchText).trim().toLowerCase();
      var data = this.properties.filter((prop) =>
        String(prop.viewValue).toLowerCase().startsWith(val)
      );

      this.propertiesFilter.splice(1, this.propertiesFilter.length - 1);
      data.forEach((p) => {
        this.propertiesFilter.push(p);
      });
    }
  }

  getDataFromChild(value: boolean) {
    console.log(value);
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
        data: {
          category_name: "sample",
          icon: "sample_icon",
        },
      })
      .afterClosed()
      .subscribe((val) => {
        this.selectAllCategories();
      });
  }

  ngAfterViewInit() {}

  selectAllCategories(): any {
    this.apiAdminService
      .selecteCategory()
      .subscribe((val: any[]) => {
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
    this.display_msg = true;
    this.apiAdminService.deleteServiceCategory(data).subscribe((value: any) => {
      if (value.status == 1) {
        this.msg = value.msg;
        this.item_deleted = true;
        this.selectAllCategories();
      } else {
        this.msg = value.msg;
        this.item_deleted = false;
      }
    });
    setTimeout(() => {
      this.display_msg = false;
    }, 2000);
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
        data,
      })
      .afterClosed()
      .subscribe((val) => {
        this.selectAllCategories();
      });
  }

  viewCategory(data: any) {
    this.dialog
      .open(EditCategoryDialog, {
        data,
      })
      .afterClosed()
      .subscribe((val) => {
        this.selectAllCategories();
      });
  }
}
