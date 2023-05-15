import { Component, OnInit, HostListener, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { AdminService } from "app/services/admin.service";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { EmailServices } from "app/services/email.service";
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { ViewDocDialog } from "app/components/view-doc-dialog/view-doc-dialog";
import { ViewTenantDialog } from "app/components/view-tenant-dialog/view-tenant-dialog";

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

  usrImgPath: any = "https://indusmanagement.ae/api/upload/img/user/";

  allTenants: any[] = [];
  allTenantsMatTableData: MatTableDataSource<any>;
  ngAfterViewInitInitialize: boolean = false;

  loadingTable: any[] = [1, 2, 3, 4, 5];
  allTenantsSearched: any[] = [];

  isUserSearchedRequests: boolean = false;
  isUserSearchedEmpty: boolean = false;

  searchString: any = "";

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

  viewDoc(t_data) {
    this.dialog.open(ViewTenantDialog, {
      data: {
        data: t_data,
      },
      width: "70%",
      height: "40rem",
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
      this.allTenantsMatTableData = new MatTableDataSource(this.allTenants);
      this.allTenantsMatTableData.paginator = this.paginator;
    } else {
      setTimeout(() => {
        this.allTenantsMatTableData = new MatTableDataSource(this.allTenants);
        this.allTenantsMatTableData.paginator = this.paginator;
      }, 1000);
    }
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
      // this.isLoading = false;
      this.isContentLoading = false;
      this.ngAfterViewInitInitialize = true;
    } else {
      await this.initFunction(user[0]["id"], user[0]["auth_type"]);
    }
  }

  async initFunction(userId, auth) {
    var data = localStorage.getItem("currentUser");
    var user = JSON.parse(data);
    var userId = user[0]["id"];

    this.apiService.getLandlordTenants(userId).subscribe((data: any[]) => {
      this.allTenants = data;
      console.log(data);
    });
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
    }, 1000);
  }
}
