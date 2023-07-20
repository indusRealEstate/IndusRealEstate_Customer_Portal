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
  doc_path: any;

  usrImgPath: any = "https://indusre.app/api/upload/img/user/";

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private adminService: AdminService,
    private apiService: ApiService,
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
        router.navigate([`/all-clients-documents`], {
          queryParams: { uid: user[0]["id"] },
        });
      } else if (e != user[0]["id"]) {
        router.navigate([`/all-clients-documents`], {
          queryParams: { uid: user[0]["id"] },
        });
      }
    });
  }

  refreshTable() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    sessionStorage.removeItem("all-clients-docs-session");
    this.isContentLoading = true;

    this.adminService
      .getAllClientsDocuments(user[0]["id"])
      .subscribe((va: any[]) => {
        this.allDocuments = va;
        this.allDocumentsMatTableData = new MatTableDataSource(va);
        setTimeout(() => {
          if (this.allDocumentsMatTableData != undefined) {
            this.allDocumentsMatTableData.paginator = this.paginator;
            this.allDocumentsMatTableData.paginator._changePageSize(10);
          }
        });
      })
      .add(() => {
        this.isContentLoading = false;
        if (this.allDocuments.length != 0) {
          sessionStorage.setItem(
            "all-clients-docs-session",
            JSON.stringify({
              data: this.allDocuments,
            })
          );
        }
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
      if (this.allDocumentsMatTableData != undefined) {
        this.allDocumentsMatTableData.paginator = this.paginator;
        this.allDocumentsMatTableData.paginator._changePageSize(10);
      }
    } else {
      setTimeout(() => {
        if (this.allDocumentsMatTableData != undefined) {
          this.allDocumentsMatTableData.paginator = this.paginator;
          this.allDocumentsMatTableData.paginator._changePageSize(10);
        }
      });
    }
  }

  async ngOnInit() {
    this.doc_path = this.apiService.getBaseUrlDocs();
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.userAuth = user[0]["auth_type"];

    var myDocsDataSession = JSON.parse(
      sessionStorage.getItem("all-clients-docs-session")
    );

    if (myDocsDataSession != null) {
      this.allDocuments = myDocsDataSession["data"];
      this.allDocumentsMatTableData = new MatTableDataSource(this.allDocuments);
      this.isContentLoading = false;
      this.ngAfterViewInitInitialize = true;
    } else {
      this.adminService
        .getAllClientsDocuments(user[0]["id"])
        .subscribe((data: any[]) => {
          this.allDocuments = data;
          this.allDocumentsMatTableData = new MatTableDataSource(data);
          setTimeout(() => {
            if (this.allDocumentsMatTableData != undefined) {
              this.allDocumentsMatTableData.paginator = this.paginator;
              this.allDocumentsMatTableData.paginator._changePageSize(10);
            }
          });
        })
        .add(() => {
          this.isContentLoading = false;
          if (this.allDocuments.length != 0) {
            sessionStorage.setItem(
              "all-clients-docs-session",
              JSON.stringify({
                data: this.allDocuments,
              })
            );
          }
        });
    }
  }

  applyFilter(filterValue: any) {
    var val = new String(filterValue).trim().toLowerCase();
    this.allDocumentsMatTableData.filter = val;
  }

  downloadDoc(doc) {
    var document_url = `${this.doc_path}/${doc.document_path}`;
    // console.log(document_url);
    // window.open(document_url);

    this.apiService.downloadFile(document_url).subscribe((v) => {
      // console.log(v);
      const url = window.URL.createObjectURL(v);
      window.open(url);
    });
  }

  viewDoc(doc) {
    var document_url = `${this.doc_path}/${doc.document_path}`;
    // console.log(document_url);
    // window.open(document_url);

    this.apiService.downloadFile(document_url).subscribe((v) => {
      // console.log(v);
      const url = window.URL.createObjectURL(v);
      window.open(url);
    });
  }
}
