import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { AdminService } from "app/services/admin.service";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { EmailServices } from "app/services/email.service";
import { Router } from "@angular/router";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { ViewDocDialog } from "app/components/view-doc-dialog/view-doc-dialog";
import { ViewTenantDialog } from "app/components/view-tenant-dialog/view-tenant-dialog";
import { TableSearchBarComponent } from "app/components/searchbar-table/searchbar-table";

@Component({
  selector: "app-my-tenants",
  templateUrl: "./my-tenants.html",
  styleUrls: ["./my-tenants.scss"],
})
export class MyTenantsLandlord implements OnInit {
  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;

  // displayedColumns: string[] = [
  //   // "name",
  //   "issueDate",
  //   "reqNo",
  //   "reqType",
  //   "propertyName",
  //   "clientName",
  //   "status",
  //   "actions",
  // ];

  displayedColumns: string[] = [
    "tenant",
    "email",
    "address",
    "phone-no",
    "nationality",
    "more",
  ];

  usrImgPath: any = "https://indusre.app/api/upload/img/user/";

  allTenants: any[] = [];
  allTenantsMatTableData: MatTableDataSource<any>;
  ngAfterViewInitInitialize: boolean = false;

  loadingTable: any[] = [1, 2, 3, 4, 5];
  allTenantsSearched: any[] = [];

  isUserSearchedRequests: boolean = false;
  isUserSearchedEmpty: boolean = false;

  searchString: any = "";

  main_table_search_source: any;

  imagesUrl: any;

  userAuth: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private adminService: AdminService,
    private dialog?: MatDialog,
    private emailServices?: EmailServices
  ) {
    // this.isLoading = true;
    this.isContentLoading = true;

    this.getScreenSize();
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    if (user[0]["auth_type"] != "admin") {
      this.route.queryParams.subscribe((e) => {
        if (e == null) {
          router.navigate([`/my-tenants`], {
            queryParams: { uid: user[0]["id"] },
          });
        } else if (e != user[0]["id"]) {
          router.navigate([`/my-tenants`], {
            queryParams: { uid: user[0]["id"] },
          });
        }
      });
    } else {
      router.navigate([`/404`]);
    }
  }

  viewTenant(t_data) {
    this.dialog.open(ViewTenantDialog, {
      data: {
        data: t_data,
      },
      width: "65%",
      height: "45rem",
    });
  }

  screenHeight: number;
  screenWidth: number;
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  isUserSignOut() {
    if (this.authenticationService.currentUserValue) {
      this.isUserSignedIn = true;
    } else {
      this.isUserSignedIn = false;
      this.router.navigate(["/login"]);
    }
  }

  ngAfterViewInit() {
    if (this.ngAfterViewInitInitialize == true) {
      if (this.allTenantsMatTableData != undefined) {
        this.allTenantsMatTableData.paginator = this.paginator;
        this.allTenantsMatTableData.paginator._changePageSize(10);
      }
    } else {
      setTimeout(() => {
        if (this.allTenantsMatTableData != undefined) {
          this.allTenantsMatTableData.paginator = this.paginator;
          this.allTenantsMatTableData.paginator._changePageSize(10);
        }
      }, 1000);
    }
  }

  refreshTable() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    sessionStorage.removeItem("my-tenants-session");
    this.isContentLoading = true;

    this.apiService
      .getLandlordTenants(user[0]["id"])
      .subscribe((va: any[]) => {
        this.allTenants = va;
        this.allTenantsMatTableData = new MatTableDataSource(va);
        setTimeout(() => {
          this.isContentLoading = false;
          if (this.allTenants.length != 0) {
            sessionStorage.setItem(
              "my-tenants-session",
              JSON.stringify({
                data: this.allTenants,
              })
            );
          }
        }, 50);
      })
      .add(() => {
        setTimeout(() => {
          if (this.allTenantsMatTableData != undefined) {
            this.allTenantsMatTableData.paginator = this.paginator;
            this.allTenantsMatTableData.paginator._changePageSize(10);
          }
        }, 500);
      });
  }

  async ngOnInit() {
    this.imagesUrl = this.apiService.getBaseUrlImages();
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.userAuth = user[0]["auth_type"];

    var myDocsDataSession = JSON.parse(
      sessionStorage.getItem("my-tenants-session")
    );

    if (myDocsDataSession != null) {
      this.allTenants = myDocsDataSession["data"];
      this.allTenantsMatTableData = new MatTableDataSource(this.allTenants);
      this.isContentLoading = false;
      this.ngAfterViewInitInitialize = true;
    } else {
      this.apiService
        .getLandlordTenants(user[0]["id"])
        .subscribe((data: any[]) => {
          this.allTenants = data;
          this.allTenantsMatTableData = new MatTableDataSource(data);

          setTimeout(() => {
            this.isContentLoading = false;
            if (this.allTenants.length != 0) {
              sessionStorage.setItem(
                "my-tenants-session",
                JSON.stringify({
                  data: this.allTenants,
                })
              );
            }
          }, 100);
        });
    }
  }

  getTenant_id(user) {
    return new String(user.profile_photo).split(".")[0];
  }

  applyFilter(filterValue: any) {
    var val = new String(filterValue).trim().toLowerCase();
    this.allTenantsMatTableData.filter = val;
  }
}
