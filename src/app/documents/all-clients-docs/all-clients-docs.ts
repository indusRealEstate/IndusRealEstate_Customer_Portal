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

@Component({
  selector: "app-all-clients-docs",
  templateUrl: "./all-clients-docs.html",
  styleUrls: ["./all-clients-docs.scss"],
})
export class AllClientsDocuments implements OnInit {
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
    // "name",
    "client_details",
    "document_name",
    "doc_size",
    "client_property",
    "more",
  ];

  allDocuments: any[] = [];
  allDocumentsMatTableData: MatTableDataSource<any>;
  ngAfterViewInitInitialize: boolean = false;

  loadingTable: any[] = [1, 2, 3, 4, 5];
  allDocumentsSearched: any[] = [];

  isUserSearchedRequests: boolean = false;
  isUserSearchedEmpty: boolean = false;

  searchString: any = "";

  imagesUrl: any;

  userAuth: any;

  usrImgPath: any = "https://indusre.app/api/upload/img/user/";

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
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
          router.navigate([`/all-clients-documents`], {
            queryParams: { uid: user[0]["id"] },
          });
        } else if (e != user[0]["id"]) {
          router.navigate([`/all-clients-documents`], {
            queryParams: { uid: user[0]["id"] },
          });
        }
      });
    } else {
      router.navigate([`/404`]);
    }
  }

  viewDoc(doc) {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.dialog.open(ViewDocDialog, {
      data: {
        doc: doc,
        user_id: user[0]["id"],
        auth_type: user[0]["auth_type"],
      },
      width: "1300px",
      height: "700px",
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
      this.allDocumentsMatTableData = new MatTableDataSource(this.allDocuments);
      this.allDocumentsMatTableData.paginator = this.paginator;
    } else {
      setTimeout(() => {
        this.allDocumentsMatTableData = new MatTableDataSource(
          this.allDocuments
        );
        this.allDocumentsMatTableData.paginator = this.paginator;
      }, 1000);
    }
  }

  async ngOnInit() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.userAuth = user[0]["auth_type"];

    var myDocsDataSession = JSON.parse(
      sessionStorage.getItem("my-docs-session")
    );

    if (myDocsDataSession != null) {
      this.allDocuments = myDocsDataSession["data"];
      // this.isLoading = false;
      this.isContentLoading = false;
      this.ngAfterViewInitInitialize = true;
    } else {
      await this.initFunction(user[0]["id"], this.userAuth);
    }
  }

  async initFunction(userId, auth) {
    var data = localStorage.getItem("currentUser");
    var user = JSON.parse(data);
    var userId = user[0]["id"];

    this.adminService
      .getAllClientsDocuments(userId)
      .subscribe((data: any[]) => {
        this.allDocuments = data;
        console.log(this.allDocuments);
      });
    setTimeout(() => {
      this.isContentLoading = false;
      if (this.allDocuments.length != 0) {
        sessionStorage.setItem(
          "my-docs-session",
          JSON.stringify({
            data: this.allDocuments,
          })
        );
      }
    }, 1500);
  }
}
