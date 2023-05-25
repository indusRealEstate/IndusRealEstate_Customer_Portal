import { HttpClient } from "@angular/common/http";
import { SimpleChange } from "@angular/core";
import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ApiService } from "app/services/api.service";

@Component({
  selector: "view-image-dialog",
  styleUrls: ["./view-image-dialog.scss"],
  templateUrl: "./view-image-dialog.html",
})
export class ViewImageDialog implements OnInit {
  isLoading: boolean = false;
  detectLoaderChanges: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewImageDialog>,
    private router: Router,
    private http: HttpClient,
    private service: ApiService
  ) {
    this.isLoading = true;

    this.img_data = data["img"];
  }

  img_data: any;

  @ViewChild("loader_container")
  ngx_container: ElementRef;

  @ViewChild("img_container")
  img_container: ElementRef;

  public ngx_theme = {
    "width.px": "600",
    "height.px": "600",
  };

  old_container_width: any;

  img_container_width: any;

  ngDoCheck() {
    if (this.ngx_container != undefined) {
      if (
        this.old_container_width != this.ngx_container.nativeElement.offsetWidth
      ) {
        this.ngx_theme[
          "width.px"
        ] = `${this.ngx_container.nativeElement.offsetWidth}`;
        this.detectLoaderChanges = true;
        setTimeout(() => {
          this.detectLoaderChanges = false;
        }, 0);
        this.old_container_width = this.ngx_container.nativeElement.offsetWidth;
      }
    }
  }

  ngOnInit() {
    if (this.ngx_container != undefined) {
      this.old_container_width = this.ngx_container.nativeElement.offsetWidth;
    }

    setTimeout(() => {
      this.isLoading = false;
      if (this.img_container != undefined) {
        this.img_container_width = this.img_container.nativeElement.offsetWidth;
      }
    }, 200);
  }

  onCloseDialog() {
    this.dialogRef.close();
  }
}
