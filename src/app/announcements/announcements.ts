import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { AddAnnouncementDialog } from "app/components/add-announcement-dialog/add-announcement-dialog";
import { AnnouncementDetailsDialog } from "app/components/announcement-details-dialog/announcement-details-dialog";
import { EditAnnouncementDialog } from "app/components/edit_announcement_dialog/edit_announcement_dialog";
import { TableSearchBarComponent } from "app/components/searchbar-table/searchbar-table";
import { AnnouncementService } from "app/services/announcement.service";
import { FirebaseService } from "app/services/firebase.service";

@Component({
  selector: "announcements",
  templateUrl: "./announcements.html",
  styleUrls: ["./announcements.scss"],
})
export class Announcements implements OnInit {
  //dataSource = ELEMENT_DATA;

  allAnnouncement: any[] = [];
  displayedColumns: string[] = [
    // "name",
    "id",
    "title",
    "building",
    "emergency",
    "date",
    "more",
  ];
  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;
  allAnnouncementMatTableData: MatTableDataSource<any>;
  ngAfterViewInitInitialize: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  pageChangerLoading: boolean = false;
  @ViewChild(TableSearchBarComponent) searchBar: TableSearchBarComponent;

  tableLength: number = 0;

  constructor(
    private announcementService: AnnouncementService,
    private firebaseService: FirebaseService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {
    // this.isLoading = true;
    this.isContentLoading = true;
    this.getScreenSize();
  }

  screenHeight: number;
  screenWidth: number;
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  refreshTable() {
    this.isContentLoading = true;
    this.fetchData();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      verticalPosition: "top",
      horizontalPosition: "right",
      duration: 3000,
    });
  }

  addAnnouncements() {
    this.dialog
      .open(AddAnnouncementDialog, {
        width: "60%",
        //height: "40rem",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res != undefined) {
          this.fetchData();
          this.openSnackBar("Announcement added successfully", "Close");

          this.firebaseService
            .sendAnnouncementNotification(
              "New Announcement",
              "Dear tenants new Announcement has been posted. Thank you.",
              res.prop_id
            )
            .subscribe((res) => {
              // console.log(res);
            });
        }
      });
  }

  openAnnouncementDetails(ann_data) {
    this.dialog
      .open(AnnouncementDetailsDialog, {
        width: "70%",
        data: ann_data,
      })
      .afterClosed()
      .subscribe((res) => {});
  }

  deleteAnnouncement(ann_id, index) {
    this.announcementService
      .deleteAnnouncement(JSON.stringify({ id: ann_id }))
      .subscribe(async (res) => {
        // console.log(res);
        if (res == true) {
          this.allAnnouncement.splice(index, 1);
          this.allAnnouncementMatTableData.data = this.allAnnouncement;
          this.openSnackBar("Announcement deleted successfully", "Close");
        }
      });
  }

  fetchData(limit?): any {
    if (this.searchBar != undefined) {
      this.searchBar.searchText = "";
    }
    this.announcementService
      .getAllAnnouncementPagination(limit == undefined ? 10 : limit, 1)
      .subscribe((va: any) => {
        this.allAnnouncement = va.ann;
        this.allAnnouncementMatTableData = new MatTableDataSource(va.ann);
        this.tableLength = va.count;
      })
      .add(() => {
        this.isContentLoading = false;
        this.pageChangerLoading = false;
      });
  }

  openEditProperty(data, index) {
    this.dialog
      .open(EditAnnouncementDialog, {
        width: "60%",
        data,
      })
      .afterClosed()
      .subscribe((value) => {
        if (value != undefined) {
          this.fetchData();
          this.openSnackBar("Announcement updated successfully", "Close");
        }
      });
  }

  async ngOnInit() {
    this.fetchData();
  }

  pageChange(event) {
    this.pageChangerLoading = true;
    if (this.searchBar.searchText != "") {
      this.announcementService
        .getallAnnouncementSearchPageChange(
          this.searchBar.searchText,
          event.pageSize,
          event.pageIndex + 1
        )
        .subscribe((va: any) => {
          this.allAnnouncement = va;
          this.allAnnouncementMatTableData = new MatTableDataSource(va);
        })
        .add(() => {
          this.pageChangerLoading = false;
        });
    } else {
      this.announcementService
        .getAllAnnouncementPagination(event.pageSize, event.pageIndex + 1)
        .subscribe((va: any) => {
          console.log(va);
          this.allAnnouncement = va.ann;
          this.allAnnouncementMatTableData = new MatTableDataSource(va.ann);
        })
        .add(() => {
          this.pageChangerLoading = false;
        });
    }
  }

  searchAnnouncements(filterValue: any) {
    this.pageChangerLoading = true;
    if (filterValue != "") {
      this.announcementService
        .getallAnnouncementSearch(
          filterValue,
          this.paginator.pageSize,
          this.paginator.pageIndex + 1
        )
        .subscribe((va: any) => {
          // console.log(va);
          this.allAnnouncement = va.ann;
          this.allAnnouncementMatTableData = new MatTableDataSource(va.ann);
          this.tableLength = va.count;
        })
        .add(() => {
          this.pageChangerLoading = false;
        });
    } else {
      this.fetchData(this.paginator.pageSize);
    }
  }

  navigateToPropertyDetailsPage(prop_id) {
    this.router.navigate(["/property-details"], {
      queryParams: { prop_id: prop_id },
    });
  }
}
