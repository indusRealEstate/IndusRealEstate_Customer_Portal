import { Component, OnInit, Inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ApiService } from "app/services/api.service";
import { RelatedDocsDialog } from "../related-documents/related-documents";
import { ViewImageDialog } from "../view-image-dialog/view-image-dialog";
import { RelatedRequestsDialog } from "../related-requests/related-requests";

@Component({
  selector: "admin-view-tenant-dialog",
  styleUrls: ["./admin-view-tenant-dialog.scss"],
  templateUrl: "./admin-view-tenant-dialog.html",
})
export class AdminViewTenantDialog implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AdminViewTenantDialog>,
    private apiService: ApiService,
    private router: Router,
    private dialog?: MatDialog
  ) {
    this.isImagesLoading = true;
    this.tenant_data = data["data"];
    
  }

  tenant_data: any;
   

  usrImgPath: any = "https://indusre.app/api/upload/img/user/";
  imagesUrl: any;

  propertyImgs: any[] = [];
  isImagesLoading: boolean = false;

  isImageDisplaying: boolean = false;

  images: any[] = [];
  imageIndex: any;

  ngOnInit() {
    this.setupImgs();
    
  }

  ngAfterViewInit() {
    this.getImagesUrl();
    console.log(this.tenant_data);
  }

  onCloseDialog() {
    this.dialogRef.close();
  }

  messageUser() {
    var tenant_user_id = new String(this.tenant_data.profile_photo).split(
      "."
    )[0];
    var userData = localStorage.getItem("currentUser");
    var user_id = JSON.parse(userData)[0]["id"];
    this.router.navigate(["/user-chats"], {
      queryParams: { uid: user_id, chat_uid: tenant_user_id },
    });

    this.dialogRef.close();
  }

  setupImgs() {
    var raw_json = this.tenant_data.property_images;
    this.propertyImgs = JSON.parse(raw_json).img;

    setTimeout(() => {
      if (this.imagesUrl != undefined) {
        for (let index = 0; index < this.propertyImgs.length; index++) {
          this.images.push(
            `${this.imagesUrl}/${this.tenant_data.property_id}/${this.propertyImgs[index]}`
          );
        }
      }
    });
  }

  getImagesUrl() {
    this.imagesUrl = this.apiService.getBaseUrlImages();
    setTimeout(() => {
      this.isImagesLoading = false;
    });
  }

  getPropertyImage(prop_id) {
    return `${this.imagesUrl}/${this.tenant_data.property_id}/${prop_id}`;
  }

  navigateToPropertyDetailsPage() {
    this.dialogRef.close();
    this.router.navigate(["/property-page"], {
      queryParams: { propertyId: this.tenant_data.property_id },
    });
  }

  viewRelatedDoc() {
    this.dialog.open(RelatedDocsDialog, {
      data: {
        prop_id: this.tenant_data.property_id,
      },
      width: "60%",
      height: "45rem",
    });
  }

  viewRelatedReq() {
    this.dialog.open(RelatedRequestsDialog, {
      data: {
        prop_id: this.tenant_data.property_id,
      },
      width: "60%",
      height: "45rem",
    });
  }

  viewPropImage(prop_id) {
    this.dialog.open(ViewImageDialog, {
      data: {
        img: `${this.imagesUrl}/${this.tenant_data.property_id}/${prop_id}`,
      },
      width: "60%",
      height: "45rem",
    });
  }
}