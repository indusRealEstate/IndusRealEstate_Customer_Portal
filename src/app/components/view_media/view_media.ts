import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
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
    private downloadService: DownloadService
  ) {
    this.all_data = data;
    this.link = this.all_data.link;

    console.log(data);
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
    // this.downloadService
    //   .downloadFile(
    //     `https://www.indusre.app/api/mobile_app/upload/service-request/${this.all_data.lease_contract_id}/documents/${this.selectDoc}`
    //   )
    //   .subscribe((res: Blob) => {
    //     console.log(res);
    //     FileSaver.saveAs(res, this.selectDoc);
    //   });
  }

  checkImageLoaded(data: any) {
    setTimeout(() => {
      this.image_loaded = true;
    }, 1000);
  }
}
