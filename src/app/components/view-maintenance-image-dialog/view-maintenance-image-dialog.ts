import { Component, Inject, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { AdminService } from "app/services/admin.service";
// import { DownloadService } from "app/services/download.service";
// import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
  MatDialogModule
} from "@angular/material/dialog";




@Component({
  selector: "view-maintenance-image-dialog",
  styleUrls: ["./view-maintenance-image-dialog.scss"],
  templateUrl: "./view-maintenance-image-dialog.html",
  
})
export class ViewMaintenanceImageDialog implements OnInit {
  request_id:string;
  all_data: Object| any;
  img_array: string[] = [];
  isContentLoading: boolean;
  media: string;
  media_array: string[] = [];

  
  
 
  constructor(
    // private dialogRef: MatDialogRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewMaintenanceImageDialog>,
    private appAdminService: AdminService,
    // private appdownloadService: DownloadService,
  ) {
   
   this.request_id = data.id;
   console.log(this.request_id);
  }

  ngAfterViewInit() {}
  ngOnInit() {

    // setTimeout(() => {
    //   this.isContentLoading = true;
    // }, 1000);

    let data = {
      request_id: this.request_id
    };

    console.log(data);

    this.appAdminService
      .getRequestsDetails(JSON.stringify(data)).subscribe((val) => {
        
        this.all_data = val;
        console.log(this.all_data);
        this.media = this.all_data.main_media;
        console.log(JSON.parse(this.media));
       
        for(let i = 0; i < JSON.parse(this.media).length; i++ ){
         this.media_array.push(JSON.parse(this.media)[i]);
        }
       console.log(this.media_array);
        //  this.property_name = this.prop_data.property_name;
      })
      .add(() => {
        this.isContentLoading = true;
         //console.log(this.isContentLoading);
      });

     
      
  }
 

  downloadDoc() {
    window.open(
      `https://indusre.app/api/mobile_app/upload/service-request/${this.all_data.main_request_id}/${this.media_array}`
    );
    
  }

  onCloseDialog() {
    this.dialogRef.close({
      
    });
  }
}
