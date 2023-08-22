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
  selector: "edit_announcement_dialog",
  styleUrls: ["./edit_announcement_dialog.scss"],
  templateUrl: "./edit_announcement_dialog.html",
})
export class EditAnnouncementDialog implements OnInit {
  all_data: any;
  @ViewChild("fileInput") fileInput: ElementRef;
  @ViewChild("fileInputImage") fileInputImage: ElementRef;

  title: any = "";
  p_id: any = "";
  p_name: any = "";
  building_name: any = "";
  description: any = "";
  emergency: boolean = false;
  announce_id: number;
  properties: any[] = [];
  selected_property: any = "";
  property_id: any;
  formNotFilled: boolean = false;
  uploading: boolean = false;
  uploaded: boolean = false;
  //property_building_type: any = "";
  //  buildingName: DropDownButtonModel[] = [
  //   { value: "alsima tower", viewValue: "alsima tower" },
  //   { value: "Marina gate", viewValue: "Marina gate" },
    
  // ];
  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditAnnouncementDialog>,
    private adminService: AdminService
  ) {

    this.all_data = data;

    this.title = this.all_data.a_title;
    //this.building_name = this.all_data.a_building;
    this.selected_property = this.all_data.selected_property;
    this.description = this.all_data.a_description;
    this.emergency = this.all_data.a_emergency;
    this.p_id = this.all_data.p_id;
    this.p_name = this.all_data.p_name;

    this.getAllPropertiesName();
    console.log(this.properties);
    
  }

  
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
  
  ngOnInit() {}

  ngAfterViewInit() {}

  closeDialogWithoutSaving() {
    this.dialogRef.close();
  }

  onCloseDialog() {
    
    this.dialogRef.close({
      title: this.uploaded == true ? this.title : undefined,
      selected_property:
        this.uploaded == true ? this.selected_property : undefined,
        description:
        this.uploaded == true ? this.description : undefined,
      emergency:
        this.uploaded == true ? this.emergency : undefined,
     
    });
  }

 
 

  onSubmit() {

    
      if (
        this.title != "" &&
        this.building_name != "" &&
        this.description != ""
      ) {
        this.uploading = true;
        let announce_id = this.all_data.a_id;
        let data = this.setupData(announce_id);

        this.adminService.updateAnnouncement(data).subscribe((value) => {
          console.log(announce_id);
          if (value == "success") {
            console.log("edited successfully");
            console.log(announce_id);
            
          }

          console.log(value);
        });
      } else {
        this.formNotFilled = true;
        setTimeout(() => {
          this.formNotFilled = false;
        }, 3000);
      }
    
  }
  setupData(announce_id: any): string {
    var data = {
      id: announce_id,
      title: this.title,
      building_name: this.building_name,
      emergency: this.emergency,
      description: this.description,
      p_id:this.p_id,
      p_name:this.p_name
      
    };
console.log(data);
    return JSON.stringify(data);
  }

}
