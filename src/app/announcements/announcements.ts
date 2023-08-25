import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { AddAnnouncementDialog } from "app/components/add-announcement-dialog/add-announcement-dialog";
import { AnnouncementDetailsDialog } from "app/components/announcement-details-dialog/announcement-details-dialog";
import { EditAnnouncementDialog } from "app/components/edit_announcement_dialog/edit_announcement_dialog";
import { AdminService } from "app/services/admin.service";

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
  constructor(
    private appAdminService: AdminService,
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
    this.selectAllAnnouncement();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      verticalPosition: "top",
      horizontalPosition: "right",
      duration: 3000,
    });
  }

  ngAfterViewInit() {}

  addAnnouncements() {
    this.dialog
      .open(AddAnnouncementDialog, {
        width: "60%",
        //height: "40rem",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res != undefined) {
          this.selectAllAnnouncement();
          this.openSnackBar("Announcement added successfully", "Close");
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

  deleteAnnouncement(ann_id) {
    this.appAdminService
      .deleteAnnouncement(JSON.stringify({ id: ann_id }))
      .subscribe((res) => {
        if (res.status == 1) {
          this.refreshTable();
          this.openSnackBar("Announcement deleted successfully", "Close");
        }
      });
  }

  selectAllAnnouncement(): any {
    this.appAdminService
      .selectAllAnnouncement()
      .subscribe((val: any[]) => {
        this.allAnnouncement = val;
        this.allAnnouncementMatTableData = new MatTableDataSource<any>(val);
        setTimeout(() => {
          if (this.allAnnouncementMatTableData != undefined) {
            this.allAnnouncementMatTableData.paginator = this.paginator;
          } else {
            setTimeout(() => {
              this.allAnnouncementMatTableData.paginator = this.paginator;
            }, 3000);
          }
        });
      })
      .add(() => {
        this.isContentLoading = false;
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
          this.selectAllAnnouncement();
          this.openSnackBar("Announcement updated successfully", "Close");
        }
      });
  }

  async ngOnInit() {
    this.selectAllAnnouncement();
  }

  applyFilter(filterValue: any) {
    var val = new String(filterValue).trim().toLowerCase();
    this.allAnnouncementMatTableData.filter = val;
  }

  navigateToPropertyDetailsPage(prop_id) {
    this.router.navigate(["/property-details"], {
      queryParams: { prop_id: prop_id },
    });
  }
}
