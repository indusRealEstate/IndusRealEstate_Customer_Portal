import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { AddAnnouncementDialog } from "app/components/add-announcement-dialog/add-announcement-dialog";
import { EditAnnouncementDialog } from "app/components/edit_announcement_dialog/edit_announcement_dialog";
import { AdminService } from "app/services/admin.service";

@Component({
  selector: "announcements",
  templateUrl: "./announcements.html",
  styleUrls: ["./announcements.scss"],
})
export class Announcements implements OnInit {
  //dataSource = ELEMENT_DATA;

  more_menu_all_data: any = "";
  allAnnouncement: any[] = [];
  more_menu_loaded: boolean = false;
  displayedColumns: string[] = [
    // "name",
    "id",
    "emergency",
    "building",
    "title",
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

  ngAfterViewInit() {}

  addAnnouncements() {
    this.dialog
      .open(AddAnnouncementDialog, {
        width: "60%",
        //height: "40rem",
      })
      .afterClosed()
      .subscribe((res) => {
        this.selectAllAnnouncement();
      });
  }

  openMoreMenu(a_id) {
    this.more_menu_all_data = "";
    this.appAdminService
      .selectSingleAnnouncementDetail(JSON.stringify({ a_id: a_id }))
      .subscribe((value) => {
        this.more_menu_all_data = value;
      })
      .add(() => {
        this.more_menu_loaded = true;
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

  openEditProperty(index) {
    if (this.more_menu_all_data != undefined) {
      var data = this.more_menu_all_data;
      this.dialog
        .open(EditAnnouncementDialog, {
          width: "60%",
          data,
        })
        .afterClosed()
        .subscribe((value) => {
          if (value != undefined) {
          }
        });
    }
  }

  async ngOnInit() {
    this.selectAllAnnouncement();
  }
}
