import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { AdminService } from "app/services/admin.service";
import { ApiService } from "app/services/api.service";
import { AuthenticationService } from "app/services/authentication.service";
import { EmailServices } from "app/services/email.service";

@Component({
  selector: "app-admin-all-landlord-clients",
  templateUrl: "./admin-all-landlord-clients.html",
  styleUrls: ["./admin-all-landlord-clients.scss"],
})
export class AdminAllLandlordClients implements OnInit {
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

  allLandlords: any[] = [];
  allLandlordsMatTableData: MatTableDataSource<any>;
  ngAfterViewInitInitialize: boolean = false;

  loadingTable: any[] = [1, 2, 3, 4, 5];

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

    this.route.queryParams.subscribe((e) => {
      if (e == null) {
        router.navigate([`/admin-all-landlords`], {
          queryParams: { uid: user[0]["id"] },
        });
      } else if (e != user[0]["id"]) {
        router.navigate([`/admin-all-landlords`], {
          queryParams: { uid: user[0]["id"] },
        });
      }
    });
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
      if (this.allLandlordsMatTableData != undefined) {
        this.allLandlordsMatTableData.paginator = this.paginator;
        this.allLandlordsMatTableData.paginator.pageSize = 10;
      }
    } else {
      setTimeout(() => {
        if (this.allLandlordsMatTableData != undefined) {
          this.allLandlordsMatTableData.paginator = this.paginator;
          this.allLandlordsMatTableData.paginator.pageSize = 10;
        }
      });
    }
  }

  refreshTable() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    sessionStorage.removeItem("all-landlords-session");
    this.isContentLoading = true;

    this.adminService
      .getAllClients(user[0]["id"], "landlord")
      .subscribe((va: any[]) => {
        this.allLandlords = va;
        this.allLandlordsMatTableData.data = va;
        setTimeout(() => {
          if (this.allLandlordsMatTableData != undefined) {
            this.allLandlordsMatTableData.paginator = this.paginator;
            this.allLandlordsMatTableData.paginator.pageSize = 10;
          }
        });
      })
      .add(() => {
        this.isContentLoading = false;
        if (this.allLandlords.length != 0) {
          sessionStorage.setItem(
            "all-landlords-session",
            JSON.stringify({
              data: this.allLandlords,
            })
          );
        }
      });
  }

  async ngOnInit() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    var myDocsDataSession = JSON.parse(
      sessionStorage.getItem("all-landlords-session")
    );

    if (myDocsDataSession != null) {
      this.allLandlords = myDocsDataSession["data"];
      this.allLandlordsMatTableData = new MatTableDataSource(this.allLandlords);
      this.isContentLoading = false;
      this.ngAfterViewInitInitialize = true;
    } else {
      this.adminService
        .getAllClients(user[0]["id"], "landlord")
        .subscribe((data: any[]) => {
          console.log(data);
          this.allLandlords = data;
          this.allLandlordsMatTableData = new MatTableDataSource(data);
          setTimeout(() => {
            if (this.allLandlordsMatTableData != undefined) {
              this.allLandlordsMatTableData.paginator = this.paginator;
              this.allLandlordsMatTableData.paginator.pageSize = 10;
            }
          });
        })
        .add(() => {
          this.isContentLoading = false;
          if (this.allLandlords.length != 0) {
            sessionStorage.setItem(
              "all-landlords-session",
              JSON.stringify({
                data: this.allLandlords,
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
    this.allLandlordsMatTableData.filter = val;
  }
}
