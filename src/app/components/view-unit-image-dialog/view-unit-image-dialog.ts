import { Component, Inject, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { AdminService } from "app/services/admin.service";
import { DownloadService } from "app/services/download.service";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
  MatDialogModule
} from "@angular/material/dialog";




@Component({
  selector: "view-unit-image-dialog",
  styleUrls: ["./view-unit-image-dialog.scss"],
  templateUrl: "./view-unit-image-dialog.html",
  
})
export class ViewUnitImageDialog implements OnInit {
  request_id:string;
  all_data: Object| any;
  unit_img_array: string[] = [];
  isContentLoading: boolean;
  image: string;
  unit_id: string;
 
  
  
 
  constructor(
    // private dialogRef: MatDialogRef,
    public dialogRef: MatDialogRef<ViewUnitImageDialog>,
    private appAdminService: AdminService,
    private appdownloadService: DownloadService,
  ) {
   
    
  }

  ngAfterViewInit() {}
  ngOnInit() {
    let data = {
      unit_id: this.unit_id
    };
    this.appAdminService
      .getRequestsDetails(JSON.stringify(data)).subscribe((val) => {
       // console.log(data);
        this.all_data = val;
        console.log(this.all_data);

        this.image = this.all_data.unit_images;
        console.log(JSON.parse(this.image));

        for(let i = 0; i < JSON.parse(this.image).length; i++ ){
         this.unit_img_array.push(JSON.parse(this.image)[i]);
        }
       
        //  this.property_name = this.prop_data.property_name;
      })
      .add(() => {
        this.isContentLoading = false;
        // console.log(this.isContentLoading);
      });

     
      
  }
  

  downloadDoc() {
    window.open(
      `https://www.indusre.app/api/mobile_app/upload/service-request/${this.all_data.main_request_id}/${this.unit_img_array}`
    );
    
  }

  onCloseDialog() {
    this.dialogRef.close({
      
    });
  }
}
