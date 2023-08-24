import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AddAnnouncementDialog } from "app/components/add-announcement-dialog/add-announcement-dialog";
import { AdminService } from "app/services/admin.service";
import { EditAnnouncementDialog } from "app/components/edit_announcement_dialog/edit_announcement_dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { TableFiltersComponent } from "app/components/table-filters/table-filters";
export interface PeriodicElement {
  Id: number;
  Building:string;
  Type: boolean;
  Title: string;

}

// const ELEMENT_DATA: PeriodicElement[] = [
//   {Id: 1, Type:'Emergancy', Title: 'Water supply', Description: 'Water Supply will not availabe today from 9:00AM to 1:00PM',Building:"Building-1"},
 
// ];

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
    "Id",
    "Emergency",
    "Building Name",
    "Title",
    "More"
  ];
  isUserSignedIn: boolean = false;

  // isLoading: boolean = false;
  isContentLoading: boolean = false;
  annoucement_data: Object |any ;
  display_msg: boolean = false;
  msg: string;
  item_deleted: boolean = false;
  MatTableData: MatTableDataSource<any>;
  ngAfterViewInitInitialize: boolean = false;

  @ViewChild("announcement_paginator") paginator: MatPaginator;
  constructor(
    private appAdminService: AdminService,
    private dialog: MatDialog
  ) {
    // this.isLoading = true;
    this.isContentLoading = true;
   // console.log(this.isContentLoading);
    this.selectAllAnnouncement();
    this.getScreenSize();
  }

  screenHeight: number;
  screenWidth: number;
  @HostListener("window:resize", ["$event"])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
  }

  ngAfterViewInit() {
  }
  
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
    console.log(a_id);
    this.more_menu_all_data = "";
    this.appAdminService
      .selectAllAnnouncement(JSON.stringify({ a_id: a_id }))
      .subscribe((value) => {
        this.more_menu_all_data = value;
        //console.log(this.more_menu_all_data);
      })
      .add(() => {
        this.more_menu_loaded = true;
      });
  }

  selectAllAnnouncement(): any {
    // let data = {
    // };
    // this.appAdminService
    //   .selectAllAnnouncement(JSON.stringify(data))
    //   .subscribe((val) => {
    //     this.annoucement_data = val;
    //     console.log( this.annoucement_data);
    //   })
    //this.isContentLoading = false;
    let data = {};
    this.appAdminService
      .selectAllAnnouncement(JSON.stringify(data))
      .subscribe((val: any[]) => {
        this.annoucement_data = val;
        console.log(this.annoucement_data);
        this.MatTableData = this.annoucement_data;
        this.MatTableData = new MatTableDataSource<any>(this.annoucement_data);
        setTimeout(() => {
          if (this.MatTableData != undefined) {
            this.MatTableData.paginator = this.paginator;
          } else {
            setTimeout(() => {
              this.MatTableData.paginator = this.paginator;
            }, 3000);
          }
        });
      })
        // .add(() => {
        //   this.isContentLoading = false;
        // });
   
  }
  
  // deleteAnnouncement(data: any) {

  //   this.display_msg = true;
  //   this.appAdminService.deleteAnnouncement(data).subscribe((value: any) => {
  //     console.log(data);
  //     if (value.status == 1) {
  //       this.msg = value.msg;
  //       console.log(this.msg);
  //       this.item_deleted = true;
  //       this.selectAllAnnouncement();
  //     } else {
  //       this.msg = value.msg;
  //       console.log(this.msg);
  //       this.item_deleted = false;
  //     }
  //   });
  //   setTimeout(() => {
  //     this.display_msg = false;
  //   }, 2000);
  // }

  

  openEditProperty(index) {
    
    if (this.more_menu_all_data != undefined) {
      var data = this.more_menu_all_data;
      console.log(this.more_menu_all_data);
      this.dialog
        .open(EditAnnouncementDialog, {
          width: "50%",
          // height: "30rem",
          data,
        })
        .afterClosed()
        .subscribe((value) => {
          if (value != undefined) {
            sessionStorage.removeItem("admin_properties_session");
            // this.allAnnouncement[index].title =
            //   value.title != undefined
            //     ? value.title
            //     : this.allAnnouncement[index].title;

            // this.allAnnouncement[index].address =
            //   value.property_address != undefined
            //     ? value.property_address
            //     : this.allAnnouncement[index].address;
            // this.allAnnouncement[index].property_type =
            //   value.property_building_type != undefined
            //     ? value.property_building_type
            //     : this.allAnnouncement[index].property_type;

            // this.allAnnouncement[index].locality_name =
            //   value.property_locality != undefined
            //     ? value.property_locality
            //     : this.allAnnouncement[index].locality_name;
          }
        });
    }
  }

  async ngOnInit() {
    this.selectAllAnnouncement();
  }
}

  

