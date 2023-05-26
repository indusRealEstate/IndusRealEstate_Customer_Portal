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
  selector: "app-documents-individual",
  templateUrl: "./individual-docs.html",
  styleUrls: ["./individual-docs.scss"],
})
export class IndividualDocumentsComponent implements OnInit {
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
    "docName",
    "uploadDate",
    "docSize",
    "propertyName",
    "links",
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

  userDetails: any;
  params: any;
  doc_path: any;

  isUserDetailsLoading: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly route: ActivatedRoute,
    private adminService: AdminService,
    private dialog?: MatDialog
  ) {
    // this.isLoading = true;
    this.isContentLoading = true;
    this.isUserDetailsLoading = true;

    this.getScreenSize();
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    if (user[0]["auth_type"] == "admin") {
      this.route.queryParams.subscribe((e) => {
        this.route.queryParams.subscribe((e) => {
          this.initFunction(e);
          this.params = e;
        });
      });
    } else {
      router.navigate([`/404`]);
    }
  }


  initFunction(param: any) {
    this.imagesUrl = this.apiService.getBaseUrlImages();
    this.doc_path = this.apiService.getBaseUrlDocs();
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.userAuth = user[0]["auth_type"];

    this.adminService
      .getUserAllDocuments(user[0]["id"], param["userId"])
      .subscribe((data: any[]) => {
        this.allDocuments = data;
        this.allDocumentsMatTableData = new MatTableDataSource(data);
        setTimeout(() => {
          this.isContentLoading = false;
        }, 50);
      });

    this.apiService.getUser(param["userId"]).subscribe((userdata) => {
      this.userDetails = userdata[0];

      setTimeout(() => {
        this.isUserDetailsLoading = false;
      }, 100);
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
    setTimeout(() => {
      if (this.allDocumentsMatTableData != undefined) {
        this.allDocumentsMatTableData.paginator = this.paginator;
        this.allDocumentsMatTableData.paginator._changePageSize(10);
      }
    }, 1000);
  }

  refreshTable() {
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.isContentLoading = true;

    this.adminService
      .getUserAllDocuments(user[0]["id"], this.params["userId"])
      .subscribe((va: any[]) => {
        this.allDocuments = va;
        this.allDocumentsMatTableData = new MatTableDataSource(va);
        setTimeout(() => {
          this.isContentLoading = false;
        }, 50);
      })
      .add(() => {
        setTimeout(() => {
          if (this.allDocumentsMatTableData != undefined) {
            this.allDocumentsMatTableData.paginator = this.paginator;
            this.allDocumentsMatTableData.paginator._changePageSize(10);
          }
        }, 500);
      });
  }

  ngOnInit() {}

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
    var document = {
      path: doc.document_path,
    };
    var userData = localStorage.getItem("currentUser");
    var user = JSON.parse(userData);
    this.dialog.open(ViewDocDialog, {
      data: {
        doc: document,
        user_id: user[0]["id"],
      },
      width: "60%",
      height: "45rem",
    });
  }
}
