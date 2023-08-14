import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { TableFiltersComponent } from "app/components/table-filters/table-filters";
import { AdminService } from "app/services/admin.service";
import { AuthenticationService } from "app/services/authentication.service";

interface Staff {
  value: string;
  viewValue: string;
}
@Component({
  selector: "admin-report",
  templateUrl: "./admin-report.html",
  styleUrls: ["./admin-report.scss"],
  
})
export class AdminReport implements OnInit {
  staff: Staff[] = [
    {value: 'Property', viewValue: 'Property'},
    {value: 'Unit', viewValue: 'Unit'},
    {value: 'Lease', viewValue: 'Lease'},
    {value: 'User', viewValue: 'User'},
  ];

  
  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;

  
  // allUsersMatTableData: MatTableDataSource<any>;
  // ngAfterViewInitInitialize: boolean = false;

  // loadingTable: any[] = [1, 2, 3, 4, 5];

  // statusMenuOpened: boolean = false;
  // flaggedRequest: boolean = false;

  // allProperties: any[] = [];
  // allUnits: any[] = [];

  // @ViewChild(MatPaginator) paginator: MatPaginator;

  // @ViewChild("table_filter") table_filter: TableFiltersComponent;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private adminService: AdminService,
    private dialog: MatDialog
  ) {
    // this.isLoading = true;
    this.isContentLoading = true;

    this.getScreenSize();
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);

    // this.route.queryParams.subscribe((e) => {
    //   if (e == null) {
    //     router.navigate([`/all-users`], {
    //       queryParams: { uid: user[0]["id"] },
    //     });
    //   } else if (e != user[0]["id"]) {
    //     router.navigate([`/all-users`], {
    //       queryParams: { uid: user[0]["id"] },
    //     });
    //   }
    // });
  }

  screenHeight: number;
  screenWidth: number;
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  // isUserSignOut() {
  //   if (this.authenticationService.currentUserValue) {
  //     this.isUserSignedIn = true;
  //   } else {
  //     this.isUserSignedIn = false;
  //     this.router.navigate(["/login"]);
  //   }
  // }

  ngAfterViewInit() {
   
  }

  

  

  

  async ngOnInit() {
    
  }

  
}
