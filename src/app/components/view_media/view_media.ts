import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { saveAs } from "file-saver";
import { AdminService } from "app/services/admin.service";
import { ApiService } from "app/services/api.service";
import { DownloadService } from "app/services/download.service";

@Component({
  selector: "app_dialog_view_media",
  styleUrls: ["./view_media.scss"],
  templateUrl: "./view_media.html",
})
export class DialogViewMedia implements OnInit {
  @Output() valueEmitter: EventEmitter<boolean> = new EventEmitter();
  // @ViewChild("msg") msg;

  media_array: string[] = [];
  image_type_array: string[] = ["png", "jpg", "jpeg", "webp", "bmp", "tiff"];
  video_type_array: string[] = [
    "mp4",
    "mov",
    "wmv",
    "avi",
    "avchd",
    "mkv",
    "flv",
    "f4v",
    "swf",
    "webm",
  ];
  link: string = "";
  all_data: any;
  image_loaded: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogViewMedia>,
    private downloadServices: DownloadService
  ) {
    
    this.all_data = data; 
    this.link = this.all_data.link;

    // console.log(this.link);
  }

  get_image_data(event) {}

  ngOnInit() {
    for (let i = 0; i < JSON.parse(this.all_data.data).length; i++) {
      this.media_array.push(JSON.parse(this.all_data.data)[i]);
    }
  }

  ngAfterViewInit() {}

  onCloseDialog() {
    this.dialogRef.close({});
  }

  downloadItem(data: any, type: string, file: string) {
    this.downloadServices.download(data).subscribe((res) => {
      console.log(res);
    });
  }

  checkImageLoaded(data: any) {
    setTimeout(()=>{
      this.image_loaded = true;
    },1000)
  }
}
