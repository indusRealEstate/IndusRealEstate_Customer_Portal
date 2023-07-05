import { Component, HostListener, OnInit, ViewChild, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { AdminService } from "app/services/admin.service";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { EmailServices } from "app/services/email.service";
import { AdminViewTenantDialog } from "app/components/admin-view-tenant-dialog/admin-view-tenant-dialog";

@Component({
  selector: "app-admin-all-tenants-clients",
  templateUrl: "./admin-all-tenants-clients.html",
  styleUrls: ["./admin-all-tenants-clients.scss"],
})
export class AdminAllTenantClients implements OnInit {
  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;

  displayedColumns: string[] = [
    "client",
    "email",
    "address",
    "phone-no",
    "nationality",
    "joined-date",
    "more",
  ];

  usrImgPath: any = "https://indusre.app/api/upload/img/user/";

  allTenants: any[] = [];
  allTenantsMatTableData: MatTableDataSource<any>;
  ngAfterViewInitInitialize: boolean = false;

  loadingTable: any[] = [1, 2, 3, 4, 5];

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
    if (user[0]["auth_type"] == "admin") {
      this.route.queryParams.subscribe((e) => {
        if (e == null) {
          router.navigate([`/admin-all-tenants`], {
            queryParams: { uid: user[0]["id"] },
          });
        } else if (e != user[0]["id"]) {
          router.navigate([`/admin-all-tenants`], {
            queryParams: { uid: user[0]["id"] },
          });
        }
      });
    } else {
      router.navigate([`/404`]);
    }
  }

  viewClient(data) {}

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
      });
    }
  }

  refreshTable() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    sessionStorage.removeItem("all-tenants-session");
    this.isContentLoading = true;

    this.adminService
      .getAllClients(user[0]["id"], "tenant")
      .subscribe((va: any[]) => {
        this.allTenants = va;
        this.allTenantsMatTableData.data = va;
        setTimeout(() => {
          if (this.allTenantsMatTableData != undefined) {
            this.allTenantsMatTableData.paginator = this.paginator;
            this.allTenantsMatTableData.paginator._changePageSize(10);
          }
        });
      })
      .add(() => {
        this.isContentLoading = false;
        if (this.allTenants.length != 0) {
          sessionStorage.setItem(
            "all-tenants-session",
            JSON.stringify({
              data: this.allTenants,
            })
          );
        }
      });
  }

  async ngOnInit() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.userAuth = user[0]["auth_type"];

    var myDocsDataSession = JSON.parse(
      sessionStorage.getItem("all-tenants-session")
    );

    if (myDocsDataSession != null) {
      this.allTenants = myDocsDataSession["data"];
      this.allTenantsMatTableData = new MatTableDataSource(this.allTenants);
      this.isContentLoading = false;
      this.ngAfterViewInitInitialize = true;
    } else {
      this.adminService
        .getAllClients(user[0]["id"], "tenant")
        .subscribe((data: any[]) => {
          this.allTenants = data;
          this.allTenantsMatTableData = new MatTableDataSource(data);
          setTimeout(() => {
            if (this.allTenantsMatTableData != undefined) {
              this.allTenantsMatTableData.paginator = this.paginator;
              this.allTenantsMatTableData.paginator._changePageSize(10);
            }
          });
        })
        .add(() => {
          this.isContentLoading = false;
          if (this.allTenants.length != 0) {
            sessionStorage.setItem(
              "all-tenants-session",
              JSON.stringify({
                data: this.allTenants,
              })
            );
          }
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
  // @Input() user_data;

  rowClicked(data:object){
    // this.user_data = data;
    this.dialog.open(AdminViewTenantDialog,{
      data: {
        data: data,
      },
      width: "65%",
      height: "45rem",
    })
  }
}
 