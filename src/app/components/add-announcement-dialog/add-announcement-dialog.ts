import { HttpEvent, HttpEventType } from "@angular/common/http";
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AdminService } from "app/services/admin.service";
import { catchError, last, map, tap } from "rxjs";
import * as uuid from "uuid";

// interface DropDownButtonModel {
//   value: string;
//   viewValue: string;
// }

@Component({
  selector: "add-announcement-dialog",
  styleUrls: ["./add-announcement-dialog.scss"],
  templateUrl: "./add-announcement-dialog.html",
})
export class AddAnnouncementDialog implements OnInit {
  router: any;
  @ViewChild("fileInput") fileInput: ElementRef;
  @ViewChild("fileInputImage") fileInputImage: ElementRef;
  type: boolean = false;
  building_name: any = "";
  title: any = "";
  description: any = "";
  uploading: boolean = false;
  formNotFilled: boolean = false;
  properties: any[] = [];
  selected_property: any = "";
  property_id: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddAnnouncementDialog>,
    private adminService: AdminService
  ) {
    this.getAllPropertiesName();
    console.log(this.properties);
  }

  
  
  
  // buildingName: DropDownButtonModel[] = [
  //   { value: "alsima tower", viewValue: "alsima tower" },
  //   { value: "Marina gate", viewValue: "Marina gate" },
    
  // ];


  getAllPropertiesName() {
    this.adminService.getallPropertiesAdmin().subscribe((val: any[]) => {
      val.forEach((item) =>
        this.properties.push({
          value: item.property_id,
          viewValue: item.property_name,
        })

      );
    });
  }

  ngOnInit() {
    
   }

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close();
  }

  setupData(): string {
    var data = {
      type: this.type,
      property_id:this.selected_property,
      
      //building: this.building_name,
      title: this.title,
      description: this.description,
    };
  console.log(this.selected_property);
    return JSON.stringify(data);
  }
  onSubmit() {
    
      if (
        // this.building_name != "" &&
        this.title != "" &&
        this.description != "" &&
        this.property_id!= ""
      ) {
        this.uploading = true;
       
        var data = this.setupData();
        this.adminService.addAnnouncement(data).subscribe((val) => {

          if (val == "success") {
            //this.router.navigateByUrl('/announcements',{ queryParams: { val: val } });
            //this.dialogRef.close();
           // window.location.reload();
          }
          else{
            console.log("not inserted");
          }
        });
      } else {
        this.formNotFilled = true;
        setTimeout(() => {
          this.formNotFilled = false;
        }, 3000);
      }
    
  }
  
  
  
}
